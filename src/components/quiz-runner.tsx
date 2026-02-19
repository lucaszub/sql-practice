"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getExercise } from "@/lib/exercises";
import { getDuckDb, type AsyncDuckDB } from "@/lib/db/duckdb";
import { executeQuery, loadSchema, resetSchema } from "@/lib/db/query-runner";
import { validateResult } from "@/lib/db/validator";
import { useQuizSession } from "@/lib/store/quiz-session";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseDescription } from "@/components/exercise-description";
import { SqlEditor } from "@/components/sql-editor";
import { ResultsTable } from "@/components/results-table";
import { TestResults } from "@/components/test-results";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Timer, X, SkipForward } from "lucide-react";
import type { ValidationResult, QueryResult } from "@/lib/exercises/types";

export function QuizRunner() {
  const router = useRouter();
  const {
    exerciseIds,
    currentIndex,
    config,
    answers,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    timeExpired,
    resetQuiz,
  } = useQuizSession();

  const exerciseId = exerciseIds[currentIndex];
  const exercise = getExercise(exerciseId);
  const currentAnswer = answers[exerciseId];
  const isSubmitted = !!currentAnswer?.submitted;
  const isLast = currentIndex === exerciseIds.length - 1;

  // DB
  const [db, setDb] = useState<AsyncDuckDB | null>(null);
  const [dbReady, setDbReady] = useState(false);

  // Editor / results
  const [currentSql, setCurrentSql] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Timer — use refs for stable callbacks, avoids interval reset on re-render
  const [timeLeftMs, setTimeLeftMs] = useState(config.timeLimitMs);
  const timeExpiredRef = useRef(timeExpired);
  const isSubmittedRef = useRef(isSubmitted);
  timeExpiredRef.current = timeExpired;
  isSubmittedRef.current = isSubmitted;

  useEffect(() => {
    getDuckDb().then(setDb);
  }, []);

  useEffect(() => {
    if (!db || !exercise) return;
    setDbReady(false);
    resetSchema(db, exercise.schema)
      .then(() => setDbReady(true))
      .catch(console.error);
  }, [db, exercise, exerciseId]);

  // Reset local state on question change
  useEffect(() => {
    setCurrentSql("");
    setQueryResult(null);
    setValidationResults([]);
    setError(null);
    setTimeLeftMs(config.timeLimitMs);
  }, [exerciseId, config.timeLimitMs]);

  // Countdown timer — stable interval, no unstable deps
  useEffect(() => {
    if (config.timeLimitMs === 0) return;

    const interval = setInterval(() => {
      if (isSubmittedRef.current) return; // paused after submission
      setTimeLeftMs((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          timeExpiredRef.current();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [exerciseId, config.timeLimitMs]); // stable deps only — no functions

  const handleValidate = useCallback(async () => {
    if (!db || !exercise || !currentSql.trim() || isSubmitted || isRunning) return;

    setIsRunning(true);
    setError(null);

    try {
      await resetSchema(db, exercise.schema);
      const result = await executeQuery(db, currentSql);
      setQueryResult(result);

      const results: ValidationResult[] = [];
      for (const tc of exercise.testCases) {
        if (tc.setupSql) {
          try {
            await resetSchema(db, exercise.schema);
            await loadSchema(db, tc.setupSql);
            const tcResult = await executeQuery(db, currentSql);
            results.push(validateResult(tc, tcResult));
          } catch (err) {
            results.push({
              testCase: tc.name,
              passed: false,
              message: err instanceof Error ? err.message : String(err),
            });
          }
        } else {
          results.push(validateResult(tc, result));
        }
      }
      if (exercise.testCases.some((tc) => tc.setupSql)) {
        await resetSchema(db, exercise.schema);
      }

      setValidationResults(results);
      const passed = results.every((r) => r.passed);
      submitAnswer(exerciseId, currentSql, passed, results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      submitAnswer(exerciseId, currentSql, false, []);
    } finally {
      setIsRunning(false);
    }
  }, [db, exercise, currentSql, exerciseId, isSubmitted, isRunning, submitAnswer]);

  const handleSkip = useCallback(() => {
    skipQuestion(exerciseId);
  }, [skipQuestion, exerciseId]);

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleQuit = useCallback(() => {
    resetQuiz();
    router.push("/");
  }, [resetQuiz, router]);

  if (!exercise) return null;

  const allPassed =
    isSubmitted && validationResults.length > 0 && validationResults.every((r) => r.passed);
  const progressPct = ((currentIndex + 1) / exerciseIds.length) * 100;

  const timerMinutes = Math.floor(timeLeftMs / 60000);
  const timerSeconds = Math.floor((timeLeftMs % 60000) / 1000);
  const timerDisplay = `${timerMinutes}:${timerSeconds.toString().padStart(2, "0")}`;
  const timerWarning = config.timeLimitMs > 0 && timeLeftMs < 60_000 && timeLeftMs > 0;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b flex items-center justify-between h-12 px-4 shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={handleQuit}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground font-medium shrink-0">
            {currentIndex + 1} / {exerciseIds.length}
          </span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[60px]">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <Badge
            variant="outline"
            className={
              exercise.difficulty === "easy"
                ? "text-emerald-500 border-emerald-500/30 shrink-0"
                : exercise.difficulty === "medium"
                ? "text-amber-500 border-amber-500/30 shrink-0"
                : "text-red-500 border-red-500/30 shrink-0"
            }
          >
            {exercise.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {config.timeLimitMs > 0 && (
            <div
              className={`flex items-center gap-1.5 text-sm font-mono font-medium tabular-nums transition-colors ${
                timerWarning ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Timer className="h-3.5 w-3.5" />
              {timerDisplay}
            </div>
          )}
          {!isSubmitted && (
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              <SkipForward className="h-3.5 w-3.5 mr-1" />
              Skip
            </Button>
          )}
          {isSubmitted && (
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLast ? "See results" : <>Next <ChevronRight className="h-3.5 w-3.5 ml-1" /></>}
            </Button>
          )}
        </div>
      </header>

      {/* Body */}
      {!dbReady ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          {/* Left: description + schema — solution hidden until validated */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <ExerciseDescription exercise={exercise} allowSolution={isSubmitted} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: editor + results */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col">
                  <SqlEditor
                    value={currentSql}
                    onChange={setCurrentSql}
                    onRun={handleValidate}
                    isRunning={isRunning}
                  />
                  <div className="border-t px-3 py-2 flex items-center justify-between bg-muted/30 shrink-0">
                    {error ? (
                      <p className="text-xs text-red-500 font-mono truncate max-w-[65%]">{error}</p>
                    ) : isSubmitted && !currentAnswer?.skipped ? (
                      <span
                        className={`text-xs font-medium ${
                          allPassed ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {allPassed
                          ? "✓ All tests passed"
                          : `${validationResults.filter((r) => r.passed).length}/${validationResults.length} tests passed`}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Button
                      onClick={handleValidate}
                      disabled={isRunning || !currentSql.trim() || isSubmitted}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 shrink-0"
                    >
                      {isRunning ? "Running…" : isSubmitted ? "Validated" : "Validate"}
                    </Button>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={20}>
                <Tabs defaultValue="results" className="h-full flex flex-col">
                  <TabsList className="mx-3 mt-2">
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="tests">
                      Tests
                      {validationResults.length > 0 && (
                        <span
                          className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                            validationResults.every((r) => r.passed)
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {validationResults.filter((r) => r.passed).length}/
                          {validationResults.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="results" className="flex-1 overflow-auto mt-0">
                    <ResultsTable result={queryResult} error={error} />
                  </TabsContent>
                  <TabsContent value="tests" className="flex-1 overflow-auto mt-0 p-3">
                    <TestResults results={validationResults} testCases={exercise.testCases} />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
