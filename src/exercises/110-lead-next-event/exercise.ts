import type { Exercise } from "@/lib/exercises/types";

export const exercise: Exercise = {
  id: "110-lead-next-event",
  title: "Next Appointment Scheduling",
  titleFr: "Planification du prochain rendez-vous",
  difficulty: "medium",
  category: "analytics-patterns",
  description: `## Next Appointment Scheduling

A medical clinic wants to show patients their **next scheduled appointment** alongside the current one so the receptionist can remind them at checkout. For each appointment, display the date and type of the **next** appointment for the same patient.

### Schema

| Column | Type |
|--------|------|
| appointment_id | INTEGER |
| patient_id | INTEGER |
| patient_name | VARCHAR |
| appointment_date | DATE |
| appointment_type | VARCHAR |

### Expected output columns
\`patient_name\`, \`appointment_date\`, \`appointment_type\`, \`next_appointment_date\`, \`next_appointment_type\`

- \`next_appointment_date\` and \`next_appointment_type\`: The date and type of the patient's next appointment (NULL if none).
- Order by patient_name ASC, appointment_date ASC.`,
  descriptionFr: `## Planification du prochain rendez-vous

Une clinique médicale souhaite montrer aux patients leur **prochain rendez-vous planifié** à côté du rendez-vous actuel pour que la réceptionniste puisse le rappeler à la sortie. Pour chaque rendez-vous, affichez la date et le type du **prochain** rendez-vous du même patient.

### Schema

| Column | Type |
|--------|------|
| appointment_id | INTEGER |
| patient_id | INTEGER |
| patient_name | VARCHAR |
| appointment_date | DATE |
| appointment_type | VARCHAR |

### Colonnes attendues en sortie
\`patient_name\`, \`appointment_date\`, \`appointment_type\`, \`next_appointment_date\`, \`next_appointment_type\`

- \`next_appointment_date\` et \`next_appointment_type\` : La date et le type du prochain rendez-vous du patient (NULL s'il n'y en a pas).
- Triez par patient_name ASC, appointment_date ASC.`,
  hint: "Use LEAD(appointment_date) OVER (PARTITION BY patient_id ORDER BY appointment_date) to look ahead to the next row. Apply LEAD to both columns you need from the next appointment.",
  hintFr: "Utilisez LEAD(appointment_date) OVER (PARTITION BY patient_id ORDER BY appointment_date) pour regarder la ligne suivante. Appliquez LEAD aux deux colonnes dont vous avez besoin du prochain rendez-vous.",
  schema: `CREATE TABLE appointments (
  appointment_id INTEGER,
  patient_id INTEGER,
  patient_name VARCHAR,
  appointment_date DATE,
  appointment_type VARCHAR
);

INSERT INTO appointments VALUES
  (1, 301, 'Marie Dupont', '2024-03-15', 'Checkup'),
  (2, 301, 'Marie Dupont', '2024-06-20', 'Follow-up'),
  (3, 301, 'Marie Dupont', '2024-09-10', 'Blood work'),
  (4, 302, 'Jean Leroy', '2024-02-28', 'Consultation'),
  (5, 302, 'Jean Leroy', '2024-05-14', 'X-Ray'),
  (6, 303, 'Sophie Martin', '2024-04-05', 'Annual exam'),
  (7, 304, 'Paul Bernard', '2024-01-20', 'Checkup'),
  (8, 304, 'Paul Bernard', '2024-04-12', 'Follow-up'),
  (9, 304, 'Paul Bernard', '2024-07-25', 'Checkup'),
  (10, 304, 'Paul Bernard', '2024-10-30', 'Blood work');`,
  solutionQuery: `SELECT
  patient_name,
  appointment_date,
  appointment_type,
  LEAD(appointment_date) OVER (PARTITION BY patient_id ORDER BY appointment_date) AS next_appointment_date,
  LEAD(appointment_type) OVER (PARTITION BY patient_id ORDER BY appointment_date) AS next_appointment_type
FROM appointments
ORDER BY patient_name, appointment_date;`,
  solutionExplanation: `## Explanation

### Pattern: LEAD() to look ahead at the next row

This uses the **LEAD()** window function — the counterpart of LAG() — to access values from the next row.

### Step-by-step
1. \`PARTITION BY patient_id\` — each patient has their own window
2. \`ORDER BY appointment_date\` — appointments ordered chronologically
3. \`LEAD(appointment_date)\` — gets the date from the next row in the partition
4. \`LEAD(appointment_type)\` — gets the type from the next row (same window)

### LAG vs LEAD
- **LAG()**: looks backward (previous row) — "what happened before?"
- **LEAD()**: looks forward (next row) — "what comes next?"
- Both accept the same parameters: (column, offset, default)

### Named windows for efficiency
When using the same window definition multiple times, DuckDB supports named windows:
\`\`\`sql
SELECT ...
  LEAD(appointment_date) OVER w AS next_date,
  LEAD(appointment_type) OVER w AS next_type
FROM appointments
WINDOW w AS (PARTITION BY patient_id ORDER BY appointment_date)
\`\`\`

### When to use LEAD()
- "Next event" queries (next appointment, next purchase, next login)
- Gap detection between consecutive events
- Forward-looking calculations (time until next event)`,
  solutionExplanationFr: `## Explication

### Pattern : LEAD() pour regarder la ligne suivante

Ce pattern utilise la fonction de fenêtre **LEAD()** — le pendant de LAG() — pour accéder aux valeurs de la ligne suivante.

### Étape par étape
1. \`PARTITION BY patient_id\` — chaque patient a sa propre fenêtre
2. \`ORDER BY appointment_date\` — rendez-vous ordonnés chronologiquement
3. \`LEAD(appointment_date)\` — obtient la date de la ligne suivante
4. \`LEAD(appointment_type)\` — obtient le type de la ligne suivante

### LAG vs LEAD
- **LAG()** : regarde en arrière (ligne précédente)
- **LEAD()** : regarde en avant (ligne suivante)

### Quand utiliser LEAD()
- Requêtes "prochain événement" (prochain rendez-vous, prochain achat)
- Détection de lacunes entre événements consécutifs
- Calculs prospectifs (temps avant le prochain événement)`,
  testCases: [
    {
      name: "default",
      description: "Next appointment for each patient",
      descriptionFr: "Prochain rendez-vous pour chaque patient",
      expectedColumns: ["patient_name", "appointment_date", "appointment_type", "next_appointment_date", "next_appointment_type"],
      expectedRows: [
        { patient_name: "Jean Leroy", appointment_date: "2024-02-28", appointment_type: "Consultation", next_appointment_date: "2024-05-14", next_appointment_type: "X-Ray" },
        { patient_name: "Jean Leroy", appointment_date: "2024-05-14", appointment_type: "X-Ray", next_appointment_date: null, next_appointment_type: null },
        { patient_name: "Marie Dupont", appointment_date: "2024-03-15", appointment_type: "Checkup", next_appointment_date: "2024-06-20", next_appointment_type: "Follow-up" },
        { patient_name: "Marie Dupont", appointment_date: "2024-06-20", appointment_type: "Follow-up", next_appointment_date: "2024-09-10", next_appointment_type: "Blood work" },
        { patient_name: "Marie Dupont", appointment_date: "2024-09-10", appointment_type: "Blood work", next_appointment_date: null, next_appointment_type: null },
        { patient_name: "Paul Bernard", appointment_date: "2024-01-20", appointment_type: "Checkup", next_appointment_date: "2024-04-12", next_appointment_type: "Follow-up" },
        { patient_name: "Paul Bernard", appointment_date: "2024-04-12", appointment_type: "Follow-up", next_appointment_date: "2024-07-25", next_appointment_type: "Checkup" },
        { patient_name: "Paul Bernard", appointment_date: "2024-07-25", appointment_type: "Checkup", next_appointment_date: "2024-10-30", next_appointment_type: "Blood work" },
        { patient_name: "Paul Bernard", appointment_date: "2024-10-30", appointment_type: "Blood work", next_appointment_date: null, next_appointment_type: null },
        { patient_name: "Sophie Martin", appointment_date: "2024-04-05", appointment_type: "Annual exam", next_appointment_date: null, next_appointment_type: null },
      ],
      orderMatters: true,
    },
    {
      name: "single-appointment",
      description: "Patient with one appointment gets NULL for next",
      descriptionFr: "Un patient avec un seul rendez-vous obtient NULL pour le suivant",
      setupSql: `DELETE FROM appointments WHERE patient_id != 303;`,
      expectedColumns: ["patient_name", "appointment_date", "appointment_type", "next_appointment_date", "next_appointment_type"],
      expectedRows: [
        { patient_name: "Sophie Martin", appointment_date: "2024-04-05", appointment_type: "Annual exam", next_appointment_date: null, next_appointment_type: null },
      ],
      orderMatters: true,
    },
  ],
};
