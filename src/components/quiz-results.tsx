"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExercise } from "@/lib/exercises";
import { useQuizSession } from "@/lib/store/quiz-session";
import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, MinusCircle, Eye, RotateCcw } from "lucide-react";

function ScoreRing({ pct, passed, total }: { pct: number; passed: number; total: number }) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
      <circle
        cx="70" cy="70" r={radius} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x="70" y="62" textAnchor="middle" fontSize="26" fontWeight="700" fill={color}>
        {Math.round(animatedPct)}%
      </text>
      <text x="70" y="82" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.5">
        {passed}/{total}
      </text>
    </svg>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 20);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [target]);
  return <>{value}</>;
}

export function QuizResults() {
  const { exerciseIds, answers, config, startedAt, completedAt, resetQuiz } = useQuizSession();
  const { t } = useLocale();

  const total = exerciseIds.length;
  const passed = exerciseIds.filter((id) => answers[id]?.passed).length;
  const skipped = exerciseIds.filter((id) => answers[id]?.skipped).length;
  const failed = total - passed - skipped;
  const solutionViewedCount = exerciseIds.filter((id) => answers[id]?.solutionViewed).length;
  const durationMs = (completedAt ?? startedAt) - startedAt;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const solutionText =
    solutionViewedCount > 0
      ? `· ${solutionViewedCount} ${solutionViewedCount > 1 ? t("briefing.solutionsViewed") : t("briefing.solutionViewed")}`
      : "";
  const timerText =
    config.timeLimitMs > 0
      ? `· ${t("briefing.timerLimit").replace("{n}", String(config.timeLimitMs / 60_000))}`
      : "";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">
          {t("nav.briefing")}
        </p>
        <h1 className="text-2xl font-bold">{t("briefing.debrief")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {minutes}m {seconds}s {timerText} {solutionText}
        </p>
      </div>

      {/* Score ring + stats */}
      <div className="flex flex-col items-center gap-6">
        <ScoreRing pct={pct} passed={passed} total={total} />

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-card">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-500 tabular-nums">
              <AnimatedNumber target={passed} />
            </span>
            <span className="text-xs text-muted-foreground">{t("briefing.passed")}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-card">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold text-red-500 tabular-nums">
              <AnimatedNumber target={failed} />
            </span>
            <span className="text-xs text-muted-foreground">{t("briefing.failed")}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-card">
            <MinusCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold tabular-nums">
              <AnimatedNumber target={skipped} />
            </span>
            <span className="text-xs text-muted-foreground">{t("briefing.skipped")}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {t("briefing.breakdown")}
        </h2>
        {exerciseIds.map((id, index) => {
          const exercise = getExercise(id);
          const answer = answers[id];
          if (!exercise) return null;
          const isSkipped = answer?.skipped;
          const isPassed = answer?.passed && !isSkipped;

          return (
            <div
              key={id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              style={{ animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${index * 60}ms` }}
            >
              <span className="text-xs text-muted-foreground w-5 text-right shrink-0 tabular-nums">
                {index + 1}
              </span>
              {isPassed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : isSkipped ? (
                <MinusCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <Link
                href={`/exercise/${id}`}
                className="text-sm flex-1 hover:text-emerald-500 transition-colors truncate"
              >
                {exercise.title}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={
                    exercise.difficulty === "easy"
                      ? "text-emerald-500 border-emerald-500/30 text-xs"
                      : exercise.difficulty === "medium"
                      ? "text-amber-500 border-amber-500/30 text-xs"
                      : "text-red-500 border-red-500/30 text-xs"
                  }
                >
                  {exercise.difficulty}
                </Badge>
                {answer?.solutionViewed && (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-label="Solution viewed" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={resetQuiz} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("briefing.newBriefing")}
        </Button>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Link href="/">{t("nav.backToExercises")}</Link>
        </Button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
