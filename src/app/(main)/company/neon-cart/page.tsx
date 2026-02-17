"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { getDuckDb, type AsyncDuckDB } from "@/lib/db/duckdb";
import { executeQuery, resetSchema } from "@/lib/db/query-runner";
import { validateResult } from "@/lib/db/validator";
import { neonCart } from "@/lib/companies/neon-cart";
import type { TableInfo } from "@/lib/companies/types";
import type { QueryResult, ValidationResult } from "@/lib/exercises/types";
import { useLocale, type TranslationKey } from "@/lib/i18n";
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

// --- IDE-style schema tree ---
function SchemaTree({
  tables,
  locale,
  onPreview,
}: {
  tables: TableInfo[];
  locale: "en" | "fr";
  onPreview: (tableName: string) => void;
}) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="text-[13px]">
      {tables.map((tbl) => {
        const isExpanded = expandedTables.has(tbl.name);
        return (
          <div key={tbl.name}>
            {/* Table row */}
            <button
              onClick={() => toggleTable(tbl.name)}
              className="w-full flex items-center gap-1.5 px-2 py-[5px] hover:bg-white/5 transition-colors group text-left"
            >
              <ChevronRight className={`h-3 w-3 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              <Table2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="font-mono font-medium text-foreground truncate">{tbl.name}</span>
              <span className="text-[11px] text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {tbl.rowCount}
              </span>
            </button>
            {/* Columns */}
            {isExpanded && (
              <div className="ml-3 border-l border-border/40">
                {tbl.columns.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center gap-1.5 pl-4 pr-2 py-[3px] hover:bg-white/5 text-[12px] group/col"
                    title={locale === "fr" ? col.descriptionFr : col.description}
                  >
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${col.nullable ? "bg-yellow-500/60" : "bg-emerald-500/60"}`} />
                    <span className="font-mono text-foreground/80 truncate">{col.name}</span>
                    <span className="font-mono text-muted-foreground text-[11px] ml-auto shrink-0">{col.type}</span>
                  </div>
                ))}
                <button
                  onClick={() => onPreview(tbl.name)}
                  className="flex items-center gap-1.5 pl-4 pr-2 py-[3px] text-[11px] text-blue-400 hover:text-blue-300 hover:bg-white/5 w-full transition-colors"
                >
                  <Play className="h-2.5 w-2.5" />
                  <span>SELECT * LIMIT 10</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Company intro screen ---
function CompanyIntro({
  company,
  locale,
  onStart,
}: {
  company: typeof neonCart;
  locale: "en" | "fr";
  onStart: () => void;
}) {
  const totalRows = company.tables.reduce((sum, t) => sum + t.rowCount, 0);
  const stakeholders = Array.from(
    new Map(
      company.questions.map((q) => [q.stakeholder, { name: q.stakeholder, role: q.stakeholderRole }])
    ).values()
  );
  const diffCounts = { easy: 0, medium: 0, hard: 0 };
  for (const q of company.questions) diffCounts[q.difficulty]++;

  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <span className="text-6xl">{company.icon}</span>
          <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-lg text-muted-foreground">
            {locale === "fr" ? company.taglineFr : company.tagline}
          </p>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {locale === "fr" ? company.sectorFr : company.sector}
          </Badge>
        </div>

        {/* Story */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {locale === "fr" ? "Ton contexte" : "Your context"}
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {locale === "fr" ? company.descriptionFr : company.description}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{company.tables.length}</p>
            <p className="text-xs text-muted-foreground mt-1">tables</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalRows}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "fr" ? "lignes de données" : "data rows"}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{company.questions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "fr" ? "questions business" : "business questions"}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stakeholders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">stakeholders</p>
          </div>
        </div>

        {/* Stakeholders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {locale === "fr" ? "Ton equipe" : "Your team"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stakeholders.map((s) => (
              <div key={s.name} className="rounded-lg border bg-card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {locale === "fr" ? "Repartition des questions" : "Question breakdown"}
          </h2>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-green-50 dark:bg-green-950 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm">{diffCounts.easy} {locale === "fr" ? "faciles" : "easy"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-yellow-50 dark:bg-yellow-950 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <span className="text-sm">{diffCounts.medium} {locale === "fr" ? "moyennes" : "medium"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-red-50 dark:bg-red-950 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-sm">{diffCounts.hard} {locale === "fr" ? "difficiles" : "hard"}</span>
            </div>
          </div>
        </div>

        {/* Tables overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {locale === "fr" ? "Les donnees a ta disposition" : "Available data"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {company.tables.map((tbl) => (
              <div key={tbl.name} className="rounded-lg border bg-card p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <Table2 className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm font-medium">{tbl.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "fr" ? tbl.descriptionFr : tbl.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tbl.columns.length} {locale === "fr" ? "colonnes" : "columns"} · {tbl.rowCount} {locale === "fr" ? "lignes" : "rows"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Button size="lg" onClick={onStart} className="px-8">
            <Play className="h-5 w-5 mr-2" />
            {locale === "fr" ? "Commencer les exercices" : "Start practicing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Main page ---
export default function NeonCartPage() {
  const { locale, t } = useLocale();

  const [showIntro, setShowIntro] = useState(true);
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

  // Show intro screen first
  if (showIntro) {
    return (
      <CompanyIntro
        company={company}
        locale={locale}
        onStart={() => setShowIntro(false)}
      />
    );
  }

  if (!dbReady) {
    return (
      <div className="h-[calc(100vh-48px)] flex flex-col">
        <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <div className="flex items-center gap-3">
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
    <div className="h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg">{company.icon}</span>
          <h1 className="text-lg font-semibold">{company.name}</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {locale === "fr" ? company.taglineFr : company.tagline}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowIntro(true)}>
            {company.icon} {locale === "fr" ? "A propos" : "About"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {solvedQuestions.size}/{company.questions.length} solved
          </span>
        </div>
      </header>

      {/* Main layout: sidebar + workspace */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0 overflow-hidden">
        {/* Left sidebar: IDE-style schema explorer */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col bg-muted/40 dark:bg-zinc-900/60 border-r overflow-hidden">
            {/* Schema section */}
            <div className="shrink-0 px-3 py-2 border-b border-border/50">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Schema
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">{company.tables.length} tables</span>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="py-1">
                <SchemaTree
                  tables={company.tables}
                  locale={locale}
                  onPreview={handlePreviewTable}
                />
              </div>

              {/* Questions section */}
              <div className="border-t border-border/50 mt-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Questions
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {solvedQuestions.size}/{company.questions.length}
                    </span>
                  </div>
                </div>
                <div className="pb-2">
                  {company.questions.map((q, idx) => {
                    const isSolved = solvedQuestions.has(q.id);
                    const isActive = idx === activeQuestionIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors text-[13px] ${
                          isActive
                            ? "bg-primary/10 border-l-2 border-l-primary"
                            : "hover:bg-white/5 border-l-2 border-l-transparent"
                        }`}
                      >
                        {isSolved ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        ) : (
                          <span className="h-3.5 w-3.5 shrink-0 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                            {idx + 1}
                          </span>
                        )}
                        <span className={`truncate ${isActive ? "text-foreground font-medium" : "text-foreground/70"}`}>
                          {locale === "fr" ? q.titleFr : q.title}
                        </span>
                        <span className={`ml-auto shrink-0 h-1.5 w-1.5 rounded-full ${
                          q.difficulty === "easy" ? "bg-green-500" : q.difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Question description + editor + results */}
        <ResizablePanel defaultSize={70} minSize={40} className="min-w-0">
          <ResizablePanelGroup orientation="vertical" className="h-full">
            {/* Top: Question + Editor */}
            <ResizablePanel defaultSize={55} minSize={25}>
              <div className="h-full flex flex-col overflow-hidden min-w-0">
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
                <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
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
                  <div className="relative flex-1 min-h-0">
                    <div className="absolute inset-0">
                      <CodeMirror
                        value={currentSql}
                        onChange={setCurrentSql}
                        extensions={extensions}
                        theme={oneDark}
                        height="100%"
                        className="h-full [&_.cm-editor]:!h-full [&_.cm-scroller]:!overflow-auto"
                      />
                    </div>
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
