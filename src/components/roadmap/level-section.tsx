"use client";

import { cn } from "@/lib/utils";
import { ModuleCard } from "./module-card";
import type { Module } from "@/lib/exercises/modules";
import { getModuleProgress, type Track } from "@/lib/exercises/modules";
import { useLocale } from "@/lib/i18n";

interface LevelSectionProps {
  level: "beginner" | "intermediate" | "advanced";
  modules: Module[];
  track: Track;
  solvedIds: Set<string>;
}

export function LevelSection({ level, modules, track, solvedIds }: LevelSectionProps) {
  const { t } = useLocale();

  const levelConfig = {
    beginner: { label: t("level.beginner"), color: "bg-green-500", textColor: "text-green-500", description: t("level.beginner.desc") },
    intermediate: { label: t("level.intermediate"), color: "bg-yellow-500", textColor: "text-yellow-500", description: t("level.intermediate.desc") },
    advanced: { label: t("level.advanced"), color: "bg-red-500", textColor: "text-red-500", description: t("level.advanced.desc") },
  };

  const config = levelConfig[level];

  const totalExercises = modules.reduce((sum, m) => sum + m.exerciseIds.length, 0);
  const solvedExercises = modules.reduce((sum, m) => {
    const p = getModuleProgress(m, solvedIds);
    return sum + p.solved;
  }, 0);
  const progressPercent = totalExercises > 0 ? (solvedExercises / totalExercises) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className={cn("h-2 w-2 rounded-full", config.color)} />
          <h2 className="text-lg font-bold">{config.label}</h2>
          <span className="text-sm text-muted-foreground">
            {solvedExercises}/{totalExercises} {t("roadmap.exercises")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground ml-5">{config.description}</p>
        <div className="mt-2 ml-5 h-1.5 w-full max-w-xs rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", config.color)}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-5">
        {modules.map((mod) => {
          const progress = getModuleProgress(mod, solvedIds);

          let status: "not-started" | "in-progress" | "complete" | "locked" | "coming-soon";
          if (mod.exerciseIds.length === 0) {
            status = "coming-soon";
          } else if (progress.percentage === 100) {
            status = "complete";
          } else if (progress.solved > 0) {
            status = "in-progress";
          } else {
            status = "not-started";
          }

          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              status={status}
              solvedIds={solvedIds}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
}
