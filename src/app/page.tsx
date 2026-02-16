"use client";

import { useState } from "react";
import { exercises } from "@/lib/exercises";
import { ExerciseCard } from "@/components/exercise-card";
import { useProgressStore } from "@/lib/store/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Difficulty } from "@/lib/exercises/types";

const categories: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "window-functions", label: "Window Functions" },
  { value: "ctes", label: "CTEs" },
  { value: "analytics-patterns", label: "Analytics Patterns" },
  { value: "advanced-joins", label: "Advanced Joins" },
];

const difficulties: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function HomePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const progress = useProgressStore((s) => s.progress);

  const filtered = exercises.filter((ex) => {
    if (categoryFilter !== "all" && ex.category !== categoryFilter) return false;
    if (difficultyFilter !== "all" && ex.difficulty !== difficultyFilter) return false;
    return true;
  });

  const solvedCount = Object.values(progress).filter((p) => p.solved).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">SQL Practice</h1>
        <p className="text-muted-foreground mt-1">
          Master advanced SQL with interactive exercises
        </p>
        <div className="mt-3">
          <Badge variant="outline" className="text-sm">
            {solvedCount}/{exercises.length} completed
          </Badge>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            solved={progress[ex.id]?.solved ?? false}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No exercises match the selected filters.
        </div>
      )}
    </div>
  );
}
