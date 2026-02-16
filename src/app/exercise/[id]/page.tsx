"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getExercise, exercises } from "@/lib/exercises";
import { getDuckDb, type AsyncDuckDB } from "@/lib/db/duckdb";
import { executeQuery, loadSchema, resetSchema } from "@/lib/db/query-runner";
import { validateResult } from "@/lib/db/validator";
import { useExerciseSession } from "@/lib/store/exercise-session";
import { useProgressStore } from "@/lib/store/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Languages, Sun, Moon } from "lucide-react";
import { ExerciseDescription } from "@/components/exercise-description";
import { SqlEditor } from "@/components/sql-editor";
import { ResultsTable } from "@/components/results-table";
import { TestResults } from "@/components/test-results";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";



export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const exercise = getExercise(id);

  const {
    currentSql,
    setSql,
    queryResult,
    setQueryResult,
    validationResults,
    setValidationResults,
    isRunning,
    setIsRunning,
    error,
    setError,
    reset,
  } = useExerciseSession();

  const { markSolved, recordAttempt, progress } = useProgressStore();
  const { locale, toggle: toggleLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();

  const [db, setDb] = useState<AsyncDuckDB | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    reset();
    if (progress[id]?.lastAttempt) {
      setSql(progress[id].lastAttempt!);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!exercise) return;
    let cancelled = false;

    (async () => {
      try {
        const instance = await getDuckDb();
        if (cancelled) return;
        setDb(instance);

        await resetSchema(instance, exercise.schema);
        if (!cancelled) setDbReady(true);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise, id]);

  const handleRun = useCallback(async () => {
    if (!db || !exercise || isRunning) return;

    setIsRunning(true);
    setError(null);
    setQueryResult(null);
    setValidationResults([]);

    try {
      // Run user's query against base schema (for Results tab display)
      const result = await executeQuery(db, currentSql);
      setQueryResult(result);

      // Validate against all test cases
      const results: import("@/lib/exercises/types").ValidationResult[] = [];
      for (const tc of exercise.testCases) {
        if (tc.setupSql) {
          // Reload schema + execute setupSql + re-run user query
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

      // Restore base schema only if we modified it during validation
      if (exercise.testCases.some((tc) => tc.setupSql)) {
        await resetSchema(db, exercise.schema);
      }

      setValidationResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        markSolved(id, currentSql);
      } else {
        recordAttempt(id, currentSql);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      recordAttempt(id, currentSql);
    } finally {
      setIsRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, exercise, currentSql, isRunning, id]);

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold">{t("exercise.notFound")}</h2>
          <Button variant="link" onClick={() => router.push("/")}>
            {t("nav.backToExercises")}
          </Button>
        </div>
      </div>
    );
  }

  const currentIndex = exercises.findIndex((e) => e.id === id);
  const prevExercise = currentIndex > 0 ? exercises[currentIndex - 1] : null;
  const nextExercise =
    currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;

  const difficultyColor: Record<string, string> = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("nav.back")}
          </Button>
          <h1 className="text-lg font-semibold">{locale === "fr" && exercise.titleFr ? exercise.titleFr : exercise.title}</h1>
          <Badge variant="outline" className={difficultyColor[exercise.difficulty]}>
            {t(`difficulty.${exercise.difficulty}` as TranslationKey)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLocale} title={locale === "en" ? "Passer en français" : "Switch to English"}>
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {prevExercise && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/exercise/${prevExercise.id}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("nav.prev")}
            </Button>
          )}
          {nextExercise && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/exercise/${nextExercise.id}`)}
            >
              {t("nav.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {!dbReady ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">{t("exercise.loading")}</p>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize={40} minSize={25}>
            <ExerciseDescription exercise={exercise} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={50} minSize={20}>
                <SqlEditor
                  value={currentSql}
                  onChange={setSql}
                  onRun={handleRun}
                  isRunning={isRunning}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <Tabs defaultValue="results" className="h-full flex flex-col">
                  <TabsList className="mx-3 mt-2">
                    <TabsTrigger value="results">{t("exercise.results")}</TabsTrigger>
                    <TabsTrigger value="tests">
                      {t("exercise.tests")}
                      {validationResults.length > 0 && (
                        <span
                          className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                            validationResults.every((r) => r.passed)
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {validationResults.filter((r) => r.passed).length}/{validationResults.length}
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
