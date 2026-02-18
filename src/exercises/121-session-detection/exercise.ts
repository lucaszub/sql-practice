import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "121-session-detection",
  title: "Sessionize Page Views",
  titleFr: "Sessioniser les pages vues",
  difficulty: "hard",
  category: "gaps-islands",
  description: `## Sessionize Page Views

The product analytics team needs to group raw page view events into **user sessions**. A new session starts when more than **30 minutes** have elapsed since the previous page view by the same user. For each session, report the user, session number, start time, end time, and number of page views.

### Schema

| Column | Type |
|--------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| page_url | VARCHAR |
| event_time | TIMESTAMP |

### Expected output columns
\`user_id\`, \`session_number\`, \`session_start\`, \`session_end\`, \`page_views\`

- \`session_number\`: Sequential session number per user (1, 2, 3, ...)
- \`session_start\`: Timestamp of the first page view in the session
- \`session_end\`: Timestamp of the last page view in the session
- \`page_views\`: Number of page views in the session
- Order by user_id ASC, session_number ASC.`,
  descriptionFr: `## Sessioniser les pages vues

L'équipe d'analytics produit doit regrouper les événements bruts de pages vues en **sessions utilisateur**. Une nouvelle session commence quand plus de **30 minutes** se sont écoulées depuis la page vue précédente du même utilisateur. Pour chaque session, rapportez l'utilisateur, le numéro de session, l'heure de début, l'heure de fin et le nombre de pages vues.

### Schema

| Column | Type |
|--------|------|
| event_id | INTEGER |
| user_id | INTEGER |
| page_url | VARCHAR |
| event_time | TIMESTAMP |

### Colonnes attendues en sortie
\`user_id\`, \`session_number\`, \`session_start\`, \`session_end\`, \`page_views\`

- \`session_number\` : Numéro de session séquentiel par utilisateur (1, 2, 3, ...)
- \`session_start\` : Timestamp de la première page vue de la session
- \`session_end\` : Timestamp de la dernière page vue de la session
- \`page_views\` : Nombre de pages vues dans la session
- Triez par user_id ASC, session_number ASC.`,
  hint: "Use LAG(event_time) to find the time gap between consecutive events. Flag events where the gap exceeds 30 minutes as new session starts. Use a running SUM of these flags to assign session IDs, then aggregate.",
  hintFr: "Utilisez LAG(event_time) pour trouver l'écart de temps entre événements consécutifs. Marquez les événements où l'écart dépasse 30 minutes comme début de nouvelle session. Utilisez une SUM courante de ces marqueurs pour attribuer des IDs de session, puis agrégez.",
  schema: `CREATE TABLE page_views (
  event_id INTEGER,
  user_id INTEGER,
  page_url VARCHAR,
  event_time TIMESTAMP
);

INSERT INTO page_views VALUES
  (1, 1, '/home', '2024-01-15 09:00:00'),
  (2, 1, '/products', '2024-01-15 09:05:00'),
  (3, 1, '/products/123', '2024-01-15 09:12:00'),
  (4, 1, '/cart', '2024-01-15 09:20:00'),
  (5, 1, '/home', '2024-01-15 14:00:00'),
  (6, 1, '/about', '2024-01-15 14:10:00'),
  (7, 2, '/home', '2024-01-15 10:00:00'),
  (8, 2, '/products', '2024-01-15 10:15:00'),
  (9, 2, '/home', '2024-01-15 10:50:00'),
  (10, 2, '/products', '2024-01-15 12:30:00'),
  (11, 2, '/cart', '2024-01-15 12:35:00'),
  (12, 2, '/checkout', '2024-01-15 12:40:00'),
  (13, 3, '/home', '2024-01-15 08:00:00');`,
  solutionQuery: `WITH with_gap AS (
  SELECT
    user_id,
    event_time,
    CASE
      WHEN event_time - LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) > INTERVAL '30' MINUTE
        OR LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) IS NULL
      THEN 1
      ELSE 0
    END AS new_session_flag
  FROM page_views
),
with_session_id AS (
  SELECT
    user_id,
    event_time,
    SUM(new_session_flag) OVER (PARTITION BY user_id ORDER BY event_time ROWS UNBOUNDED PRECEDING) AS session_number
  FROM with_gap
)
SELECT
  user_id,
  session_number,
  MIN(event_time) AS session_start,
  MAX(event_time) AS session_end,
  COUNT(*) AS page_views
FROM with_session_id
GROUP BY user_id, session_number
ORDER BY user_id, session_number;`,
  solutionExplanation: `## Explanation

### Pattern: Session detection (LAG-based gap-and-island)

This is an advanced variant of the gap-and-island pattern using **time-based gaps** instead of consecutive integers.

### Step-by-step
1. **CTE \`with_gap\`**: Use LAG() to compute time gap between consecutive events per user. Flag the first event and events with a 30+ minute gap as new session starts (flag = 1).
2. **CTE \`with_session_id\`**: Running SUM of the new_session_flag gives a session number that increments each time a new session starts.
3. **Final aggregation**: GROUP BY user_id and session_number to get session-level metrics.

### The running SUM trick for session numbering
| event_time | gap | flag | running SUM |
|-----------|-----|------|-------------|
| 09:00 | NULL | 1 | 1 (session 1) |
| 09:05 | 5min | 0 | 1 |
| 09:12 | 7min | 0 | 1 |
| 09:20 | 8min | 0 | 1 |
| 14:00 | 280min | 1 | 2 (session 2) |
| 14:10 | 10min | 0 | 2 |

### Real-world applications
- **Web analytics**: Google Analytics-style session definition (30-minute timeout)
- **Mobile app sessions**: Activity timeout detection
- **API usage sessions**: Group related API calls
- **Customer journey analysis**: Break user interactions into meaningful sessions

### Alternative: adjustable timeout
Change \`INTERVAL '30' MINUTE\` to any duration. Common values:
- 30 minutes (web analytics standard)
- 5 minutes (mobile apps)
- 24 hours (daily session grouping)`,
  solutionExplanationFr: `## Explication

### Pattern : Détection de sessions (gap-and-island basé sur LAG)

C'est une variante avancée du pattern gap-and-island utilisant des **lacunes temporelles** au lieu d'entiers consécutifs.

### Étape par étape
1. **CTE \`with_gap\`** : Utiliser LAG() pour calculer l'écart temporel. Marquer les événements avec un écart de 30+ minutes.
2. **CTE \`with_session_id\`** : La SUM courante du flag donne un numéro de session.
3. **Agrégation finale** : GROUP BY utilisateur et session pour les métriques au niveau session.

### Applications concrètes
- **Web analytics** : Définition de session style Google Analytics
- **Sessions d'applications mobiles**
- **Sessions d'utilisation d'API**
- **Analyse du parcours client**`,
  testCases: [
    {
      name: "default",
      description: "Sessionize page views with 30-minute timeout",
      descriptionFr: "Sessioniser les pages vues avec un timeout de 30 minutes",
      expectedColumns: ["user_id", "session_number", "session_start", "session_end", "page_views"],
      expectedRows: [
        { user_id: 1, session_number: 1, session_start: "2024-01-15 09:00:00", session_end: "2024-01-15 09:20:00", page_views: 4 },
        { user_id: 1, session_number: 2, session_start: "2024-01-15 14:00:00", session_end: "2024-01-15 14:10:00", page_views: 2 },
        { user_id: 2, session_number: 1, session_start: "2024-01-15 10:00:00", session_end: "2024-01-15 10:15:00", page_views: 2 },
        { user_id: 2, session_number: 2, session_start: "2024-01-15 10:50:00", session_end: "2024-01-15 10:50:00", page_views: 1 },
        { user_id: 2, session_number: 3, session_start: "2024-01-15 12:30:00", session_end: "2024-01-15 12:40:00", page_views: 3 },
        { user_id: 3, session_number: 1, session_start: "2024-01-15 08:00:00", session_end: "2024-01-15 08:00:00", page_views: 1 },
      ],
      orderMatters: true,
    },
    {
      name: "single-event-session",
      description: "Single event creates a session with 1 page view",
      descriptionFr: "Un seul événement crée une session avec 1 page vue",
      setupSql: `DELETE FROM page_views WHERE user_id != 3;`,
      expectedColumns: ["user_id", "session_number", "session_start", "session_end", "page_views"],
      expectedRows: [
        { user_id: 3, session_number: 1, session_start: "2024-01-15 08:00:00", session_end: "2024-01-15 08:00:00", page_views: 1 },
      ],
      orderMatters: true,
    },
  ],
};
