import type { Exercise, Category, Difficulty } from "./types";

import { exercise as ex01 } from "@/exercises/01-top-n-per-group/exercise";
import { exercise as ex02 } from "@/exercises/02-running-total/exercise";
import { exercise as ex03 } from "@/exercises/03-yoy-growth/exercise";
import { exercise as ex04 } from "@/exercises/04-gap-and-island/exercise";
import { exercise as ex05 } from "@/exercises/05-employee-hierarchy/exercise";
import { exercise as ex06 } from "@/exercises/06-date-series/exercise";
import { exercise as ex07 } from "@/exercises/07-cohort-retention/exercise";
import { exercise as ex08 } from "@/exercises/08-funnel-analysis/exercise";
import { exercise as ex09 } from "@/exercises/09-consecutive-days/exercise";
import { exercise as ex10 } from "@/exercises/10-anti-join/exercise";
import { exercise as ex11 } from "@/exercises/11-select-where-basics/exercise";
import { exercise as ex12 } from "@/exercises/12-in-between-filtering/exercise";
import { exercise as ex13 } from "@/exercises/13-pattern-matching/exercise";
import { exercise as ex14 } from "@/exercises/14-sorting-results/exercise";
import { exercise as ex15 } from "@/exercises/15-limit-offset/exercise";
import { exercise as ex16 } from "@/exercises/16-multiple-conditions/exercise";
import { exercise as ex17 } from "@/exercises/17-filtered-catalog/exercise";
import { exercise as ex18 } from "@/exercises/18-count-basics/exercise";
import { exercise as ex19 } from "@/exercises/19-sum-avg-revenue/exercise";
import { exercise as ex20 } from "@/exercises/20-min-max-prices/exercise";
import { exercise as ex21 } from "@/exercises/21-group-by-category/exercise";
import { exercise as ex22 } from "@/exercises/22-group-by-multiple/exercise";
import { exercise as ex23 } from "@/exercises/23-having-filter/exercise";
import { exercise as ex24 } from "@/exercises/24-where-vs-having/exercise";
import { exercise as ex25 } from "@/exercises/25-inner-join-basics/exercise";
import { exercise as ex26 } from "@/exercises/26-join-with-aggregation/exercise";
import { exercise as ex27 } from "@/exercises/27-left-join-basics/exercise";
import { exercise as ex28 } from "@/exercises/28-left-join-missing/exercise";
import { exercise as ex29 } from "@/exercises/29-join-with-where/exercise";
import { exercise as ex30 } from "@/exercises/30-join-with-groupby/exercise";
import { exercise as ex31 } from "@/exercises/31-customer-summary/exercise";
import { exercise as ex32 } from "@/exercises/32-is-null-check/exercise";
import { exercise as ex33 } from "@/exercises/33-coalesce-defaults/exercise";
import { exercise as ex34 } from "@/exercises/34-case-when-basics/exercise";
import { exercise as ex35 } from "@/exercises/35-case-with-aggregation/exercise";
import { exercise as ex36 } from "@/exercises/36-null-case-combined/exercise";
import { exercise as ex37 } from "@/exercises/37-three-table-order-report/exercise";
import { exercise as ex38 } from "@/exercises/38-self-join-employee-managers/exercise";
import { exercise as ex39 } from "@/exercises/39-multi-table-revenue-by-category/exercise";
import { exercise as ex40 } from "@/exercises/40-cross-join-inventory-gaps/exercise";
import { exercise as ex41 } from "@/exercises/41-self-join-price-comparison/exercise";
import { exercise as ex42 } from "@/exercises/42-multi-table-top-performers/exercise";
import { exercise as ex43 } from "@/exercises/43-ecommerce-order-pipeline/exercise";
import { exercise as ex44 } from "@/exercises/44-scalar-subquery-above-avg/exercise";
import { exercise as ex45 } from "@/exercises/45-correlated-subquery-latest-order/exercise";
import { exercise as ex46 } from "@/exercises/46-cte-revenue-breakdown/exercise";
import { exercise as ex47 } from "@/exercises/47-multi-cte-customer-segmentation/exercise";
import { exercise as ex48 } from "@/exercises/48-exists-never-ordered/exercise";
import { exercise as ex49 } from "@/exercises/49-nested-ctes-mom-growth/exercise";
import { exercise as ex50 } from "@/exercises/50-saas-kpi-dashboard/exercise";
import { exercise as ex51 } from "@/exercises/51-create-table-basics/exercise";
import { exercise as ex52 } from "@/exercises/52-add-column-alter/exercise";
import { exercise as ex53 } from "@/exercises/53-create-with-constraints/exercise";
import { exercise as ex54 } from "@/exercises/54-foreign-key-design/exercise";
import { exercise as ex55 } from "@/exercises/55-drop-recreate-migration/exercise";
import { exercise as ex56 } from "@/exercises/56-bulk-insert-staging/exercise";
import { exercise as ex57 } from "@/exercises/57-insert-select-transform/exercise";
import { exercise as ex58 } from "@/exercises/58-update-from-join/exercise";
import { exercise as ex59 } from "@/exercises/59-delete-orphan-records/exercise";
import { exercise as ex60 } from "@/exercises/60-create-table-as-select/exercise";
import { exercise as ex61 } from "@/exercises/61-primary-key-design/exercise";
import { exercise as ex62 } from "@/exercises/62-foreign-key-relationships/exercise";
import { exercise as ex63 } from "@/exercises/63-check-constraints/exercise";
import { exercise as ex64 } from "@/exercises/64-not-null-defaults/exercise";
import { exercise as ex65 } from "@/exercises/65-data-type-casting/exercise";
import { exercise as ex66 } from "@/exercises/66-fact-table-design/exercise";
import { exercise as ex67 } from "@/exercises/67-dimension-table-design/exercise";
import { exercise as ex68 } from "@/exercises/68-date-dimension/exercise";
import { exercise as ex69 } from "@/exercises/69-star-schema-queries/exercise";
import { exercise as ex70 } from "@/exercises/70-snowflake-extension/exercise";
import { exercise as ex71 } from "@/exercises/71-scd-type1-overwrite/exercise";
import { exercise as ex72 } from "@/exercises/72-scd2-structure/exercise";
import { exercise as ex73 } from "@/exercises/73-scd2-insert-version/exercise";
import { exercise as ex74 } from "@/exercises/74-scd2-current-snapshot/exercise";
import { exercise as ex75 } from "@/exercises/75-scd2-point-in-time/exercise";
import { exercise as ex76 } from "@/exercises/76-insert-or-replace/exercise";
import { exercise as ex77 } from "@/exercises/77-merge-basics/exercise";
import { exercise as ex78 } from "@/exercises/78-merge-conditional/exercise";
import { exercise as ex79 } from "@/exercises/79-merge-with-delete/exercise";
import { exercise as ex80 } from "@/exercises/80-idempotent-dimension-load/exercise";
import { exercise as ex81 } from "@/exercises/81-watermark-pattern/exercise";
import { exercise as ex82 } from "@/exercises/82-partition-overwrite/exercise";
import { exercise as ex83 } from "@/exercises/83-batch-id-tracking/exercise";
import { exercise as ex84 } from "@/exercises/84-idempotent-reload/exercise";
import { exercise as ex85 } from "@/exercises/85-recursive-hierarchy-depth/exercise";
import { exercise as ex86 } from "@/exercises/86-recursive-path-concat/exercise";
import { exercise as ex87 } from "@/exercises/87-recursive-bom-explosion/exercise";
import { exercise as ex88 } from "@/exercises/88-recursive-category-tree/exercise";
import { exercise as ex89 } from "@/exercises/89-null-completeness-check/exercise";
import { exercise as ex90 } from "@/exercises/90-uniqueness-validation/exercise";
import { exercise as ex91 } from "@/exercises/91-referential-integrity/exercise";
import { exercise as ex92 } from "@/exercises/92-range-freshness-check/exercise";
import { exercise as ex93 } from "@/exercises/93-quality-suite-report/exercise";
import { exercise as ex94 } from "@/exercises/94-explain-basics/exercise";
import { exercise as ex95 } from "@/exercises/95-sargable-queries/exercise";
import { exercise as ex96 } from "@/exercises/96-select-specificity/exercise";
import { exercise as ex97 } from "@/exercises/97-exists-vs-in-performance/exercise";
import { exercise as ex98 } from "@/exercises/98-list-aggregation/exercise";
import { exercise as ex99 } from "@/exercises/99-list-unnesting/exercise";
import { exercise as ex100 } from "@/exercises/100-struct-access/exercise";
import { exercise as ex101 } from "@/exercises/101-json-processing/exercise";
import { exercise as ex102 } from "@/exercises/102-row-number-basics/exercise";
import { exercise as ex103 } from "@/exercises/103-rank-vs-dense-rank/exercise";
import { exercise as ex104 } from "@/exercises/104-ntile-quartiles/exercise";
import { exercise as ex105 } from "@/exercises/105-percent-rank-salary/exercise";
import { exercise as ex106 } from "@/exercises/106-deduplication-latest-record/exercise";
import { exercise as ex107 } from "@/exercises/107-top-performers-region/exercise";
import { exercise as ex108 } from "@/exercises/108-rfm-segmentation/exercise";
import { exercise as ex109 } from "@/exercises/109-lag-previous-month/exercise";
import { exercise as ex110 } from "@/exercises/110-lead-next-event/exercise";
import { exercise as ex111 } from "@/exercises/111-mom-growth/exercise";
import { exercise as ex112 } from "@/exercises/112-first-last-value/exercise";
import { exercise as ex113 } from "@/exercises/113-period-comparison/exercise";
import { exercise as ex114 } from "@/exercises/114-trend-detection/exercise";
import { exercise as ex115 } from "@/exercises/115-running-count/exercise";
import { exercise as ex116 } from "@/exercises/116-rows-vs-range/exercise";
import { exercise as ex117 } from "@/exercises/117-partitioned-running-total/exercise";
import { exercise as ex118 } from "@/exercises/118-growth-target-tracking/exercise";
import { exercise as ex119 } from "@/exercises/119-island-grouping/exercise";
import { exercise as ex120 } from "@/exercises/120-gap-detection/exercise";
import { exercise as ex121 } from "@/exercises/121-session-detection/exercise";
import { exercise as ex122 } from "@/exercises/122-campaign-region-gaps/exercise";
import { exercise as ex123 } from "@/exercises/123-pro-feature-adoption-gaps/exercise";
import { exercise as ex124 } from "@/exercises/124-shift-coverage-gaps/exercise";
import { exercise as ex125 } from "@/exercises/125-store-category-promo-gaps/exercise";
import { exercise as ex126 } from "@/exercises/126-monthly-account-gaps/exercise";

export const exercises: Exercise[] = [
  ex01, ex02, ex03, ex04, ex05,
  ex06, ex07, ex08, ex09, ex10,
  ex11, ex12, ex13, ex14, ex15,
  ex16, ex17, ex18, ex19, ex20,
  ex21, ex22, ex23, ex24, ex25,
  ex26, ex27, ex28, ex29, ex30,
  ex31, ex32, ex33, ex34, ex35,
  ex36, ex37, ex38, ex39, ex40,
  ex41, ex42, ex43, ex44, ex45,
  ex46, ex47, ex48, ex49, ex50,
  ex51, ex52, ex53, ex54, ex55,
  ex56, ex57, ex58, ex59, ex60,
  ex61, ex62, ex63, ex64, ex65,
  ex66, ex67, ex68, ex69, ex70,
  ex71, ex72, ex73, ex74, ex75,
  ex76, ex77, ex78, ex79, ex80,
  ex81, ex82, ex83, ex84,
  ex85, ex86, ex87, ex88,
  ex89, ex90, ex91, ex92, ex93,
  ex94, ex95, ex96, ex97,
  ex98, ex99, ex100, ex101,
  ex102, ex103, ex104, ex105, ex106,
  ex107, ex108, ex109, ex110, ex111,
  ex112, ex113, ex114, ex115, ex116,
  ex117, ex118, ex119, ex120, ex121,
  ex122, ex123, ex124, ex125, ex126,
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByCategory(category: Category): Exercise[] {
  return exercises.filter((e) => e.category === category);
}

export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return exercises.filter((e) => e.difficulty === difficulty);
}
