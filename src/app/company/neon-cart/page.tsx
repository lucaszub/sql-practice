"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getDuckDb, type AsyncDuckDB } from "@/lib/db/duckdb";
import { executeQuery, resetSchema } from "@/lib/db/query-runner";
import { validateResult } from "@/lib/db/validator";
import { neonCart } from "@/lib/companies/neon-cart";
import type { TableInfo } from "@/lib/companies/types";
import type { QueryResult, ValidationResult } from "@/lib/exercises/types";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Languages,
  Sun,
  Moon,
  Database,
  Table2,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";

// --- Inline Results Table (reuse patterns) ---
function InlineResultsTable({ result, error }: { result: QueryResult | null; error: string | null }) {
  const { t } = useLocale();
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!result) return [];
    return result.columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: (info: { getValue: () => unknown }) => {
        const val = info.getValue();
        if (val === null) return <span className="text-muted-foreground italic">NULL</span>;
        return String(val);
      },
    }));
  }, [result]);

  const table = useReactTable({
    data: result?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm font-medium text-destructive">{t("exercise.error")}</p>
          <pre className="mt-1 text-xs text-destructive/80 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        {t("exercise.runQuery")}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-muted/50 flex items-center justify-between">
        <span className="text-sm font-medium">{t("exercise.results")}</span>
        <span className="text-xs text-muted-foreground">
          {result.rowCount} {t("exercise.rows")} · {result.executionTimeMs.toFixed(1)}ms
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left font-medium text-muted-foreground border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1.5 font-mono text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Validation display ---
function ValidationDisplay({ validation }: { validation: ValidationResult | null }) {
  const { t } = useLocale();

  if (!validation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">{t("test.submitToSee")}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div
        className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
          validation.passed
            ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-900"
            : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-900"
        }`}
      >
        {validation.passed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {validation.passed ? t("test.allPassed") : validation.message}
          </p>
          {validation.passed && (
            <p className="text-xs text-muted-foreground mt-0.5">{t("test.greatJob")}</p>
          )}
        </div>
      </div>

      {!validation.passed && validation.columnMismatch && (
        <div className="text-xs space-y-1 bg-background/80 rounded p-2 font-mono border">
          <p>
            <span className="text-muted-foreground">{t("test.expectedColumns")} </span>
            {validation.columnMismatch.expected.join(", ")}
          </p>
          <p>
            <span className="text-muted-foreground">{t("test.gotColumns")} </span>
            {validation.columnMismatch.actual.join(", ")}
          </p>
        </div>
      )}

      {!validation.passed && validation.missingRows && validation.missingRows.length > 0 && (
        <div className="text-xs bg-background/80 rounded p-2 border">
          <p className="text-muted-foreground mb-1">{t("test.expectedRow")}</p>
          <pre className="font-mono text-[11px] whitespace-pre-wrap overflow-auto">
            {JSON.stringify(validation.missingRows[0], null, 2)}
          </pre>
        </div>
      )}

      {!validation.passed && validation.extraRows && validation.extraRows.length > 0 && (
        <div className="text-xs bg-background/80 rounded p-2 border">
          <p className="text-muted-foreground mb-1">{t("test.gotInstead")}</p>
          <pre className="font-mono text-[11px] whitespace-pre-wrap overflow-auto">
            {JSON.stringify(validation.extraRows[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// --- Table schema viewer ---
function TableViewer({
  table,
  locale,
  onPreview,
}: {
  table: TableInfo;
  locale: "en" | "fr";
  onPreview: (tableName: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Table2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-sm font-mono font-medium">{table.name}</span>
          <span className="text-xs text-muted-foreground">({table.rowCount})</span>
        </div>
        <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && (
        <div className="border-t px-3 py-2 space-y-2 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {locale === "fr" ? table.descriptionFr : table.description}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-1 font-medium">Column</th>
                <th className="text-left py-1 font-medium">Type</th>
                <th className="text-left py-1 font-medium">Null</th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col) => (
                <tr key={col.name} className="border-t border-border/50">
                  <td className="py-1 font-mono text-foreground">{col.name}</td>
                  <td className="py-1 font-mono text-muted-foreground">{col.type}</td>
                  <td className="py-1">{col.nullable ? <span className="text-yellow-600 dark:text-yellow-400">yes</span> : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="ghost" size="xs" className="text-xs" onClick={() => onPreview(table.name)}>
            <Play className="h-3 w-3 mr-1" />
            SELECT * FROM {table.name} LIMIT 10
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Main page ---
export default function NeonCartPage() {
  const router = useRouter();
  const { locale, toggle: toggleLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();

  const [db, setDb] = useState<AsyncDuckDB | null>(null);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Question state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [currentSql, setCurrentSql] = useState("");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("results");

  const company = neonCart;
  const activeQuestion = company.questions[activeQuestionIdx];

  // Initialize DuckDB
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const instance = await getDuckDb();
        if (cancelled) return;
        setDb(instance);
        await resetSchema(instance, company.schema);
        if (!cancelled) setDbReady(true);
      } catch (err) {
        if (!cancelled) setDbError(String(err));
      }
    })();
    return () => { cancelled = true; };
  }, [company.schema]);

  // Reset state when switching questions
  useEffect(() => {
    setCurrentSql("");
    setQueryResult(null);
    setValidation(null);
    setError(null);
    setShowHint(false);
    setShowSolution(false);
    setActiveTab("results");
  }, [activeQuestionIdx]);

  // Preview table data
  const handlePreviewTable = useCallback(
    async (tableName: string) => {
      if (!db) return;
      setError(null);
      try {
        const result = await executeQuery(db, `SELECT * FROM ${tableName} LIMIT 10`);
        setQueryResult(result);
        setValidation(null);
        setActiveTab("results");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [db]
  );

  // Run & validate
  const onRunRef = useRef<() => void>(() => {});
  const handleRun = useCallback(async () => {
    if (!db || !activeQuestion || isRunning) return;

    setIsRunning(true);
    setError(null);
    setQueryResult(null);
    setValidation(null);

    try {
      // Reset schema to clean state before running
      await resetSchema(db, company.schema);
      const result = await executeQuery(db, currentSql);
      setQueryResult(result);

      // Validate against expected
      const testCase = {
        name: activeQuestion.id,
        description: activeQuestion.title,
        expectedColumns: activeQuestion.expectedColumns,
        expectedRows: activeQuestion.expectedRows,
        orderMatters: activeQuestion.orderMatters,
      };
      const v = validateResult(testCase, result);
      setValidation(v);
      setActiveTab("validation");

      if (v.passed) {
        setSolvedQuestions((prev) => new Set(prev).add(activeQuestion.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setActiveTab("results");
    } finally {
      setIsRunning(false);
    }
  }, [db, activeQuestion, currentSql, isRunning, company.schema]);

  onRunRef.current = handleRun;

  // CodeMirror extensions
  const extensions = useMemo(
    () => [
      sql({ dialect: PostgreSQL }),
      keymap.of([
        {
          key: "Ctrl-Enter",
          mac: "Cmd-Enter",
          run: () => {
            onRunRef.current();
            return true;
          },
        },
      ]),
    ],
    []
  );

  const difficultyColor: Record<string, string> = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  if (!dbReady) {
    return (
      <div className="h-screen flex flex-col">
        <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("nav.back")}
            </Button>
            <span className="text-lg">{company.icon}</span>
            <h1 className="text-lg font-semibold">{company.name}</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          {dbError ? (
            <div className="text-center">
              <p className="text-sm text-destructive">{dbError}</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground">{t("exercise.loading")}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("nav.back")}
          </Button>
          <span className="text-lg">{company.icon}</span>
          <h1 className="text-lg font-semibold">{company.name}</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {locale === "fr" ? company.taglineFr : company.tagline}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {solvedQuestions.size}/{company.questions.length} solved
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLocale} title={locale === "en" ? "Passer en français" : "Switch to English"}>
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main 3-column layout */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        {/* Left sidebar: Tables + Questions */}
        <ResizablePanel defaultSize={25} minSize={18} maxSize={35}>
          <div className="h-full flex flex-col">
            <Tabs defaultValue="tables" className="h-full flex flex-col">
              <TabsList className="mx-2 mt-2 shrink-0">
                <TabsTrigger value="tables">
                  <Database className="h-3.5 w-3.5 mr-1" />
                  Tables
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <Lightbulb className="h-3.5 w-3.5 mr-1" />
                  Questions
                  <span className="ml-1 text-[10px] bg-primary/10 rounded-full px-1.5 py-0.5">
                    {company.questions.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Tables tab */}
              <TabsContent value="tables" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1.5">
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-muted-foreground">
                        {locale === "fr"
                          ? `${company.tables.length} tables · Clique pour explorer`
                          : `${company.tables.length} tables · Click to explore`}
                      </p>
                    </div>
                    {company.tables.map((tbl) => (
                      <TableViewer
                        key={tbl.name}
                        table={tbl}
                        locale={locale}
                        onPreview={handlePreviewTable}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Questions tab */}
              <TabsContent value="questions" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {company.questions.map((q, idx) => {
                      const isSolved = solvedQuestions.has(q.id);
                      const isActive = idx === activeQuestionIdx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setActiveQuestionIdx(idx)}
                          className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                            isActive
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isSolved ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-muted-foreground/30 mt-0.5 shrink-0 flex items-center justify-center text-[9px] text-muted-foreground">
                                {idx + 1}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {locale === "fr" ? q.titleFr : q.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColor[q.difficulty]}`}>
                                  {t(`difficulty.${q.difficulty}` as TranslationKey)}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {q.stakeholder} · {q.stakeholderRole}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Question description + editor + results */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <ResizablePanelGroup orientation="vertical">
            {/* Top: Question + Editor */}
            <ResizablePanel defaultSize={55} minSize={25}>
              <div className="h-full flex flex-col">
                {/* Question header */}
                <div className="px-4 py-3 border-b bg-muted/30 shrink-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={difficultyColor[activeQuestion.difficulty]}>
                        {t(`difficulty.${activeQuestion.difficulty}` as TranslationKey)}
                      </Badge>
                      <h2 className="text-sm font-semibold">
                        {locale === "fr" ? activeQuestion.titleFr : activeQuestion.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {activeQuestionIdx > 0 && (
                        <Button variant="ghost" size="xs" onClick={() => setActiveQuestionIdx(activeQuestionIdx - 1)}>
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {activeQuestionIdx + 1}/{company.questions.length}
                      </span>
                      {activeQuestionIdx < company.questions.length - 1 && (
                        <Button variant="ghost" size="xs" onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {locale === "fr" ? activeQuestion.descriptionFr : activeQuestion.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={() => setShowHint(!showHint)}>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {showHint ? "Hide hint" : "Show hint"}
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => setShowSolution(!showSolution)}>
                      {showSolution ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {showSolution ? "Hide solution" : "Show solution"}
                    </Button>
                  </div>
                  {showHint && (
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950 p-2 text-xs">
                      {locale === "fr" ? activeQuestion.hintFr : activeQuestion.hint}
                    </div>
                  )}
                  {showSolution && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 p-2">
                      <pre className="text-xs font-mono whitespace-pre-wrap">{activeQuestion.solutionQuery}</pre>
                    </div>
                  )}
                </div>

                {/* SQL Editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 shrink-0">
                    <span className="text-sm font-medium">{t("exercise.sqlEditor")}</span>
                    <Button onClick={handleRun} size="sm" disabled={isRunning}>
                      {isRunning ? (
                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="mr-1.5 h-3 w-3" />
                      )}
                      {isRunning ? t("exercise.running") : t("exercise.submit")}
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <CodeMirror
                      value={currentSql}
                      onChange={setCurrentSql}
                      extensions={extensions}
                      theme={oneDark}
                      height="100%"
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom: Results + Validation */}
            <ResizablePanel defaultSize={45} minSize={20}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="mx-3 mt-2 shrink-0">
                  <TabsTrigger value="results">{t("exercise.results")}</TabsTrigger>
                  <TabsTrigger value="validation">
                    Validation
                    {validation && (
                      <span
                        className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                          validation.passed
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {validation.passed ? "1/1" : "0/1"}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="results" className="flex-1 overflow-auto mt-0">
                  <InlineResultsTable result={queryResult} error={error} />
                </TabsContent>
                <TabsContent value="validation" className="flex-1 overflow-auto mt-0">
                  <ValidationDisplay validation={validation} />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
