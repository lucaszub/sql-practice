export type Level = "beginner" | "intermediate" | "advanced";

export interface Module {
  id: string;
  name: string;
  level: Level;
  description: string;
  exerciseIds: string[];
  skills: string[];
  icon: string;
  prerequisites?: string[];
}

export interface Track {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export const dataAnalystTrack: Track = {
  id: "data-analyst",
  name: "Data Analyst",
  description:
    "Master SQL for analytics: from SELECT basics to cohort retention, funnel analysis, and revenue metrics. ~80 exercises across 19 modules.",
  modules: [
    // ── Beginner ──────────────────────────────────────────────
    {
      id: "B1",
      name: "SELECT Fundamentals",
      level: "beginner",
      description:
        "Filter, sort, and limit rows from a single table using WHERE, IN, BETWEEN, LIKE, ORDER BY, and LIMIT.",
      exerciseIds: [
        "11-select-where-basics",
        "12-in-between-filtering",
        "13-pattern-matching",
        "14-sorting-results",
        "15-limit-offset",
        "16-multiple-conditions",
        "17-filtered-catalog",
      ],
      skills: ["WHERE", "IN", "BETWEEN", "LIKE", "ORDER BY", "LIMIT"],
      icon: "\u{1F50D}",
    },
    {
      id: "B2",
      name: "Aggregation & GROUP BY",
      level: "beginner",
      description:
        "Summarize data with aggregate functions and group results using GROUP BY and HAVING.",
      exerciseIds: [
        "18-count-basics",
        "19-sum-avg-revenue",
        "20-min-max-prices",
        "21-group-by-category",
        "22-group-by-multiple",
        "23-having-filter",
        "24-where-vs-having",
      ],
      skills: ["COUNT", "SUM", "AVG", "MIN", "MAX", "GROUP BY", "HAVING"],
      icon: "\u{1F4CA}",
      prerequisites: ["B1"],
    },
    {
      id: "B3",
      name: "Basic Joins",
      level: "beginner",
      description:
        "Combine rows from two tables with INNER JOIN and LEFT JOIN, and apply WHERE and GROUP BY on joined data.",
      exerciseIds: [
        "25-inner-join-basics",
        "26-join-with-aggregation",
        "27-left-join-basics",
        "28-left-join-missing",
        "29-join-with-where",
        "30-join-with-groupby",
        "31-customer-summary",
      ],
      skills: ["INNER JOIN", "LEFT JOIN", "JOIN + WHERE", "JOIN + GROUP BY"],
      icon: "\u{1F517}",
      prerequisites: ["B2"],
    },
    {
      id: "B4",
      name: "NULL Handling & CASE",
      level: "beginner",
      description:
        "Handle missing data with IS NULL and COALESCE, and add conditional logic with CASE WHEN expressions.",
      exerciseIds: [
        "32-is-null-check",
        "33-coalesce-defaults",
        "34-case-when-basics",
        "35-case-with-aggregation",
        "36-null-case-combined",
      ],
      skills: ["IS NULL", "COALESCE", "CASE WHEN"],
      icon: "\u{2753}",
      prerequisites: ["B2"],
    },

    // ── Intermediate ──────────────────────────────────────────
    {
      id: "I1",
      name: "Multi-table Joins",
      level: "intermediate",
      description:
        "Join three or more tables, use self-joins, and apply CROSS JOIN for combinations.",
      exerciseIds: [],
      skills: ["3+ table JOIN", "Self-join", "CROSS JOIN"],
      icon: "\u{1F500}",
      prerequisites: ["B3"],
    },
    {
      id: "I2",
      name: "Subqueries & CTEs",
      level: "intermediate",
      description:
        "Break complex queries into named steps with CTEs and use scalar, row, and correlated subqueries.",
      exerciseIds: ["05-employee-hierarchy", "06-date-series"],
      skills: ["Subquery", "CTE", "Correlated subquery"],
      icon: "\u{1F9E9}",
      prerequisites: ["B3"],
    },
    {
      id: "I3",
      name: "Window Functions: Ranking",
      level: "intermediate",
      description:
        "Assign rankings within groups using ROW_NUMBER, RANK, and DENSE_RANK to solve Top-N per group problems.",
      exerciseIds: ["01-top-n-per-group"],
      skills: ["ROW_NUMBER", "RANK", "DENSE_RANK", "Top-N per group"],
      icon: "\u{1F3C6}",
      prerequisites: ["I1"],
    },
    {
      id: "I4",
      name: "Window Functions: Analytics",
      level: "intermediate",
      description:
        "Compare rows across time with LAG and LEAD to compute year-over-year and month-over-month growth.",
      exerciseIds: ["03-yoy-growth"],
      skills: ["LAG", "LEAD", "YoY growth", "MoM growth"],
      icon: "\u{1F4C8}",
      prerequisites: ["I3"],
    },
    {
      id: "I5",
      name: "Anti-joins & Set Operations",
      level: "intermediate",
      description:
        "Find missing or unmatched records with anti-join patterns and combine result sets with UNION and INTERSECT.",
      exerciseIds: ["10-anti-join"],
      skills: ["LEFT JOIN + IS NULL", "NOT EXISTS", "UNION", "INTERSECT"],
      icon: "\u{1F6AB}",
      prerequisites: ["I1"],
    },
    {
      id: "I6",
      name: "Date & String Functions",
      level: "intermediate",
      description:
        "Manipulate dates with DATE_TRUNC, EXTRACT, and DATEDIFF, and transform strings with TRIM and SUBSTRING.",
      exerciseIds: [],
      skills: ["DATE_TRUNC", "EXTRACT", "DATEDIFF", "TRIM", "SUBSTRING"],
      icon: "\u{1F4C5}",
      prerequisites: ["B3"],
    },
    {
      id: "I7",
      name: "Conditional Aggregation",
      level: "intermediate",
      description:
        "Create pivot-style summaries using SUM(CASE WHEN ...) and DuckDB's FILTER clause for conditional counts and sums.",
      exerciseIds: [],
      skills: ["SUM(CASE WHEN)", "FILTER clause"],
      icon: "\u{1F504}",
      prerequisites: ["B2", "B4"],
    },

    // ── Advanced ──────────────────────────────────────────────
    {
      id: "A1",
      name: "Running Totals & Moving Averages",
      level: "advanced",
      description:
        "Compute cumulative sums and sliding-window averages using window frames (ROWS BETWEEN).",
      exerciseIds: ["02-running-total"],
      skills: ["Running total", "Moving average", "Window frames"],
      icon: "\u{1F4C9}",
      prerequisites: ["I4"],
    },
    {
      id: "A2",
      name: "Gaps & Islands",
      level: "advanced",
      description:
        "Detect consecutive sequences and gaps in data using the ROW_NUMBER subtraction technique.",
      exerciseIds: ["04-gap-and-island", "09-consecutive-days"],
      skills: [
        "ROW_NUMBER subtraction",
        "Gap detection",
        "Island detection",
      ],
      icon: "\u{1F3DD}\u{FE0F}",
      prerequisites: ["I3"],
    },
    {
      id: "A3",
      name: "Cohort Retention Analysis",
      level: "advanced",
      description:
        "Assign users to cohorts, track activity over time periods, and compute retention percentages.",
      exerciseIds: ["07-cohort-retention"],
      skills: ["Cohort assignment", "Retention matrix", "Retention %"],
      icon: "\u{1F465}",
      prerequisites: ["I4", "I7"],
    },
    {
      id: "A4",
      name: "Funnel Analysis",
      level: "advanced",
      description:
        "Model multi-step conversion funnels with chained CTEs to compute step-by-step conversion rates and drop-off.",
      exerciseIds: ["08-funnel-analysis"],
      skills: ["Funnel steps", "Conversion rates", "Drop-off analysis"],
      icon: "\u{1F53D}",
      prerequisites: ["I2", "I7"],
    },
    {
      id: "A5",
      name: "Revenue Metrics (MRR/LTV)",
      level: "advanced",
      description:
        "Calculate monthly recurring revenue, churn rate, lifetime value, and net revenue retention from subscription data.",
      exerciseIds: [],
      skills: ["MRR", "Churn rate", "LTV", "Net revenue retention"],
      icon: "\u{1F4B0}",
      prerequisites: ["A1"],
    },
    {
      id: "A6",
      name: "PIVOT / UNPIVOT",
      level: "advanced",
      description:
        "Reshape data between wide and long formats using manual CASE WHEN pivots and DuckDB's native PIVOT/UNPIVOT.",
      exerciseIds: [],
      skills: ["Manual pivot", "DuckDB PIVOT", "UNPIVOT"],
      icon: "\u{1F504}",
      prerequisites: ["I7"],
    },
    {
      id: "A7",
      name: "DuckDB Modern SQL",
      level: "advanced",
      description:
        "Leverage DuckDB-specific syntax like QUALIFY, GROUP BY ALL, EXCLUDE, FILTER, and ASOF JOIN for cleaner queries.",
      exerciseIds: [],
      skills: [
        "QUALIFY",
        "GROUP BY ALL",
        "EXCLUDE",
        "FILTER",
        "ASOF JOIN",
      ],
      icon: "\u{1F986}",
      prerequisites: ["I3", "I7"],
    },
    {
      id: "A8",
      name: "Advanced Business Scenarios",
      level: "advanced",
      description:
        "Tackle complex real-world analytics: A/B testing, engagement scoring, and multi-dimensional aggregation with GROUPING SETS.",
      exerciseIds: [],
      skills: ["A/B testing", "Engagement scoring", "GROUPING SETS"],
      icon: "\u{1F3AF}",
      prerequisites: ["A3", "A4"],
    },
  ],
};

// ── Helper functions ──────────────────────────────────────────

export function getModulesByLevel(track: Track, level: Level): Module[] {
  return track.modules.filter((m) => m.level === level);
}

export function isModuleUnlocked(
  track: Track,
  moduleId: string,
  solvedExerciseIds: Set<string>
): boolean {
  const mod = track.modules.find((m) => m.id === moduleId);
  if (!mod || !mod.prerequisites?.length) return true;

  return mod.prerequisites.every((preReqId) => {
    const preReqModule = track.modules.find((m) => m.id === preReqId);
    if (!preReqModule) return true;
    // Empty modules (Coming Soon) don't block
    if (preReqModule.exerciseIds.length === 0) return true;
    // All exercises in the prerequisite module must be solved
    return preReqModule.exerciseIds.every((exId) =>
      solvedExerciseIds.has(exId)
    );
  });
}

export function getModuleProgress(
  mod: Module,
  solvedExerciseIds: Set<string>
): { solved: number; total: number; percentage: number } {
  const total = mod.exerciseIds.length;
  if (total === 0) return { solved: 0, total: 0, percentage: 0 };
  const solved = mod.exerciseIds.filter((id) =>
    solvedExerciseIds.has(id)
  ).length;
  return { solved, total, percentage: Math.round((solved / total) * 100) };
}
