"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Database, Building2, ChevronRightIcon } from "lucide-react";
import { exercises, getExercise } from "@/lib/exercises";
import { dataAnalystTrack, dataEngineerTrack } from "@/lib/exercises/modules";
import { useProgressStore } from "@/lib/store/progress";
import { ActivityGraph } from "@/components/activity-graph";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Difficulty, Exercise } from "@/lib/exercises/types";
import { useLocale, type TranslationKey } from "@/lib/i18n";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function HomePage() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const progress = useProgressStore((s) => s.progress);
  const activityDays = useProgressStore((s) => s.activityDays);
  const { locale, t } = useLocale();

  const difficulties: { value: Difficulty | "all"; label: string }[] = [
    { value: "all", label: t("difficulty.all") },
    { value: "easy", label: t("difficulty.easy") },
    { value: "medium", label: t("difficulty.medium") },
    { value: "hard", label: t("difficulty.hard") },
  ];

  const getTitle = (ex: Exercise) =>
    locale === "fr" && ex.titleFr ? ex.titleFr : ex.title;

  const solvedIds = new Set(
    Object.entries(progress)
      .filter(([, p]) => p.solved)
      .map(([id]) => id)
  );

  const solvedCount = solvedIds.size;
  const totalCount = exercises.length;
  const pctGlobal = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const toggleModule = (moduleId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Build modules with resolved exercises
  const modulesWithExercises = dataAnalystTrack.modules.map((mod) => {
    const exs = mod.exerciseIds
      .map((id) => getExercise(id))
      .filter((ex) => ex != null);
    const filtered =
      difficultyFilter === "all"
        ? exs
        : exs.filter((ex) => ex.difficulty === difficultyFilter);
    const solvedInModule = mod.exerciseIds.filter((id) => solvedIds.has(id)).length;
    return { mod, exercises: filtered, allExercises: exs, solvedInModule };
  });

  // Unmapped exercises
  const moduleExerciseIds = new Set([
    ...dataAnalystTrack.modules.flatMap((m) => m.exerciseIds),
    ...dataEngineerTrack.modules.flatMap((m) => m.exerciseIds),
  ]);
  const unmappedExercises = exercises.filter(
    (ex) => !moduleExerciseIds.has(ex.id)
  );
  const filteredUnmapped =
    difficultyFilter === "all"
      ? unmappedExercises
      : unmappedExercises.filter((ex) => ex.difficulty === difficultyFilter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Database className="h-4 w-4" />
          <span>{t("home.poweredBy")}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("home.subtitle")}
        </p>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/80 px-4 py-1.5 text-sm text-amber-800 hover:bg-amber-100 hover:border-amber-400/70 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60 dark:hover:border-amber-500/50 transition-colors"
        >
          <Building2 className="h-4 w-4" />
          <span>{t("home.companyCta")}</span>
          <ChevronRightIcon className="h-3 w-3" />
        </Link>
      </div>

      {/* ── Stats + Activity Graph ────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold">{solvedCount}<span className="text-muted-foreground font-normal text-base">/{totalCount}</span></p>
              <p className="text-xs text-muted-foreground">{t("home.exercisesSolved")}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${pctGlobal}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{pctGlobal}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t("home.overallProgress")}</p>
            </div>
          </div>
        </div>
        <ActivityGraph activityDays={activityDays} />
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("home.exercises")}</h2>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Module list ───────────────────────────────────── */}
      <div className="space-y-1">
        {modulesWithExercises.map(({ mod, exercises: filteredExs, allExercises, solvedInModule }) => {
          if (allExercises.length === 0 && mod.exerciseIds.length === 0) {
            return (
              <div key={mod.id} className="rounded-md border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {mod.id} — {mod.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {t("home.comingSoon")}
                  </Badge>
                </div>
              </div>
            );
          }

          if (filteredExs.length === 0 && difficultyFilter !== "all") return null;

          const total = allExercises.length;
          const isCollapsed = collapsed.has(mod.id);
          const pct = total > 0 ? Math.round((solvedInModule / total) * 100) : 0;

          return (
            <div key={mod.id} className="rounded-md border overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-semibold truncate">
                    {mod.id} — {mod.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-xs text-muted-foreground">
                    {solvedInModule}/{total}
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>

              {!isCollapsed && (
                <div className="divide-y">
                  {filteredExs.map((ex) => {
                    const solved = solvedIds.has(ex.id);
                    return (
                      <Link
                        key={ex.id}
                        href={`/exercise/${ex.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                      >
                        {solved ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm flex-1 truncate">{getTitle(ex)}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${difficultyColors[ex.difficulty]}`}
                        >
                          {t(`difficulty.${ex.difficulty}` as TranslationKey)}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredUnmapped.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40">
              <span className="text-sm font-semibold">{t("home.otherExercises")}</span>
            </div>
            <div className="divide-y">
              {filteredUnmapped.map((ex) => {
                const solved = solvedIds.has(ex.id);
                return (
                  <Link
                    key={ex.id}
                    href={`/exercise/${ex.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                  >
                    {solved ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm flex-1 truncate">{getTitle(ex)}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${difficultyColors[ex.difficulty]}`}
                    >
                      {t(`difficulty.${ex.difficulty}` as TranslationKey)}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {modulesWithExercises.every(({ exercises: e }) => e.length === 0) &&
        filteredUnmapped.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("home.noMatch")}
          </div>
        )}
    </div>
  );
}
