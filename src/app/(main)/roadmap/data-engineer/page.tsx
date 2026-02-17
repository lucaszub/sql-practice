"use client";

import { useMemo } from "react";
import { dataEngineerTrack, getModulesByLevel } from "@/lib/exercises/modules";
import { useProgressStore } from "@/lib/store/progress";
import { LevelSection, type CompanySuggestion } from "@/components/roadmap/level-section";
import { useLocale } from "@/lib/i18n";

const deCompanySuggestions: Record<string, CompanySuggestion[]> = {
  beginner: [
    { id: "neon-cart", name: "NeonCart", icon: "🛒" },
    { id: "freshbowl", name: "FreshBowl", icon: "🥗" },
  ],
  intermediate: [
    { id: "cloudforge", name: "CloudForge", icon: "⚒️" },
  ],
  advanced: [
    { id: "cloudforge", name: "CloudForge", icon: "⚒️" },
    { id: "dataflow", name: "DataFlow", icon: "🔄" },
  ],
};

export default function DataEngineerRoadmapPage() {
  const { t } = useLocale();
  const progress = useProgressStore((s) => s.progress);

  const solvedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, p] of Object.entries(progress)) {
      if (p.solved) ids.add(id);
    }
    return ids;
  }, [progress]);

  const beginnerModules = getModulesByLevel(dataEngineerTrack, "beginner");
  const intermediateModules = getModulesByLevel(dataEngineerTrack, "intermediate");
  const advancedModules = getModulesByLevel(dataEngineerTrack, "advanced");

  const totalExercises = dataEngineerTrack.modules.reduce((sum, m) => sum + m.exerciseIds.length, 0);
  const solvedCount = dataEngineerTrack.modules.reduce((sum, m) => {
    return sum + m.exerciseIds.filter((id) => solvedIds.has(id)).length;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("roadmap.deTitle")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("roadmap.deSubtitle")}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 flex-1 max-w-md rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${totalExercises > 0 ? (solvedCount / totalExercises) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {solvedCount}/{totalExercises}
          </span>
        </div>
      </div>

      <div className="space-y-10">
        <LevelSection level="beginner" modules={beginnerModules} track={dataEngineerTrack} solvedIds={solvedIds} companySuggestions={deCompanySuggestions.beginner} />
        <LevelSection level="intermediate" modules={intermediateModules} track={dataEngineerTrack} solvedIds={solvedIds} companySuggestions={deCompanySuggestions.intermediate} />
        <LevelSection level="advanced" modules={advancedModules} track={dataEngineerTrack} solvedIds={solvedIds} companySuggestions={deCompanySuggestions.advanced} />
      </div>
    </div>
  );
}
