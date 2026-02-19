"use client";

import { useState } from "react";
import { exercises } from "@/lib/exercises";
import { Button } from "@/components/ui/button";
import { useQuizSession, type QuizConfig } from "@/lib/store/quiz-session";
import { useLocale } from "@/lib/i18n";
import type { Difficulty } from "@/lib/exercises/types";

const COUNTS = [5, 10, 20];

const TIMER_OPTIONS = [0, 5 * 60_000, 10 * 60_000, 15 * 60_000];

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
        active
          ? "bg-emerald-500 text-white border-emerald-500"
          : "border-border hover:border-emerald-400 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function QuizSetup() {
  const { startQuiz } = useQuizSession();
  const { t, locale } = useLocale();
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [timeLimitMs, setTimeLimitMs] = useState(0);

  const DIFFICULTIES: { value: Difficulty | "all"; label: string }[] = [
    { value: "all", label: t("difficulty.all") },
    { value: "easy", label: t("difficulty.easy") },
    { value: "medium", label: t("difficulty.medium") },
    { value: "hard", label: t("difficulty.hard") },
  ];

  const timerLabel = (ms: number) => {
    if (ms === 0) return t("briefing.timerOff");
    return locale === "fr" ? `${ms / 60_000} min` : `${ms / 60_000} min`;
  };

  const pool = exercises.filter(
    (e) => difficulty === "all" || e.difficulty === difficulty
  );

  function handleStart() {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    const config: QuizConfig = { count: selected.length, difficulty, timeLimitMs };
    startQuiz(config, selected.map((e) => e.id));
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4 flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">
          {t("nav.briefing")}
        </p>
        <h1 className="text-2xl font-bold mb-2">{t("briefing.tagline")}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("briefing.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("briefing.difficulty")}</label>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <FilterButton
                key={d.value}
                active={difficulty === d.value}
                onClick={() => setDifficulty(d.value)}
              >
                {d.label}
              </FilterButton>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("briefing.questions")}</label>
          <div className="flex gap-2">
            {COUNTS.map((n) => (
              <FilterButton key={n} active={count === n} onClick={() => setCount(n)}>
                {n}
              </FilterButton>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {pool.length} {t("briefing.available")}{" "}
            {pool.length < count && pool.length > 0 && (
              <span className="text-amber-500">
                {t("briefing.onlyN").replace("{n}", String(pool.length))}
              </span>
            )}
            {pool.length === 0 && (
              <span className="text-red-500">{t("briefing.noMatch")}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("briefing.timer")}</label>
          <div className="flex gap-2 flex-wrap">
            {TIMER_OPTIONS.map((ms) => (
              <FilterButton
                key={ms}
                active={timeLimitMs === ms}
                onClick={() => setTimeLimitMs(ms)}
              >
                {timerLabel(ms)}
              </FilterButton>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t("briefing.timerHint")}</p>
        </div>
      </div>

      <Button
        onClick={handleStart}
        disabled={pool.length === 0}
        className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
      >
        {t("briefing.start")}
      </Button>
    </div>
  );
}
