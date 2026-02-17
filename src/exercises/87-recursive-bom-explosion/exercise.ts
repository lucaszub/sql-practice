import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "87-recursive-bom-explosion",
  title: "Bill of Materials Explosion",
  titleFr: "Explosion de nomenclature (BOM)",
  difficulty: "hard",
  category: "recursive-ctes",
  description: `## Bill of Materials Explosion

The manufacturing team needs to plan raw material procurement. A finished product (e.g., a bicycle) is assembled from sub-assemblies (e.g., frame, wheels), which are themselves made of base components (e.g., steel tubes, spokes, tyres).

Given a **Bill of Materials** table that records direct parent-child relationships with quantities, write a query that **explodes** the full BOM: for every base component (a component that is never a parent itself), calculate the **total quantity** required to build **1 unit** of the top-level product.

Quantities multiply as they cascade down: if 1 wheel needs 32 spokes, and 1 bicycle needs 2 wheels, then 1 bicycle needs 64 spokes.

### Schema

**products**

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | VARCHAR | Product or component name |

**bom** (Bill of Materials)

| Column | Type | Notes |
|--------|------|-------|
| parent_id | INTEGER | FK → products.id |
| component_id | INTEGER | FK → products.id |
| quantity | INTEGER | Units of component per 1 parent |

### Task

Write a recursive CTE that starts from the top-level product (the product that never appears as a component, i.e., not present in \`bom.component_id\`) and multiplies quantities down to base components.

Return only **base components** (leaf nodes — components that never appear as a parent in the BOM).

### Expected output columns

\`component_name\`, \`total_quantity\`

Order by \`component_name\` ASC.`,

  descriptionFr: `## Explosion de nomenclature (BOM)

L'équipe de fabrication doit planifier l'approvisionnement en matières premières. Un produit fini (ex. un vélo) est assemblé à partir de sous-ensembles (ex. cadre, roues), eux-mêmes fabriqués à partir de composants de base (ex. tubes en acier, rayons, pneus).

À partir d'une table de **nomenclature** qui enregistre les relations parent-enfant directes avec des quantités, écrire une requête qui **explose** la BOM complète : pour chaque composant de base (un composant qui n'est jamais parent lui-même), calculer la **quantité totale** nécessaire pour fabriquer **1 unité** du produit de niveau supérieur.

Les quantités se multiplient en cascade : si 1 roue nécessite 32 rayons, et qu'1 vélo nécessite 2 roues, alors 1 vélo nécessite 64 rayons.

### Schéma

**products**

| Colonne | Type | Notes |
|---------|------|-------|
| id | INTEGER | Clé primaire |
| name | VARCHAR | Nom du produit ou composant |

**bom** (Nomenclature)

| Colonne | Type | Notes |
|---------|------|-------|
| parent_id | INTEGER | FK → products.id |
| component_id | INTEGER | FK → products.id |
| quantity | INTEGER | Unités de composant par 1 parent |

### Tâche

Écrire un CTE récursif qui part du produit de niveau supérieur (le produit qui n'apparaît jamais comme composant) et multiplie les quantités jusqu'aux composants de base.

Ne retourner que les **composants de base** (feuilles — composants qui n'apparaissent jamais comme parent dans la BOM).

### Colonnes attendues

\`component_name\`, \`total_quantity\`

Trier par \`component_name\` ASC.`,

  hint: "Seed the recursion with the top-level product (not in bom.component_id). At each recursive step, multiply the accumulated quantity by bom.quantity. Filter the final result to leaf nodes (not in bom.parent_id).",
  hintFr: "Initialisez la récursion avec le produit racine (absent de bom.component_id). À chaque étape récursive, multipliez la quantité accumulée par bom.quantity. Filtrez le résultat final aux noeuds feuilles (absents de bom.parent_id).",

  schema: `CREATE TABLE products (
  id   INTEGER,
  name VARCHAR
);

CREATE TABLE bom (
  parent_id    INTEGER,
  component_id INTEGER,
  quantity     INTEGER
);

-- Products
INSERT INTO products VALUES
  (1,  'Bicycle'),
  (2,  'Frame Assembly'),
  (3,  'Wheel Assembly'),
  (4,  'Handlebar Assembly'),
  (5,  'Steel Tube'),
  (6,  'Weld Joint'),
  (7,  'Rim'),
  (8,  'Spoke'),
  (9,  'Tyre'),
  (10, 'Handlebar Tube'),
  (11, 'Grip');

-- BOM: 1 Bicycle needs...
INSERT INTO bom VALUES
  (1,  2,  1),   -- 1 Frame Assembly
  (1,  3,  2),   -- 2 Wheel Assemblies
  (1,  4,  1),   -- 1 Handlebar Assembly
-- 1 Frame Assembly needs...
  (2,  5,  3),   -- 3 Steel Tubes
  (2,  6,  12),  -- 12 Weld Joints
-- 1 Wheel Assembly needs...
  (3,  7,  1),   -- 1 Rim
  (3,  8,  32),  -- 32 Spokes
  (3,  9,  1),   -- 1 Tyre
-- 1 Handlebar Assembly needs...
  (4,  10, 1),   -- 1 Handlebar Tube
  (4,  11, 2);   -- 2 Grips`,

  solutionQuery: `WITH RECURSIVE exploded AS (
  -- Anchor: top-level product (never a component)
  SELECT
    p.id            AS product_id,
    p.name          AS component_name,
    1               AS total_quantity
  FROM products p
  WHERE p.id NOT IN (SELECT component_id FROM bom)

  UNION ALL

  SELECT
    b.component_id,
    p.name,
    e.total_quantity * b.quantity
  FROM exploded e
  JOIN bom b       ON b.parent_id    = e.product_id
  JOIN products p  ON p.id           = b.component_id
)
-- Keep only leaf nodes (base components, never a parent)
SELECT
  component_name,
  total_quantity
FROM exploded
WHERE product_id NOT IN (SELECT DISTINCT parent_id FROM bom)
ORDER BY component_name;`,

  solutionExplanation: `## Explanation

### Pattern: Recursive BOM explosion with quantity multiplication

This is one of the classic industrial SQL patterns: the **multi-level Bill of Materials explosion**.

#### Step-by-step

1. **Anchor member** — finds the root product by checking that its \`id\` does not appear in \`bom.component_id\` (nothing is a parent of the root). Assigns \`total_quantity = 1\`.
2. **Recursive member** — for each node already in the CTE, joins \`bom\` to find its direct children. The new \`total_quantity\` is the parent's accumulated quantity **multiplied** by the BOM \`quantity\` for that edge.
3. **Leaf filter** — the outer query keeps only rows whose \`product_id\` does not appear in \`bom.parent_id\` (i.e., they have no children — they are base components).

#### Quantity propagation example

| Level | Node | Qty from parent | Accumulated |
|-------|------|----------------|-------------|
| 0 | Bicycle | 1 | 1 |
| 1 | Wheel Assembly | 2 | 2 |
| 2 | Spoke | 32 | 64 |

#### When to use

Manufacturing (procurement planning), recipe costing (food & beverage), dependency trees (software packages), any multi-level parent-child structure where you need the compounded effect of weights or quantities.`,

  solutionExplanationFr: `## Explication

### Patron : Explosion de BOM récursive avec multiplication de quantités

C'est l'un des patrons SQL industriels classiques : l'**explosion de nomenclature multi-niveaux**.

#### Étape par étape

1. **Membre ancre** — trouve le produit racine en vérifiant que son \`id\` n'apparaît pas dans \`bom.component_id\`. Attribue \`total_quantity = 1\`.
2. **Membre récursif** — pour chaque nœud déjà dans le CTE, joint \`bom\` pour trouver ses enfants directs. Le nouveau \`total_quantity\` est la quantité accumulée du parent **multipliée** par la \`quantity\` de la BOM pour cette arête.
3. **Filtre feuille** — la requête externe ne conserve que les lignes dont le \`product_id\` n'apparaît pas dans \`bom.parent_id\` (elles n'ont pas d'enfants — ce sont des composants de base).

#### Quand l'utiliser

Fabrication (planification des achats), coût de recettes (agroalimentaire), arbres de dépendances (paquets logiciels), toute structure parent-enfant multi-niveaux où l'on a besoin de l'effet composé des poids ou des quantités.`,

  testCases: [
    {
      name: "default",
      description: "Base components with total quantities needed to build 1 bicycle",
      descriptionFr: "Composants de base avec les quantités totales nécessaires pour fabriquer 1 vélo",
      expectedColumns: ["component_name", "total_quantity"],
      expectedRows: [
        { component_name: "Grip",          total_quantity: 2  },
        { component_name: "Handlebar Tube",total_quantity: 1  },
        { component_name: "Rim",           total_quantity: 2  },
        { component_name: "Spoke",         total_quantity: 64 },
        { component_name: "Steel Tube",    total_quantity: 3  },
        { component_name: "Tyre",          total_quantity: 2  },
        { component_name: "Weld Joint",    total_quantity: 12 },
      ],
      orderMatters: true,
    },
    {
      name: "extra-wheel",
      description: "Changing to 3 wheels updates spoke count to 96",
      descriptionFr: "Passer à 3 roues met à jour le nombre de rayons à 96",
      setupSql: `UPDATE bom SET quantity = 3 WHERE parent_id = 1 AND component_id = 3;`,
      expectedColumns: ["component_name", "total_quantity"],
      expectedRows: [
        { component_name: "Grip",          total_quantity: 2  },
        { component_name: "Handlebar Tube",total_quantity: 1  },
        { component_name: "Rim",           total_quantity: 3  },
        { component_name: "Spoke",         total_quantity: 96 },
        { component_name: "Steel Tube",    total_quantity: 3  },
        { component_name: "Tyre",          total_quantity: 3  },
        { component_name: "Weld Joint",    total_quantity: 12 },
      ],
      orderMatters: true,
    },
  ],
};
