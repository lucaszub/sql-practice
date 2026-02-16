"use client";

import { useMemo } from "react";
import { useLocale, useLocaleStore } from "@/lib/i18n";

interface ActivityGraphProps {
  /** Set of "YYYY-MM-DD" date strings with activity */
  activityDays: string[];
  /** Number of weeks to display */
  weeks?: number;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const CELL_SIZE = 12;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;

export function ActivityGraph({ activityDays, weeks = 20 }: ActivityGraphProps) {
  const { t } = useLocale();
  const locale = useLocaleStore((s) => s.locale);

  const { grid, monthLabels } = useMemo(() => {
    const activitySet = new Set(activityDays);
    const today = new Date();

    // Find the Sunday of the current week
    const endDay = new Date(today);
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

    // Go back `weeks` weeks from that Sunday
    const startDay = new Date(endDay);
    startDay.setDate(startDay.getDate() - weeks * 7 + 1);

    const cells: { date: string; col: number; row: number; active: boolean }[] = [];
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    const cursor = new Date(startDay);
    for (let d = 0; d < weeks * 7; d++) {
      const col = Math.floor(d / 7);
      const row = cursor.getDay();
      const dateKey = cursor.toISOString().slice(0, 10);

      // Month labels
      const month = cursor.getMonth();
      if (month !== lastMonth) {
        const monthName = cursor.toLocaleDateString(locale, { month: "short" });
        months.push({ label: monthName, col });
        lastMonth = month;
      }

      cells.push({
        date: dateKey,
        col,
        row,
        active: activitySet.has(dateKey),
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return { grid: cells, monthLabels: months };
  }, [activityDays, weeks, locale]);

  const svgWidth = weeks * CELL_STEP + 30;
  const svgHeight = 7 * CELL_STEP + 20;

  const streakDays = useMemo(() => {
    if (activityDays.length === 0) return 0;
    const sorted = [...activityDays].sort().reverse();
    const today = new Date().toISOString().slice(0, 10);
    // Check if today or yesterday is in the list to start counting
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    if (sorted[0] !== today && sorted[0] !== yesterdayKey) return 0;

    let streak = 0;
    const daySet = new Set(sorted);
    const check = new Date(sorted[0]);
    while (daySet.has(check.toISOString().slice(0, 10))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }, [activityDays]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {activityDays.length} {t("activity.activeDays")}
          {streakDays > 0 && (
            <span className="ml-2 text-orange-500 font-medium">
              {streakDays} {t("activity.dayStreak")}
            </span>
          )}
        </p>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Day labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={0}
                y={20 + i * CELL_STEP + CELL_SIZE - 2}
                className="fill-muted-foreground"
                fontSize={9}
              >
                {label}
              </text>
            ) : null
          )}

          {/* Month labels */}
          {monthLabels.map(({ label, col }, i) => (
            <text
              key={i}
              x={30 + col * CELL_STEP}
              y={10}
              className="fill-muted-foreground"
              fontSize={9}
            >
              {label}
            </text>
          ))}

          {/* Cells */}
          {grid.map(({ date, col, row, active }) => (
            <rect
              key={date}
              x={30 + col * CELL_STEP}
              y={18 + row * CELL_STEP}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              className={
                active
                  ? "fill-green-500 dark:fill-green-400"
                  : "fill-muted/80 dark:fill-muted"
              }
            >
              <title>{date}{active ? " (active)" : ""}</title>
            </rect>
          ))}
        </svg>
      </div>
    </div>
  );
}
