import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "77-merge-basics",
  title: "Store Dimension Merge",
  titleFr: "Fusion de la dimension magasin",
  difficulty: "medium",
  category: "merge-upsert",
  description: `## Store Dimension Merge

The retail data platform refreshes the store dimension table nightly. A staging table arrives with a mix of **updated store attributes** (changed region or manager) and **brand-new stores** (just opened). Your job is to merge staging data into the dimension table: update existing records if the \`store_code\` already exists, insert new ones if it doesn't.

Use DuckDB's \`INSERT INTO ... ON CONFLICT (store_code) DO UPDATE SET ...\` syntax.

### Schema

**dim_store** (target dimension — 8 stores already loaded)
| Column | Type |
|--------|------|
| store_id | INTEGER (PRIMARY KEY) |
| store_code | VARCHAR (UNIQUE) |
| store_name | VARCHAR |
| region | VARCHAR |
| manager | VARCHAR |

**staging_stores** (nightly delta — 5 rows: 3 updates + 2 new)
| Column | Type |
|--------|------|
| store_code | VARCHAR |
| store_name | VARCHAR |
| region | VARCHAR |
| manager | VARCHAR |

### Task

Write a query using \`INSERT INTO dim_store (store_id, store_code, store_name, region, manager) SELECT ...\` with \`ON CONFLICT (store_code) DO UPDATE SET store_name = EXCLUDED.store_name, region = EXCLUDED.region, manager = EXCLUDED.manager\`. Then \`SELECT\` all stores ordered by \`store_id\` ASC.

For new stores, generate a \`store_id\` using \`(SELECT COALESCE(MAX(store_id), 0) + ROW_NUMBER() OVER () FROM dim_store)\` or simply hard-code the next IDs in the INSERT.

### Expected output columns
\`store_id\`, \`store_code\`, \`store_name\`, \`region\`, \`manager\``,
  descriptionFr: `## Fusion de la dimension magasin

La plateforme data retail rafraîchit chaque nuit la table de dimension magasin. Une table de staging arrive avec un mélange d'**attributs de magasins mis à jour** (région ou responsable changé) et de **nouveaux magasins** (venant d'ouvrir). Votre mission est de fusionner les données de staging dans la table de dimension : mettre à jour les enregistrements existants si le \`store_code\` existe déjà, insérer les nouveaux sinon.

Utilisez la syntaxe \`INSERT INTO ... ON CONFLICT (store_code) DO UPDATE SET ...\` de DuckDB.

### Schéma

**dim_store** (dimension cible — 8 magasins déjà chargés)
| Colonne | Type |
|---------|------|
| store_id | INTEGER (PRIMARY KEY) |
| store_code | VARCHAR (UNIQUE) |
| store_name | VARCHAR |
| region | VARCHAR |
| manager | VARCHAR |

**staging_stores** (delta nocturne — 5 lignes : 3 mises à jour + 2 nouveaux)
| Colonne | Type |
|---------|------|
| store_code | VARCHAR |
| store_name | VARCHAR |
| region | VARCHAR |
| manager | VARCHAR |

### Tâche

Écrivez une requête utilisant \`INSERT INTO dim_store (...) SELECT ...\` avec \`ON CONFLICT (store_code) DO UPDATE SET store_name = EXCLUDED.store_name, region = EXCLUDED.region, manager = EXCLUDED.manager\`. Puis faites un \`SELECT\` de tous les magasins triés par \`store_id\` ASC.

### Colonnes attendues en sortie
\`store_id\`, \`store_code\`, \`store_name\`, \`region\`, \`manager\``,
  hint: "Use INSERT INTO dim_store SELECT ... FROM staging_stores with ON CONFLICT (store_code) DO UPDATE SET. The EXCLUDED pseudo-table holds the values that failed to insert. For new store IDs, use (SELECT MAX(store_id) FROM dim_store) + row position.",
  hintFr: "Utilisez INSERT INTO dim_store SELECT ... FROM staging_stores avec ON CONFLICT (store_code) DO UPDATE SET. La pseudo-table EXCLUDED contient les valeurs qui n'ont pas pu être insérées. Pour les IDs des nouveaux magasins, utilisez (SELECT MAX(store_id) FROM dim_store) + position de ligne.",
  schema: `CREATE TABLE dim_store (
  store_id INTEGER PRIMARY KEY,
  store_code VARCHAR UNIQUE,
  store_name VARCHAR,
  region VARCHAR,
  manager VARCHAR
);

CREATE TABLE staging_stores (
  store_code VARCHAR,
  store_name VARCHAR,
  region VARCHAR,
  manager VARCHAR
);

INSERT INTO dim_store VALUES
  (1, 'ST-001', 'Paris Centre',   'Ile-de-France', 'Alice Martin'),
  (2, 'ST-002', 'Lyon Bellecour', 'Auvergne-RA',   'Bruno Faure'),
  (3, 'ST-003', 'Marseille Sud',  'PACA',           'Carole Dumont'),
  (4, 'ST-004', 'Bordeaux Lac',   'Nouvelle-Aq',    'David Renard'),
  (5, 'ST-005', 'Lille Grand',    'Hauts-de-Fr',    'Emma Petit'),
  (6, 'ST-006', 'Nantes Ouest',   'Pays de Loire',  'Fabien Morel'),
  (7, 'ST-007', 'Toulouse Rose',  'Occitanie',      'Gaelle Simon'),
  (8, 'ST-008', 'Strasbourg Est', 'Grand-Est',      'Hugo Blanc');

INSERT INTO staging_stores VALUES
  ('ST-002', 'Lyon Part-Dieu',  'Auvergne-RA',   'Bruno Faure'),
  ('ST-005', 'Lille Euralille', 'Hauts-de-Fr',    'Emma Petit'),
  ('ST-007', 'Toulouse Blagnac','Occitanie',      'Henri Vidal'),
  ('ST-009', 'Nice Riviera',    'PACA',           'Isabelle Roy'),
  ('ST-010', 'Rennes Centre',   'Bretagne',       'Jacques Moreau');`,
  solutionQuery: `INSERT INTO dim_store (store_id, store_code, store_name, region, manager)
SELECT
  (SELECT MAX(store_id) FROM dim_store) + ROW_NUMBER() OVER () AS store_id,
  store_code,
  store_name,
  region,
  manager
FROM staging_stores
ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  region     = EXCLUDED.region,
  manager    = EXCLUDED.manager;

SELECT store_id, store_code, store_name, region, manager
FROM dim_store
ORDER BY store_id;`,
  solutionExplanation: `## Explanation

### Pattern: INSERT ... ON CONFLICT DO UPDATE (Upsert — selective column update)

Unlike \`INSERT OR REPLACE\`, this pattern updates only specified columns when a conflict is detected, leaving other columns (like surrogate keys or audit timestamps) untouched.

### Step-by-step
1. \`INSERT INTO dim_store (...)\` — specifies which columns to populate.
2. \`SELECT ... ROW_NUMBER() OVER () AS store_id\` — generates surrogate IDs for new rows only. When a conflict fires, the store_id from the INSERT is ignored.
3. \`ON CONFLICT (store_code)\` — the natural key that determines if a row already exists.
4. \`DO UPDATE SET store_name = EXCLUDED.store_name, ...\` — \`EXCLUDED\` is a virtual table holding the values that failed to insert. Only the specified columns are updated.
5. Existing rows for ST-002, ST-005, ST-007 get their names/managers updated. ST-009, ST-010 are inserted as new rows with IDs 9 and 10.

### Why
\`ON CONFLICT DO UPDATE\` (also known as UPSERT) is the standard way to implement idempotent dimension loads. It is atomic and does not delete then re-insert rows (no FK cascade issues).

### When to use
- Dimension table refreshes where surrogate keys must be preserved
- Any insert that should gracefully handle duplicate natural keys
- SCD Type 1 loads where you overwrite changed attributes in-place`,
  solutionExplanationFr: `## Explication

### Patron : INSERT ... ON CONFLICT DO UPDATE (Upsert — mise à jour sélective de colonnes)

Contrairement à \`INSERT OR REPLACE\`, ce patron ne met à jour que les colonnes spécifiées en cas de conflit, laissant intactes les autres colonnes (comme les clés de substitution ou les timestamps d'audit).

### Étape par étape
1. \`INSERT INTO dim_store (...)\` — spécifie quelles colonnes alimenter.
2. \`SELECT ... ROW_NUMBER() OVER () AS store_id\` — génère des IDs de substitution pour les nouvelles lignes uniquement. En cas de conflit, le store_id de l'INSERT est ignoré.
3. \`ON CONFLICT (store_code)\` — la clé naturelle qui détermine si une ligne existe déjà.
4. \`DO UPDATE SET store_name = EXCLUDED.store_name, ...\` — \`EXCLUDED\` est une table virtuelle contenant les valeurs qui n'ont pas pu être insérées. Seules les colonnes spécifiées sont mises à jour.
5. Les lignes existantes ST-002, ST-005, ST-007 voient leurs noms/responsables mis à jour. ST-009, ST-010 sont insérés comme nouvelles lignes avec les IDs 9 et 10.

### Pourquoi
\`ON CONFLICT DO UPDATE\` (aussi appelé UPSERT) est la façon standard d'implémenter des chargements de dimension idempotents. C'est atomique et ne supprime pas puis ne réinsère pas les lignes (pas de problème de cascade FK).

### Quand l'utiliser
- Rafraîchissements de tables de dimension où les clés de substitution doivent être préservées
- Tout INSERT devant gérer gracieusement les clés naturelles dupliquées
- Chargements SCD Type 1 où on écrase les attributs modifiés sur place`,
  testCases: [
    {
      name: "default",
      description: "10 stores: 5 unchanged, 3 updated (name/manager), 2 newly inserted, ordered by store_id",
      descriptionFr: "10 magasins : 5 inchangés, 3 mis à jour (nom/responsable), 2 nouvellement insérés, triés par store_id",
      expectedColumns: ["store_id", "store_code", "store_name", "region", "manager"],
      expectedRows: [
        { store_id: 1,  store_code: "ST-001", store_name: "Paris Centre",    region: "Ile-de-France", manager: "Alice Martin"   },
        { store_id: 2,  store_code: "ST-002", store_name: "Lyon Part-Dieu",  region: "Auvergne-RA",   manager: "Bruno Faure"   },
        { store_id: 3,  store_code: "ST-003", store_name: "Marseille Sud",   region: "PACA",           manager: "Carole Dumont" },
        { store_id: 4,  store_code: "ST-004", store_name: "Bordeaux Lac",    region: "Nouvelle-Aq",    manager: "David Renard"  },
        { store_id: 5,  store_code: "ST-005", store_name: "Lille Euralille", region: "Hauts-de-Fr",    manager: "Emma Petit"    },
        { store_id: 6,  store_code: "ST-006", store_name: "Nantes Ouest",    region: "Pays de Loire",  manager: "Fabien Morel"  },
        { store_id: 7,  store_code: "ST-007", store_name: "Toulouse Blagnac",region: "Occitanie",      manager: "Henri Vidal"   },
        { store_id: 8,  store_code: "ST-008", store_name: "Strasbourg Est",  region: "Grand-Est",      manager: "Hugo Blanc"    },
        { store_id: 9,  store_code: "ST-009", store_name: "Nice Riviera",    region: "PACA",           manager: "Isabelle Roy"  },
        { store_id: 10, store_code: "ST-010", store_name: "Rennes Centre",   region: "Bretagne",       manager: "Jacques Moreau"},
      ],
      orderMatters: true,
    },
    {
      name: "only-updates-no-new",
      description: "When staging only contains existing store codes, no new rows are inserted",
      descriptionFr: "Quand le staging ne contient que des codes magasin existants, aucune nouvelle ligne n'est insérée",
      setupSql: `DELETE FROM staging_stores WHERE store_code IN ('ST-009', 'ST-010');`,
      expectedColumns: ["store_id", "store_code", "store_name", "region", "manager"],
      expectedRows: [
        { store_id: 1, store_code: "ST-001", store_name: "Paris Centre",    region: "Ile-de-France", manager: "Alice Martin"   },
        { store_id: 2, store_code: "ST-002", store_name: "Lyon Part-Dieu",  region: "Auvergne-RA",   manager: "Bruno Faure"   },
        { store_id: 3, store_code: "ST-003", store_name: "Marseille Sud",   region: "PACA",           manager: "Carole Dumont" },
        { store_id: 4, store_code: "ST-004", store_name: "Bordeaux Lac",    region: "Nouvelle-Aq",    manager: "David Renard"  },
        { store_id: 5, store_code: "ST-005", store_name: "Lille Euralille", region: "Hauts-de-Fr",    manager: "Emma Petit"    },
        { store_id: 6, store_code: "ST-006", store_name: "Nantes Ouest",    region: "Pays de Loire",  manager: "Fabien Morel"  },
        { store_id: 7, store_code: "ST-007", store_name: "Toulouse Blagnac",region: "Occitanie",      manager: "Henri Vidal"   },
        { store_id: 8, store_code: "ST-008", store_name: "Strasbourg Est",  region: "Grand-Est",      manager: "Hugo Blanc"    },
      ],
      orderMatters: false,
    },
  ],
};
