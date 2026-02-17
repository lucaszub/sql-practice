"use client";

import { useMemo } from "react";
import { dataAnalystTrack, getModulesByLevel } from "@/lib/exercises/modules";
import { useProgressStore } from "@/lib/store/progress";
import { LevelSection, type CompanySuggestion } from "@/components/roadmap/level-section";
import { useLocale } from "@/lib/i18n";

const daCompanySuggestions: Record<string, CompanySuggestion[]> = {
  beginner: [
    { id: "neon-cart", name: "NeonCart", icon: "🛒" },
    { id: "freshbowl", name: "FreshBowl", icon: "🥗" },
  ],
  intermediate: [
    { id: "pixelads", name: "PixelAds", icon: "📊" },
    { id: "talenthub", name: "TalentHub", icon: "👥" },
  ],
  advanced: [
    { id: "cashbee", name: "CashBee", icon: "🐝" },
    { id: "streampulse", name: "StreamPulse", icon: "🎵" },
  ],
};

export default function DataAnalystRoadmapPage() {
  const { t } = useLocale();
  const progress = useProgressStore((s) => s.progress);

  const solvedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, p] of Object.entries(progress)) {
      if (p.solved) ids.add(id);
    }
    return ids;
  }, [progress]);

  const beginnerModules = getModulesByLevel(dataAnalystTrack, "beginner");
  const intermediateModules = getModulesByLevel(dataAnalystTrack, "intermediate");
  const advancedModules = getModulesByLevel(dataAnalystTrack, "advanced");

  const totalExercises = dataAnalystTrack.modules.reduce((sum, m) => sum + m.exerciseIds.length, 0);
  const solvedCount = dataAnalystTrack.modules.reduce((sum, m) => {
    return sum + m.exerciseIds.filter((id) => solvedIds.has(id)).length;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("roadmap.daTitle")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("roadmap.daSubtitle")}
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
        <LevelSection level="beginner" modules={beginnerModules} track={dataAnalystTrack} solvedIds={solvedIds} companySuggestions={daCompanySuggestions.beginner} />
        <LevelSection level="intermediate" modules={intermediateModules} track={dataAnalystTrack} solvedIds={solvedIds} companySuggestions={daCompanySuggestions.intermediate} />
        <LevelSection level="advanced" modules={advancedModules} track={dataAnalystTrack} solvedIds={solvedIds} companySuggestions={daCompanySuggestions.advanced} />
      </div>
    </div>
  );
}
