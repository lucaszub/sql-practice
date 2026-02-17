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
      exerciseIds: [
        "37-three-table-order-report",
        "38-self-join-employee-managers",
        "39-multi-table-revenue-by-category",
        "40-cross-join-inventory-gaps",
        "41-self-join-price-comparison",
        "42-multi-table-top-performers",
        "43-ecommerce-order-pipeline",
      ],
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
      exerciseIds: [
        "44-scalar-subquery-above-avg",
        "45-correlated-subquery-latest-order",
        "46-cte-revenue-breakdown",
        "47-multi-cte-customer-segmentation",
        "48-exists-never-ordered",
        "49-nested-ctes-mom-growth",
        "50-saas-kpi-dashboard",
        "05-employee-hierarchy",
        "06-date-series",
      ],
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

export const dataEngineerTrack: Track = {
  id: "data-engineer",
  name: "Data Engineer",
  description:
    "Master SQL for data engineering: from schema design to pipeline SQL, optimization, and data quality. ~85 exercises across 19 modules.",
  modules: [
    // ── Beginner (shared with DA) ────────────────────────────
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

    // ── Intermediate (shared I1/I2 + DE-specific) ────────────
    {
      id: "I1",
      name: "Multi-table Joins",
      level: "intermediate",
      description:
        "Join three or more tables, use self-joins, and apply CROSS JOIN for combinations.",
      exerciseIds: [
        "37-three-table-order-report",
        "38-self-join-employee-managers",
        "39-multi-table-revenue-by-category",
        "40-cross-join-inventory-gaps",
        "41-self-join-price-comparison",
        "42-multi-table-top-performers",
        "43-ecommerce-order-pipeline",
      ],
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
      exerciseIds: [
        "44-scalar-subquery-above-avg",
        "45-correlated-subquery-latest-order",
        "46-cte-revenue-breakdown",
        "47-multi-cte-customer-segmentation",
        "48-exists-never-ordered",
        "49-nested-ctes-mom-growth",
        "50-saas-kpi-dashboard",
        "05-employee-hierarchy",
        "06-date-series",
      ],
      skills: ["Subquery", "CTE", "Correlated subquery"],
      icon: "\u{1F9E9}",
      prerequisites: ["B3"],
    },
    {
      id: "DE-I1",
      name: "DDL & Schema Design",
      level: "intermediate",
      description:
        "Create tables with constraints, define primary/foreign keys, and design normalized schemas.",
      exerciseIds: [
        "51-create-table-basics",
        "52-add-column-alter",
        "53-create-with-constraints",
        "54-foreign-key-design",
        "55-drop-recreate-migration",
      ],
      skills: ["CREATE TABLE", "PRIMARY KEY", "FOREIGN KEY", "Normalization"],
      icon: "\u{1F3D7}\u{FE0F}",
      prerequisites: ["B3"],
    },
    {
      id: "DE-I2",
      name: "DML & Data Loading",
      level: "intermediate",
      description:
        "Insert, update, and delete data with INSERT INTO, UPDATE, DELETE, and COPY/bulk loading patterns.",
      exerciseIds: [
        "56-bulk-insert-staging",
        "57-insert-select-transform",
        "58-update-from-join",
        "59-delete-orphan-records",
        "60-create-table-as-select",
      ],
      skills: ["INSERT", "UPDATE", "DELETE", "COPY", "Bulk loading"],
      icon: "\u{1F4E5}",
      prerequisites: ["B3"],
    },
    {
      id: "DE-I3",
      name: "Data Types & Constraints",
      level: "intermediate",
      description:
        "Choose appropriate data types, apply CHECK constraints, and handle type casting with CAST.",
      exerciseIds: [
        "61-primary-key-design",
        "62-foreign-key-relationships",
        "63-check-constraints",
        "64-not-null-defaults",
        "65-data-type-casting",
      ],
      skills: ["Data types", "CHECK", "CAST", "NOT NULL", "DEFAULT"],
      icon: "\u{1F3AF}",
      prerequisites: ["DE-I1"],
    },

    // ── Advanced (DE-specific) ───────────────────────────────
    {
      id: "DE-A1",
      name: "Star Schema Design",
      level: "advanced",
      description:
        "Design and query star schemas with fact tables (measures + FKs) joined to dimension tables (attributes).",
      exerciseIds: [
        "66-fact-table-design",
        "67-dimension-table-design",
        "68-date-dimension",
        "69-star-schema-queries",
        "70-snowflake-extension",
      ],
      skills: ["Fact tables", "Dimension tables", "Star schema queries"],
      icon: "\u{2B50}",
      prerequisites: ["DE-I1", "I1"],
    },
    {
      id: "DE-A2",
      name: "SCD Type 2",
      level: "advanced",
      description:
        "Implement slowly changing dimensions with valid_from, valid_to, and is_current for historical tracking.",
      exerciseIds: [
        "71-scd-type1-overwrite",
        "72-scd2-structure",
        "73-scd2-insert-version",
        "74-scd2-current-snapshot",
        "75-scd2-point-in-time",
      ],
      skills: ["SCD Type 2", "valid_from/valid_to", "is_current"],
      icon: "\u{1F4C6}",
      prerequisites: ["DE-A1"],
    },
    {
      id: "DE-A3",
      name: "MERGE & Upsert",
      level: "advanced",
      description:
        "Perform atomic insert-or-update operations for idempotent pipeline loading using MERGE and ON CONFLICT.",
      exerciseIds: [
        "76-insert-or-replace",
        "77-merge-basics",
        "78-merge-conditional",
        "79-merge-with-delete",
        "80-idempotent-dimension-load",
      ],
      skills: ["MERGE", "UPSERT", "ON CONFLICT", "Idempotent loads"],
      icon: "\u{1F504}",
      prerequisites: ["DE-I2"],
    },
    {
      id: "DE-A4",
      name: "Incremental Loads",
      level: "advanced",
      description:
        "Implement watermark patterns (max updated_at) and partition overwrite (DELETE+INSERT) for incremental data loading.",
      exerciseIds: [
        "81-watermark-pattern",
        "82-partition-overwrite",
        "83-batch-id-tracking",
        "84-idempotent-reload",
      ],
      skills: ["Watermark pattern", "Partition overwrite", "Incremental ETL"],
      icon: "\u{1F4C8}",
      prerequisites: ["DE-A3"],
    },
    {
      id: "DE-A5",
      name: "Recursive CTEs",
      level: "advanced",
      description:
        "Traverse hierarchies, generate series, and solve graph problems using recursive common table expressions.",
      exerciseIds: [
        "85-recursive-hierarchy-depth",
        "86-recursive-path-concat",
        "87-recursive-bom-explosion",
        "88-recursive-category-tree",
      ],
      skills: ["Recursive CTE", "Hierarchy traversal", "Graph queries"],
      icon: "\u{1F503}",
      prerequisites: ["I2"],
    },
    {
      id: "DE-A6",
      name: "Data Quality Checks",
      level: "advanced",
      description:
        "Write SQL-based data quality checks: NULL completeness, uniqueness, referential integrity, and freshness.",
      exerciseIds: [
        "89-null-completeness-check",
        "90-uniqueness-validation",
        "91-referential-integrity",
        "92-range-freshness-check",
        "93-quality-suite-report",
      ],
      skills: ["NULL checks", "Uniqueness", "Referential integrity", "Freshness"],
      icon: "\u{2705}",
      prerequisites: ["DE-I1", "I2"],
    },
    {
      id: "DE-A7",
      name: "Query Optimization",
      level: "advanced",
      description:
        "Analyze execution plans, optimize joins, and apply indexing strategies for large datasets.",
      exerciseIds: [
        "94-explain-basics",
        "95-sargable-queries",
        "96-select-specificity",
        "97-exists-vs-in-performance",
      ],
      skills: ["EXPLAIN", "Join optimization", "Indexing", "Partitioning"],
      icon: "\u{26A1}",
      prerequisites: ["DE-A1", "I1"],
    },
    {
      id: "DE-A8",
      name: "Nested Data & JSON",
      level: "advanced",
      description:
        "Query nested data structures using DuckDB's STRUCT, LIST, and JSON functions for semi-structured data.",
      exerciseIds: [
        "98-list-aggregation",
        "99-list-unnesting",
        "100-struct-access",
        "101-json-processing",
      ],
      skills: ["STRUCT", "LIST", "JSON", "UNNEST"],
      icon: "\u{1F4E6}",
      prerequisites: ["DE-I3"],
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
