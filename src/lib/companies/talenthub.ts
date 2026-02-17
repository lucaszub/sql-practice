import type { CompanyProfile } from "./types";

const schema = `
CREATE TABLE departments (
  department_id INTEGER PRIMARY KEY,
  department_name VARCHAR NOT NULL,
  budget DECIMAL(12,2) NOT NULL,
  head_count_target INTEGER NOT NULL
);

CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(department_id),
  job_title VARCHAR NOT NULL,
  hire_date DATE NOT NULL,
  termination_date DATE,
  manager_id INTEGER
);

CREATE TABLE salaries (
  salary_id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(employee_id),
  amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE
);

CREATE TABLE performance_reviews (
  review_id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(employee_id),
  review_year INTEGER NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  reviewer_comment VARCHAR
);

CREATE TABLE candidates (
  candidate_id INTEGER PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  applied_position VARCHAR NOT NULL,
  source VARCHAR NOT NULL,
  application_date DATE NOT NULL,
  status VARCHAR NOT NULL,
  hired_date DATE
);

CREATE TABLE job_postings (
  posting_id INTEGER PRIMARY KEY,
  job_title VARCHAR NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(department_id),
  publish_date DATE NOT NULL,
  close_date DATE,
  status VARCHAR NOT NULL,
  positions_open INTEGER NOT NULL
);

-- Departments (6 rows)
INSERT INTO departments VALUES
  (1, 'Engineering', 2500000.00, 12),
  (2, 'Product', 800000.00, 5),
  (3, 'Sales', 1200000.00, 8),
  (4, 'Marketing', 600000.00, 4),
  (5, 'Human Resources', 400000.00, 3),
  (6, 'Finance', 500000.00, 3);

-- Employees (30 rows)
INSERT INTO employees VALUES
  (1, 'Sophie', 'Marchand', 'sophie.marchand@talenthub.com', 1, 'VP Engineering', '2021-03-15', NULL, NULL),
  (2, 'Antoine', 'Bernard', 'antoine.bernard@talenthub.com', 1, 'Senior Developer', '2021-06-01', NULL, 1),
  (3, 'Julie', 'Petit', 'julie.petit@talenthub.com', 1, 'Senior Developer', '2021-09-10', NULL, 1),
  (4, 'Thomas', 'Roux', 'thomas.roux@talenthub.com', 1, 'Developer', '2022-01-15', NULL, 2),
  (5, 'Camille', 'Duval', 'camille.duval@talenthub.com', 1, 'Developer', '2022-04-01', '2024-06-30', 2),
  (6, 'Nicolas', 'Fournier', 'nicolas.fournier@talenthub.com', 1, 'Developer', '2022-07-18', NULL, 3),
  (7, 'Léa', 'Moreau', 'lea.moreau@talenthub.com', 1, 'Junior Developer', '2023-01-09', NULL, 3),
  (8, 'Maxime', 'Lambert', 'maxime.lambert@talenthub.com', 1, 'Junior Developer', '2023-06-01', '2024-03-15', 2),
  (9, 'Emma', 'Girard', 'emma.girard@talenthub.com', 1, 'DevOps Engineer', '2022-10-03', NULL, 1),
  (10, 'Lucas', 'Bonnet', 'lucas.bonnet@talenthub.com', 1, 'QA Engineer', '2023-03-20', NULL, 1),
  (11, 'Claire', 'Dupuis', 'claire.dupuis@talenthub.com', 2, 'Head of Product', '2021-04-01', NULL, NULL),
  (12, 'Romain', 'Leroy', 'romain.leroy@talenthub.com', 2, 'Product Manager', '2021-11-15', NULL, 11),
  (13, 'Marie', 'Simon', 'marie.simon@talenthub.com', 2, 'Product Designer', '2022-05-02', NULL, 11),
  (14, 'Hugo', 'Martin', 'hugo.martin@talenthub.com', 2, 'Product Analyst', '2023-02-13', '2024-08-31', 12),
  (15, 'Inès', 'Lefèvre', 'ines.lefevre@talenthub.com', 3, 'Sales Director', '2021-05-10', NULL, NULL),
  (16, 'Paul', 'Rousseau', 'paul.rousseau@talenthub.com', 3, 'Account Executive', '2021-10-18', NULL, 15),
  (17, 'Chloé', 'Vincent', 'chloe.vincent@talenthub.com', 3, 'Account Executive', '2022-02-28', NULL, 15),
  (18, 'Alexandre', 'Muller', 'alexandre.muller@talenthub.com', 3, 'Account Executive', '2022-08-15', '2024-01-31', 15),
  (19, 'Sarah', 'Perrin', 'sarah.perrin@talenthub.com', 3, 'SDR', '2023-04-03', NULL, 16),
  (20, 'Mathieu', 'Clement', 'mathieu.clement@talenthub.com', 3, 'SDR', '2023-07-17', '2024-05-15', 16),
  (21, 'Laura', 'Gauthier', 'laura.gauthier@talenthub.com', 4, 'Marketing Director', '2021-07-05', NULL, NULL),
  (22, 'Julien', 'Chevalier', 'julien.chevalier@talenthub.com', 4, 'Content Manager', '2022-03-14', NULL, 21),
  (23, 'Agathe', 'Renard', 'agathe.renard@talenthub.com', 4, 'Growth Marketer', '2022-11-07', NULL, 21),
  (24, 'Marie', 'Blanchard', 'marie.blanchard@talenthub.com', 5, 'DRH', '2021-03-01', NULL, NULL),
  (25, 'Diane', 'Faure', 'diane.faure@talenthub.com', 5, 'HR Business Partner', '2022-06-20', NULL, 24),
  (26, 'Gabriel', 'Andre', 'gabriel.andre@talenthub.com', 5, 'Recruiter', '2023-01-16', NULL, 24),
  (27, 'Pierre', 'Garnier', 'pierre.garnier@talenthub.com', 6, 'CFO', '2021-04-12', NULL, NULL),
  (28, 'Nathalie', 'Robin', 'nathalie.robin@talenthub.com', 6, 'Accountant', '2022-01-03', NULL, 27),
  (29, 'Olivier', 'Mercier', 'olivier.mercier@talenthub.com', 6, 'Financial Analyst', '2022-09-12', NULL, 27),
  (30, 'Élodie', 'Dupont', 'elodie.dupont@talenthub.com', 1, 'Developer', '2023-09-04', NULL, 3);

-- Salaries (35 rows — one current per active employee, plus historical records for raises)
INSERT INTO salaries VALUES
  (1, 1, 95000.00, '2021-03-15', '2023-03-14'),
  (2, 1, 105000.00, '2023-03-15', NULL),
  (3, 2, 65000.00, '2021-06-01', '2023-05-31'),
  (4, 2, 72000.00, '2023-06-01', NULL),
  (5, 3, 64000.00, '2021-09-10', '2023-09-09'),
  (6, 3, 71000.00, '2023-09-10', NULL),
  (7, 4, 48000.00, '2022-01-15', NULL),
  (8, 5, 47000.00, '2022-04-01', '2024-06-30'),
  (9, 6, 50000.00, '2022-07-18', NULL),
  (10, 7, 38000.00, '2023-01-09', NULL),
  (11, 8, 36000.00, '2023-06-01', '2024-03-15'),
  (12, 9, 58000.00, '2022-10-03', NULL),
  (13, 10, 45000.00, '2023-03-20', NULL),
  (14, 11, 88000.00, '2021-04-01', '2023-03-31'),
  (15, 11, 95000.00, '2023-04-01', NULL),
  (16, 12, 60000.00, '2021-11-15', NULL),
  (17, 13, 52000.00, '2022-05-02', NULL),
  (18, 14, 42000.00, '2023-02-13', '2024-08-31'),
  (19, 15, 80000.00, '2021-05-10', '2023-05-09'),
  (20, 15, 90000.00, '2023-05-10', NULL),
  (21, 16, 55000.00, '2021-10-18', NULL),
  (22, 17, 54000.00, '2022-02-28', NULL),
  (23, 18, 53000.00, '2022-08-15', '2024-01-31'),
  (24, 19, 38000.00, '2023-04-03', NULL),
  (25, 20, 37000.00, '2023-07-17', '2024-05-15'),
  (26, 21, 75000.00, '2021-07-05', NULL),
  (27, 22, 48000.00, '2022-03-14', NULL),
  (28, 23, 46000.00, '2022-11-07', NULL),
  (29, 24, 82000.00, '2021-03-01', NULL),
  (30, 25, 50000.00, '2022-06-20', NULL),
  (31, 26, 42000.00, '2023-01-16', NULL),
  (32, 27, 92000.00, '2021-04-12', NULL),
  (33, 28, 44000.00, '2022-01-03', NULL),
  (34, 29, 52000.00, '2022-09-12', NULL),
  (35, 30, 46000.00, '2023-09-04', NULL);

-- Performance reviews (25 rows)
INSERT INTO performance_reviews VALUES
  (1, 1, 2023, 5, 'Exceptional leadership and technical vision'),
  (2, 2, 2023, 4, 'Strong contributor, mentors junior devs well'),
  (3, 3, 2023, 4, 'Reliable and delivers quality code'),
  (4, 4, 2023, 3, 'Meeting expectations, room for growth'),
  (5, 5, 2023, 2, 'Struggling with deadlines, needs support'),
  (6, 6, 2023, 4, 'Great progress since joining'),
  (7, 7, 2023, 3, 'Good first year, learning fast'),
  (8, 9, 2023, 5, 'Built entire CI/CD pipeline, outstanding'),
  (9, 10, 2023, 3, 'Solid QA work, could improve automation'),
  (10, 11, 2023, 5, 'Excellent product strategy and execution'),
  (11, 12, 2023, 4, 'Strong product sense, good stakeholder management'),
  (12, 13, 2023, 4, 'Creative designs, user-centric approach'),
  (13, 14, 2023, 2, 'Below expectations on deliverables'),
  (14, 15, 2023, 5, 'Exceeded sales targets by 20%'),
  (15, 16, 2023, 4, 'Consistent performer, great client relationships'),
  (16, 17, 2023, 3, 'Meeting quota, could improve prospecting'),
  (17, 18, 2023, 2, 'Missed targets consistently'),
  (18, 19, 2023, 4, 'Excellent outbound, high conversion rate'),
  (19, 21, 2023, 4, 'Strong brand building initiatives'),
  (20, 22, 2023, 3, 'Good content output, SEO improving'),
  (21, 24, 2023, 5, 'Transformed HR processes, data-driven leader'),
  (22, 25, 2023, 4, 'Great employee engagement programs'),
  (23, 27, 2023, 4, 'Solid financial planning and forecasting'),
  (24, 28, 2023, 3, NULL),
  (25, 30, 2023, 4, 'Fast learner, already contributing to key projects');

-- Candidates (20 rows)
INSERT INTO candidates VALUES
  (1, 'Victor', 'Lemoine', 'Developer', 'LinkedIn', '2024-01-10', 'hired', '2024-03-01'),
  (2, 'Manon', 'Guerin', 'Developer', 'Indeed', '2024-01-15', 'rejected', NULL),
  (3, 'Bastien', 'Picard', 'Senior Developer', 'Referral', '2024-01-20', 'hired', '2024-03-15'),
  (4, 'Amandine', 'Roy', 'Product Manager', 'LinkedIn', '2024-02-01', 'rejected', NULL),
  (5, 'Thibault', 'Masson', 'SDR', 'Indeed', '2024-02-10', 'hired', '2024-04-01'),
  (6, 'Pauline', 'Fontaine', 'Account Executive', 'LinkedIn', '2024-02-15', 'withdrawn', NULL),
  (7, 'Adrien', 'Morel', 'Developer', 'Referral', '2024-02-20', 'rejected', NULL),
  (8, 'Lucie', 'Berger', 'Growth Marketer', 'LinkedIn', '2024-03-01', 'hired', '2024-05-15'),
  (9, 'Florian', 'Schmitt', 'Developer', 'Career Site', '2024-03-05', 'rejected', NULL),
  (10, 'Clara', 'Noel', 'QA Engineer', 'Indeed', '2024-03-10', 'in_process', NULL),
  (11, 'Dylan', 'Legrand', 'Financial Analyst', 'Referral', '2024-03-15', 'hired', '2024-05-01'),
  (12, 'Eva', 'Moulin', 'Developer', 'LinkedIn', '2024-03-20', 'rejected', NULL),
  (13, 'Théo', 'Brunet', 'Product Designer', 'Career Site', '2024-04-01', 'in_process', NULL),
  (14, 'Margot', 'Dumas', 'Account Executive', 'Indeed', '2024-04-05', 'rejected', NULL),
  (15, 'Raphaël', 'Caron', 'DevOps Engineer', 'Referral', '2024-04-10', 'hired', '2024-06-01'),
  (16, 'Anaïs', 'Maillard', 'SDR', 'LinkedIn', '2024-04-15', 'withdrawn', NULL),
  (17, 'Louis', 'Brun', 'Developer', 'Career Site', '2024-04-20', 'in_process', NULL),
  (18, 'Zoé', 'Collet', 'HR Business Partner', 'LinkedIn', '2024-05-01', 'rejected', NULL),
  (19, 'Alexis', 'Perez', 'Developer', 'Indeed', '2024-05-05', 'rejected', NULL),
  (20, 'Camille', 'Leclercq', 'Content Manager', 'Referral', '2024-05-10', 'in_process', NULL);

-- Job postings (10 rows)
INSERT INTO job_postings VALUES
  (1, 'Developer', 1, '2024-01-05', '2024-03-10', 'closed', 2),
  (2, 'Senior Developer', 1, '2024-01-10', '2024-03-20', 'closed', 1),
  (3, 'Product Manager', 2, '2024-01-20', '2024-04-15', 'closed', 1),
  (4, 'SDR', 3, '2024-02-01', '2024-04-10', 'closed', 1),
  (5, 'Account Executive', 3, '2024-02-10', '2024-05-01', 'closed', 1),
  (6, 'Growth Marketer', 4, '2024-02-15', '2024-05-20', 'closed', 1),
  (7, 'QA Engineer', 1, '2024-03-01', NULL, 'open', 1),
  (8, 'Financial Analyst', 6, '2024-03-05', '2024-05-10', 'closed', 1),
  (9, 'DevOps Engineer', 1, '2024-04-01', '2024-06-15', 'closed', 1),
  (10, 'Content Manager', 4, '2024-04-20', NULL, 'open', 1);
`;

export const talentHub: CompanyProfile = {
  id: "talenthub",
  name: "TalentHub",
  tagline: "We don't recruit resumes, we recruit humans",
  taglineFr: "On ne recrute pas des CV, on recrute des humains",
  sector: "HR / Recruitment",
  sectorFr: "RH / Recrutement",
  icon: "👥",
  description:
    "You just joined the data team at TalentHub, a 300-person scale-up that builds a recruitment platform. The HR Director (Marie) wants data to steer HR policy: turnover, salaries, diversity, and performance. Paul (Talent Acquisition) needs recruitment pipeline metrics, and Céline (Head of Engineering) wants insight into her team's performance.",
  descriptionFr:
    "Tu viens de rejoindre l'équipe data de TalentHub, une scale-up de 300 personnes qui édite une plateforme de recrutement. La DRH (Marie) veut des données pour piloter la politique RH : turnover, salaires, diversité, performance. Paul (Talent Acquisition) a besoin de métriques sur le pipeline de recrutement, et Céline (Head of Engineering) veut de la visibilité sur la performance de son équipe.",
  schema,
  tables: [
    {
      name: "departments",
      description: "Company departments with budget and headcount targets",
      descriptionFr: "Départements de l'entreprise avec budget et objectifs d'effectifs",
      rowCount: 6,
      columns: [
        { name: "department_id", type: "INTEGER", nullable: false, description: "Unique department ID", descriptionFr: "ID unique du département" },
        { name: "department_name", type: "VARCHAR", nullable: false, description: "Department name", descriptionFr: "Nom du département" },
        { name: "budget", type: "DECIMAL(12,2)", nullable: false, description: "Annual budget in EUR", descriptionFr: "Budget annuel en EUR" },
        { name: "head_count_target", type: "INTEGER", nullable: false, description: "Target number of employees", descriptionFr: "Objectif d'effectifs" },
      ],
    },
    {
      name: "employees",
      description: "Employees with department, job title, hire date, and manager",
      descriptionFr: "Employés avec département, poste, date d'embauche et manager",
      rowCount: 30,
      columns: [
        { name: "employee_id", type: "INTEGER", nullable: false, description: "Unique employee ID", descriptionFr: "ID unique de l'employé" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "email", type: "VARCHAR", nullable: false, description: "Email address", descriptionFr: "Adresse email" },
        { name: "department_id", type: "INTEGER", nullable: false, description: "FK to departments", descriptionFr: "FK vers departments" },
        { name: "job_title", type: "VARCHAR", nullable: false, description: "Job title", descriptionFr: "Intitulé du poste" },
        { name: "hire_date", type: "DATE", nullable: false, description: "Hire date", descriptionFr: "Date d'embauche" },
        { name: "termination_date", type: "DATE", nullable: true, description: "Termination date (NULL if still active)", descriptionFr: "Date de départ (NULL si toujours actif)" },
        { name: "manager_id", type: "INTEGER", nullable: true, description: "FK to employees (self-join, NULL for top-level)", descriptionFr: "FK vers employees (auto-jointure, NULL pour les dirigeants)" },
      ],
    },
    {
      name: "salaries",
      description: "Salary history per employee with start/end dates",
      descriptionFr: "Historique des salaires par employé avec dates de début/fin",
      rowCount: 35,
      columns: [
        { name: "salary_id", type: "INTEGER", nullable: false, description: "Unique salary record ID", descriptionFr: "ID unique de l'enregistrement salarial" },
        { name: "employee_id", type: "INTEGER", nullable: false, description: "FK to employees", descriptionFr: "FK vers employees" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, description: "Annual salary in EUR", descriptionFr: "Salaire annuel en EUR" },
        { name: "start_date", type: "DATE", nullable: false, description: "Start date of this salary", descriptionFr: "Date de début de ce salaire" },
        { name: "end_date", type: "DATE", nullable: true, description: "End date (NULL if current salary)", descriptionFr: "Date de fin (NULL si salaire actuel)" },
      ],
    },
    {
      name: "performance_reviews",
      description: "Annual performance reviews with 1-5 ratings",
      descriptionFr: "Évaluations annuelles de performance avec notes de 1 à 5",
      rowCount: 25,
      columns: [
        { name: "review_id", type: "INTEGER", nullable: false, description: "Unique review ID", descriptionFr: "ID unique de l'évaluation" },
        { name: "employee_id", type: "INTEGER", nullable: false, description: "FK to employees", descriptionFr: "FK vers employees" },
        { name: "review_year", type: "INTEGER", nullable: false, description: "Year of review", descriptionFr: "Année de l'évaluation" },
        { name: "rating", type: "INTEGER", nullable: true, description: "Rating 1-5 (can be NULL)", descriptionFr: "Note 1-5 (peut être NULL)" },
        { name: "reviewer_comment", type: "VARCHAR", nullable: true, description: "Manager comment (can be NULL)", descriptionFr: "Commentaire du manager (peut être NULL)" },
      ],
    },
    {
      name: "candidates",
      description: "Job applicants with source, status, and hire date",
      descriptionFr: "Candidats avec source, statut et date d'embauche",
      rowCount: 20,
      columns: [
        { name: "candidate_id", type: "INTEGER", nullable: false, description: "Unique candidate ID", descriptionFr: "ID unique du candidat" },
        { name: "first_name", type: "VARCHAR", nullable: false, description: "First name", descriptionFr: "Prénom" },
        { name: "last_name", type: "VARCHAR", nullable: false, description: "Last name", descriptionFr: "Nom de famille" },
        { name: "applied_position", type: "VARCHAR", nullable: false, description: "Position applied for", descriptionFr: "Poste visé" },
        { name: "source", type: "VARCHAR", nullable: false, description: "Recruitment source (LinkedIn, Indeed, Referral, Career Site)", descriptionFr: "Source de recrutement (LinkedIn, Indeed, Referral, Career Site)" },
        { name: "application_date", type: "DATE", nullable: false, description: "Application date", descriptionFr: "Date de candidature" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (hired, rejected, in_process, withdrawn)", descriptionFr: "Statut (hired, rejected, in_process, withdrawn)" },
        { name: "hired_date", type: "DATE", nullable: true, description: "Hire date (NULL if not hired)", descriptionFr: "Date d'embauche (NULL si non embauché)" },
      ],
    },
    {
      name: "job_postings",
      description: "Open and closed job postings by department",
      descriptionFr: "Offres d'emploi ouvertes et fermées par département",
      rowCount: 10,
      columns: [
        { name: "posting_id", type: "INTEGER", nullable: false, description: "Unique posting ID", descriptionFr: "ID unique de l'offre" },
        { name: "job_title", type: "VARCHAR", nullable: false, description: "Job title", descriptionFr: "Intitulé du poste" },
        { name: "department_id", type: "INTEGER", nullable: false, description: "FK to departments", descriptionFr: "FK vers departments" },
        { name: "publish_date", type: "DATE", nullable: false, description: "Publication date", descriptionFr: "Date de publication" },
        { name: "close_date", type: "DATE", nullable: true, description: "Closing date (NULL if still open)", descriptionFr: "Date de clôture (NULL si encore ouverte)" },
        { name: "status", type: "VARCHAR", nullable: false, description: "Status (open, closed)", descriptionFr: "Statut (open, closed)" },
        { name: "positions_open", type: "INTEGER", nullable: false, description: "Number of positions to fill", descriptionFr: "Nombre de postes à pourvoir" },
      ],
    },
  ],
  questions: [
    {
      id: "th-01",
      title: "Department headcount vs target",
      titleFr: "Effectifs réels vs objectifs par département",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "easy",
      description:
        "Marie (DRH) wants to compare the actual headcount of active employees to the target for each department. Show the department name, target headcount, current headcount, and the gap (target minus actual). Sort by largest gap first.",
      descriptionFr:
        "Marie (DRH) veut comparer les effectifs réels (employés actifs) aux objectifs pour chaque département. Affiche le nom du département, l'objectif d'effectifs, les effectifs actuels et l'écart (objectif moins réel). Trie par écart décroissant.",
      hint: "LEFT JOIN departments with employees, filtering on termination_date IS NULL for active employees. GROUP BY department.",
      hintFr: "LEFT JOIN departments avec employees, en filtrant sur termination_date IS NULL pour les employés actifs. GROUP BY department.",
      solutionQuery: `SELECT d.department_name,
  d.head_count_target,
  COUNT(e.employee_id) AS current_headcount,
  d.head_count_target - COUNT(e.employee_id) AS gap
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
  AND e.termination_date IS NULL
GROUP BY d.department_id, d.department_name, d.head_count_target
ORDER BY gap DESC;`,
      expectedColumns: ["department_name", "head_count_target", "current_headcount", "gap"],
      expectedRows: [
        { department_name: "Sales", head_count_target: 8, current_headcount: 4, gap: 4 },
        { department_name: "Engineering", head_count_target: 12, current_headcount: 9, gap: 3 },
        { department_name: "Product", head_count_target: 5, current_headcount: 3, gap: 2 },
        { department_name: "Marketing", head_count_target: 4, current_headcount: 3, gap: 1 },
        { department_name: "Finance", head_count_target: 3, current_headcount: 3, gap: 0 },
        { department_name: "Human Resources", head_count_target: 3, current_headcount: 3, gap: 0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-02",
      title: "Turnover rate by department in 2024",
      titleFr: "Taux de turnover par département en 2024",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "medium",
      description:
        "Marie (DRH) needs the turnover rate per department for 2024. Consider employees who were active at any point during 2024 (hired before 2025 and either still active or terminated in 2024 or later). Turnover = departures in 2024 / total employees active during 2024. Show department name, total employees, departures, and turnover rate as a percentage rounded to 1 decimal. Sort by turnover rate descending.",
      descriptionFr:
        "Marie (DRH) a besoin du taux de turnover par département pour 2024. Considère les employés actifs à un moment quelconque en 2024 (embauchés avant 2025 et soit toujours actifs, soit partis en 2024 ou après). Turnover = départs en 2024 / total actifs en 2024. Affiche le département, le total d'employés, les départs et le taux de turnover en pourcentage arrondi à 1 décimale. Trie par taux décroissant.",
      hint: "Filter employees active during 2024: hire_date < '2025-01-01' AND (termination_date IS NULL OR termination_date >= '2024-01-01'). Count departures with CASE WHEN termination_date BETWEEN '2024-01-01' AND '2024-12-31'.",
      hintFr: "Filtre les employés actifs en 2024 : hire_date < '2025-01-01' AND (termination_date IS NULL OR termination_date >= '2024-01-01'). Compte les départs avec CASE WHEN termination_date BETWEEN '2024-01-01' AND '2024-12-31'.",
      solutionQuery: `SELECT d.department_name,
  COUNT(e.employee_id) AS total_employees,
  COUNT(CASE WHEN e.termination_date BETWEEN '2024-01-01' AND '2024-12-31' THEN 1 END) AS departures,
  ROUND(100.0 * COUNT(CASE WHEN e.termination_date BETWEEN '2024-01-01' AND '2024-12-31' THEN 1 END) / COUNT(e.employee_id), 1) AS turnover_rate
FROM departments d
JOIN employees e ON d.department_id = e.department_id
WHERE e.hire_date < '2025-01-01'
  AND (e.termination_date IS NULL OR e.termination_date >= '2024-01-01')
GROUP BY d.department_id, d.department_name
ORDER BY turnover_rate DESC;`,
      expectedColumns: ["department_name", "total_employees", "departures", "turnover_rate"],
      expectedRows: [
        { department_name: "Sales", total_employees: 6, departures: 2, turnover_rate: 33.3 },
        { department_name: "Product", total_employees: 4, departures: 1, turnover_rate: 25.0 },
        { department_name: "Engineering", total_employees: 11, departures: 2, turnover_rate: 18.2 },
        { department_name: "Human Resources", total_employees: 3, departures: 0, turnover_rate: 0.0 },
        { department_name: "Marketing", total_employees: 3, departures: 0, turnover_rate: 0.0 },
        { department_name: "Finance", total_employees: 3, departures: 0, turnover_rate: 0.0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-03",
      title: "Top performers in 2023",
      titleFr: "Meilleurs performeurs en 2023",
      stakeholder: "Céline",
      stakeholderRole: "Head of Engineering",
      difficulty: "easy",
      description:
        "Céline (Head of Engineering) wants to see all employees who scored 4 or above in their 2023 performance review. Show their first name, last name, department, and rating. Sort by rating descending, then by last name ascending.",
      descriptionFr:
        "Céline (Head of Engineering) veut voir tous les employés ayant obtenu une note de 4 ou plus lors de leur évaluation 2023. Affiche prénom, nom, département et note. Trie par note décroissante, puis par nom croissant.",
      hint: "JOIN performance_reviews with employees and departments. Filter on review_year = 2023 AND rating >= 4.",
      hintFr: "JOIN performance_reviews avec employees et departments. Filtre sur review_year = 2023 AND rating >= 4.",
      solutionQuery: `SELECT e.first_name, e.last_name, d.department_name, pr.rating
FROM performance_reviews pr
JOIN employees e ON pr.employee_id = e.employee_id
JOIN departments d ON e.department_id = d.department_id
WHERE pr.review_year = 2023 AND pr.rating >= 4
ORDER BY pr.rating DESC, e.last_name ASC;`,
      expectedColumns: ["first_name", "last_name", "department_name", "rating"],
      expectedRows: [
        { first_name: "Marie", last_name: "Blanchard", department_name: "Human Resources", rating: 5 },
        { first_name: "Claire", last_name: "Dupuis", department_name: "Product", rating: 5 },
        { first_name: "Emma", last_name: "Girard", department_name: "Engineering", rating: 5 },
        { first_name: "Inès", last_name: "Lefèvre", department_name: "Sales", rating: 5 },
        { first_name: "Sophie", last_name: "Marchand", department_name: "Engineering", rating: 5 },
        { first_name: "Antoine", last_name: "Bernard", department_name: "Engineering", rating: 4 },
        { first_name: "Élodie", last_name: "Dupont", department_name: "Engineering", rating: 4 },
        { first_name: "Diane", last_name: "Faure", department_name: "Human Resources", rating: 4 },
        { first_name: "Nicolas", last_name: "Fournier", department_name: "Engineering", rating: 4 },
        { first_name: "Pierre", last_name: "Garnier", department_name: "Finance", rating: 4 },
        { first_name: "Laura", last_name: "Gauthier", department_name: "Marketing", rating: 4 },
        { first_name: "Romain", last_name: "Leroy", department_name: "Product", rating: 4 },
        { first_name: "Sarah", last_name: "Perrin", department_name: "Sales", rating: 4 },
        { first_name: "Julie", last_name: "Petit", department_name: "Engineering", rating: 4 },
        { first_name: "Paul", last_name: "Rousseau", department_name: "Sales", rating: 4 },
        { first_name: "Marie", last_name: "Simon", department_name: "Product", rating: 4 },
      ],
      orderMatters: true,
    },
    {
      id: "th-04",
      title: "Salary progression for promoted employees",
      titleFr: "Progression salariale des employés augmentés",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "medium",
      description:
        "Marie (DRH) wants to identify employees who received a salary increase. Show their first name, last name, previous salary, current salary, and the percentage increase rounded to 1 decimal. A salary increase is detected when a new salary record starts the day after the previous one ends. Sort by percentage increase descending.",
      descriptionFr:
        "Marie (DRH) veut identifier les employés ayant bénéficié d'une augmentation. Affiche prénom, nom, ancien salaire, nouveau salaire et le pourcentage d'augmentation arrondi à 1 décimale. Une augmentation est détectée quand un nouveau salaire commence le lendemain de la fin du précédent. Trie par pourcentage décroissant.",
      hint: "Self-join salaries: join the new salary record with the old one where s_old.end_date = s_new.start_date - INTERVAL '1 day'. Filter where new amount > old amount.",
      hintFr: "Auto-jointure sur salaries : joindre le nouveau salaire avec l'ancien où s_old.end_date = s_new.start_date - INTERVAL '1 day'. Filtrer où le nouveau montant > ancien montant.",
      solutionQuery: `SELECT e.first_name, e.last_name,
  s_old.amount AS previous_salary,
  s_new.amount AS current_salary,
  ROUND(100.0 * (s_new.amount - s_old.amount) / s_old.amount, 1) AS increase_pct
FROM salaries s_new
JOIN salaries s_old ON s_new.employee_id = s_old.employee_id
  AND s_old.end_date = s_new.start_date - INTERVAL '1 day'
JOIN employees e ON s_new.employee_id = e.employee_id
WHERE s_new.amount > s_old.amount
ORDER BY increase_pct DESC;`,
      expectedColumns: ["first_name", "last_name", "previous_salary", "current_salary", "increase_pct"],
      expectedRows: [
        { first_name: "Inès", last_name: "Lefèvre", previous_salary: 80000.00, current_salary: 90000.00, increase_pct: 12.5 },
        { first_name: "Julie", last_name: "Petit", previous_salary: 64000.00, current_salary: 71000.00, increase_pct: 10.9 },
        { first_name: "Antoine", last_name: "Bernard", previous_salary: 65000.00, current_salary: 72000.00, increase_pct: 10.8 },
        { first_name: "Sophie", last_name: "Marchand", previous_salary: 95000.00, current_salary: 105000.00, increase_pct: 10.5 },
        { first_name: "Claire", last_name: "Dupuis", previous_salary: 88000.00, current_salary: 95000.00, increase_pct: 8.0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-05",
      title: "Time-to-hire by recruitment source",
      titleFr: "Délai de recrutement par source",
      stakeholder: "Paul",
      stakeholderRole: "Talent Acquisition",
      difficulty: "medium",
      description:
        "Paul (Talent Acquisition) wants to know the average time-to-hire in days for each recruitment source. Only consider candidates who were actually hired. Show the source, number of hires, and average days to hire rounded to 1 decimal. Sort by fastest source first.",
      descriptionFr:
        "Paul (Talent Acquisition) veut connaître le délai moyen de recrutement en jours pour chaque source. Ne considère que les candidats effectivement embauchés. Affiche la source, le nombre d'embauches et la moyenne de jours arrondie à 1 décimale. Trie par source la plus rapide en premier.",
      hint: "Filter candidates WHERE status = 'hired'. Compute hired_date - application_date for days. GROUP BY source, use AVG.",
      hintFr: "Filtre les candidats WHERE status = 'hired'. Calcule hired_date - application_date pour les jours. GROUP BY source, utilise AVG.",
      solutionQuery: `SELECT source,
  COUNT(*) AS hires,
  ROUND(AVG(hired_date - application_date), 1) AS avg_days_to_hire
FROM candidates
WHERE status = 'hired'
GROUP BY source
ORDER BY avg_days_to_hire ASC;`,
      expectedColumns: ["source", "hires", "avg_days_to_hire"],
      expectedRows: [
        { source: "Indeed", hires: 1, avg_days_to_hire: 51.0 },
        { source: "Referral", hires: 3, avg_days_to_hire: 51.3 },
        { source: "LinkedIn", hires: 2, avg_days_to_hire: 63.0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-06",
      title: "Candidate pipeline summary",
      titleFr: "Synthèse du pipeline candidats",
      stakeholder: "Paul",
      stakeholderRole: "Talent Acquisition",
      difficulty: "easy",
      description:
        "Paul (Talent Acquisition) wants a quick overview of the candidate pipeline. Show each status, the number of candidates, and the percentage of total candidates rounded to 1 decimal. Sort by count descending.",
      descriptionFr:
        "Paul (Talent Acquisition) veut une vue d'ensemble rapide du pipeline candidats. Affiche chaque statut, le nombre de candidats et le pourcentage du total arrondi à 1 décimale. Trie par nombre décroissant.",
      hint: "GROUP BY status. Use a subquery or window function to compute the total for the percentage calculation.",
      hintFr: "GROUP BY status. Utilise une sous-requête ou une fonction fenêtre pour calculer le total nécessaire au pourcentage.",
      solutionQuery: `SELECT status,
  COUNT(*) AS candidate_count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM candidates), 1) AS percentage
FROM candidates
GROUP BY status
ORDER BY candidate_count DESC;`,
      expectedColumns: ["status", "candidate_count", "percentage"],
      expectedRows: [
        { status: "rejected", candidate_count: 8, percentage: 40.0 },
        { status: "hired", candidate_count: 6, percentage: 30.0 },
        { status: "in_process", candidate_count: 4, percentage: 20.0 },
        { status: "withdrawn", candidate_count: 2, percentage: 10.0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-07",
      title: "Org chart with manager names",
      titleFr: "Organigramme avec noms des managers",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "medium",
      description:
        "Marie (DRH) wants to see the organizational hierarchy for all active employees. Show the employee full name, job title, department, and their manager's full name (or 'No Manager' for top-level leaders). Sort by department then last name.",
      descriptionFr:
        "Marie (DRH) veut voir la hiérarchie organisationnelle de tous les employés actifs. Affiche le nom complet de l'employé, son poste, son département et le nom complet de son manager (ou 'No Manager' pour les dirigeants). Trie par département puis nom de famille.",
      hint: "Use a self-join: LEFT JOIN employees m ON e.manager_id = m.employee_id. Use COALESCE for the 'No Manager' case. Filter active employees only.",
      hintFr: "Utilise une auto-jointure : LEFT JOIN employees m ON e.manager_id = m.employee_id. Utilise COALESCE pour le cas 'No Manager'. Filtre uniquement les employés actifs.",
      solutionQuery: `SELECT e.first_name || ' ' || e.last_name AS employee_name,
  e.job_title,
  d.department_name,
  COALESCE(m.first_name || ' ' || m.last_name, 'No Manager') AS manager_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employees m ON e.manager_id = m.employee_id
WHERE e.termination_date IS NULL
ORDER BY d.department_name, e.last_name;`,
      expectedColumns: ["employee_name", "job_title", "department_name", "manager_name"],
      expectedRows: [
        { employee_name: "Antoine Bernard", job_title: "Senior Developer", department_name: "Engineering", manager_name: "Sophie Marchand" },
        { employee_name: "Lucas Bonnet", job_title: "QA Engineer", department_name: "Engineering", manager_name: "Sophie Marchand" },
        { employee_name: "Élodie Dupont", job_title: "Developer", department_name: "Engineering", manager_name: "Julie Petit" },
        { employee_name: "Nicolas Fournier", job_title: "Developer", department_name: "Engineering", manager_name: "Julie Petit" },
        { employee_name: "Emma Girard", job_title: "DevOps Engineer", department_name: "Engineering", manager_name: "Sophie Marchand" },
        { employee_name: "Sophie Marchand", job_title: "VP Engineering", department_name: "Engineering", manager_name: "No Manager" },
        { employee_name: "Léa Moreau", job_title: "Junior Developer", department_name: "Engineering", manager_name: "Julie Petit" },
        { employee_name: "Julie Petit", job_title: "Senior Developer", department_name: "Engineering", manager_name: "Sophie Marchand" },
        { employee_name: "Thomas Roux", job_title: "Developer", department_name: "Engineering", manager_name: "Antoine Bernard" },
        { employee_name: "Pierre Garnier", job_title: "CFO", department_name: "Finance", manager_name: "No Manager" },
        { employee_name: "Olivier Mercier", job_title: "Financial Analyst", department_name: "Finance", manager_name: "Pierre Garnier" },
        { employee_name: "Nathalie Robin", job_title: "Accountant", department_name: "Finance", manager_name: "Pierre Garnier" },
        { employee_name: "Gabriel Andre", job_title: "Recruiter", department_name: "Human Resources", manager_name: "Marie Blanchard" },
        { employee_name: "Marie Blanchard", job_title: "DRH", department_name: "Human Resources", manager_name: "No Manager" },
        { employee_name: "Diane Faure", job_title: "HR Business Partner", department_name: "Human Resources", manager_name: "Marie Blanchard" },
        { employee_name: "Julien Chevalier", job_title: "Content Manager", department_name: "Marketing", manager_name: "Laura Gauthier" },
        { employee_name: "Laura Gauthier", job_title: "Marketing Director", department_name: "Marketing", manager_name: "No Manager" },
        { employee_name: "Agathe Renard", job_title: "Growth Marketer", department_name: "Marketing", manager_name: "Laura Gauthier" },
        { employee_name: "Claire Dupuis", job_title: "Head of Product", department_name: "Product", manager_name: "No Manager" },
        { employee_name: "Romain Leroy", job_title: "Product Manager", department_name: "Product", manager_name: "Claire Dupuis" },
        { employee_name: "Marie Simon", job_title: "Product Designer", department_name: "Product", manager_name: "Claire Dupuis" },
        { employee_name: "Inès Lefèvre", job_title: "Sales Director", department_name: "Sales", manager_name: "No Manager" },
        { employee_name: "Sarah Perrin", job_title: "SDR", department_name: "Sales", manager_name: "Paul Rousseau" },
        { employee_name: "Paul Rousseau", job_title: "Account Executive", department_name: "Sales", manager_name: "Inès Lefèvre" },
        { employee_name: "Chloé Vincent", job_title: "Account Executive", department_name: "Sales", manager_name: "Inès Lefèvre" },
      ],
      orderMatters: true,
    },
    {
      id: "th-08",
      title: "Average salary by department and seniority",
      titleFr: "Salaire moyen par département et ancienneté",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "hard",
      description:
        "Marie (DRH) wants to analyze salary gaps between senior and junior employees across departments. Consider employees hired before 2023-01-01 as 'Senior' and those hired from 2023 onwards as 'Junior'. Only include active employees with a current salary (end_date IS NULL). Show department, seniority label, employee count, and average salary rounded to 2 decimals. Sort by department then seniority.",
      descriptionFr:
        "Marie (DRH) veut analyser les écarts salariaux entre seniors et juniors par département. Les employés embauchés avant le 01/01/2023 sont 'Senior', ceux embauchés à partir de 2023 sont 'Junior'. Ne considère que les actifs avec un salaire courant (end_date IS NULL). Affiche département, label ancienneté, nombre d'employés et salaire moyen arrondi à 2 décimales. Trie par département puis ancienneté.",
      hint: "Use CASE WHEN e.hire_date < '2023-01-01' THEN 'Senior' ELSE 'Junior' END. Join employees, departments, and salaries. Filter on active employees and current salary.",
      hintFr: "Utilise CASE WHEN e.hire_date < '2023-01-01' THEN 'Senior' ELSE 'Junior' END. Jointure employees, departments et salaries. Filtre sur employés actifs et salaire courant.",
      solutionQuery: `SELECT d.department_name,
  CASE WHEN e.hire_date < '2023-01-01' THEN 'Senior' ELSE 'Junior' END AS seniority,
  COUNT(*) AS employee_count,
  ROUND(AVG(s.amount), 2) AS avg_salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN salaries s ON e.employee_id = s.employee_id AND s.end_date IS NULL
WHERE e.termination_date IS NULL
GROUP BY d.department_name,
  CASE WHEN e.hire_date < '2023-01-01' THEN 'Senior' ELSE 'Junior' END
ORDER BY d.department_name, seniority;`,
      expectedColumns: ["department_name", "seniority", "employee_count", "avg_salary"],
      expectedRows: [
        { department_name: "Engineering", seniority: "Junior", employee_count: 3, avg_salary: 43000.00 },
        { department_name: "Engineering", seniority: "Senior", employee_count: 6, avg_salary: 67333.33 },
        { department_name: "Finance", seniority: "Senior", employee_count: 3, avg_salary: 62666.67 },
        { department_name: "Human Resources", seniority: "Junior", employee_count: 1, avg_salary: 42000.00 },
        { department_name: "Human Resources", seniority: "Senior", employee_count: 2, avg_salary: 66000.00 },
        { department_name: "Marketing", seniority: "Senior", employee_count: 3, avg_salary: 56333.33 },
        { department_name: "Product", seniority: "Senior", employee_count: 3, avg_salary: 69000.00 },
        { department_name: "Sales", seniority: "Junior", employee_count: 1, avg_salary: 38000.00 },
        { department_name: "Sales", seniority: "Senior", employee_count: 3, avg_salary: 66333.33 },
      ],
      orderMatters: true,
    },
    {
      id: "th-09",
      title: "Recruitment funnel by position",
      titleFr: "Entonnoir de recrutement par poste",
      stakeholder: "Paul",
      stakeholderRole: "Talent Acquisition",
      difficulty: "hard",
      description:
        "Paul (Talent Acquisition) wants a detailed recruitment funnel for each position. Show the applied position, total applicants, number hired, rejected, in process, withdrawn, and the hire rate (hired/total as %) rounded to 1 decimal. Sort by total applicants descending, then position name ascending.",
      descriptionFr:
        "Paul (Talent Acquisition) veut un entonnoir de recrutement détaillé par poste. Affiche le poste visé, le total de candidats, le nombre d'embauchés, de rejetés, en cours et de désistements, ainsi que le taux d'embauche (embauchés/total en %) arrondi à 1 décimale. Trie par total de candidats décroissant, puis nom du poste croissant.",
      hint: "Use COUNT(*) FILTER (WHERE status = '...') for each status. GROUP BY applied_position. DuckDB's FILTER clause is cleaner than CASE WHEN.",
      hintFr: "Utilise COUNT(*) FILTER (WHERE status = '...') pour chaque statut. GROUP BY applied_position. La clause FILTER de DuckDB est plus propre que CASE WHEN.",
      solutionQuery: `SELECT applied_position,
  COUNT(*) AS total_applicants,
  COUNT(*) FILTER (WHERE status = 'hired') AS hired,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
  COUNT(*) FILTER (WHERE status = 'in_process') AS in_process,
  COUNT(*) FILTER (WHERE status = 'withdrawn') AS withdrawn,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'hired') / COUNT(*), 1) AS hire_rate
FROM candidates
GROUP BY applied_position
ORDER BY total_applicants DESC, applied_position;`,
      expectedColumns: ["applied_position", "total_applicants", "hired", "rejected", "in_process", "withdrawn", "hire_rate"],
      expectedRows: [
        { applied_position: "Developer", total_applicants: 7, hired: 1, rejected: 5, in_process: 1, withdrawn: 0, hire_rate: 14.3 },
        { applied_position: "Account Executive", total_applicants: 2, hired: 0, rejected: 1, in_process: 0, withdrawn: 1, hire_rate: 0.0 },
        { applied_position: "SDR", total_applicants: 2, hired: 1, rejected: 0, in_process: 0, withdrawn: 1, hire_rate: 50.0 },
        { applied_position: "Content Manager", total_applicants: 1, hired: 0, rejected: 0, in_process: 1, withdrawn: 0, hire_rate: 0.0 },
        { applied_position: "DevOps Engineer", total_applicants: 1, hired: 1, rejected: 0, in_process: 0, withdrawn: 0, hire_rate: 100.0 },
        { applied_position: "Financial Analyst", total_applicants: 1, hired: 1, rejected: 0, in_process: 0, withdrawn: 0, hire_rate: 100.0 },
        { applied_position: "Growth Marketer", total_applicants: 1, hired: 1, rejected: 0, in_process: 0, withdrawn: 0, hire_rate: 100.0 },
        { applied_position: "HR Business Partner", total_applicants: 1, hired: 0, rejected: 1, in_process: 0, withdrawn: 0, hire_rate: 0.0 },
        { applied_position: "Product Designer", total_applicants: 1, hired: 0, rejected: 0, in_process: 1, withdrawn: 0, hire_rate: 0.0 },
        { applied_position: "Product Manager", total_applicants: 1, hired: 0, rejected: 1, in_process: 0, withdrawn: 0, hire_rate: 0.0 },
        { applied_position: "QA Engineer", total_applicants: 1, hired: 0, rejected: 0, in_process: 1, withdrawn: 0, hire_rate: 0.0 },
        { applied_position: "Senior Developer", total_applicants: 1, hired: 1, rejected: 0, in_process: 0, withdrawn: 0, hire_rate: 100.0 },
      ],
      orderMatters: true,
    },
    {
      id: "th-10",
      title: "Department salary budget utilization",
      titleFr: "Utilisation du budget salarial par département",
      stakeholder: "Marie",
      stakeholderRole: "DRH",
      difficulty: "hard",
      description:
        "Marie (DRH) wants to see how much of each department's annual budget is consumed by current salaries of active employees. Show department name, budget, total current salaries, utilization percentage rounded to 1 decimal, and remaining budget. Sort by utilization descending.",
      descriptionFr:
        "Marie (DRH) veut voir quelle part du budget annuel de chaque département est consommée par les salaires actuels des employés actifs. Affiche le département, le budget, le total des salaires courants, le pourcentage d'utilisation arrondi à 1 décimale et le budget restant. Trie par utilisation décroissante.",
      hint: "LEFT JOIN departments with employees (active only) and salaries (current only, end_date IS NULL). Use COALESCE for departments that might have no employees. GROUP BY department.",
      hintFr: "LEFT JOIN departments avec employees (actifs uniquement) et salaries (courant uniquement, end_date IS NULL). Utilise COALESCE pour les départements sans employés. GROUP BY department.",
      solutionQuery: `SELECT d.department_name,
  d.budget,
  COALESCE(SUM(s.amount), 0) AS total_salaries,
  ROUND(100.0 * COALESCE(SUM(s.amount), 0) / d.budget, 1) AS utilization_pct,
  d.budget - COALESCE(SUM(s.amount), 0) AS remaining_budget
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id AND e.termination_date IS NULL
LEFT JOIN salaries s ON e.employee_id = s.employee_id AND s.end_date IS NULL
GROUP BY d.department_id, d.department_name, d.budget
ORDER BY utilization_pct DESC;`,
      expectedColumns: ["department_name", "budget", "total_salaries", "utilization_pct", "remaining_budget"],
      expectedRows: [
        { department_name: "Human Resources", budget: 400000.00, total_salaries: 174000.00, utilization_pct: 43.5, remaining_budget: 226000.00 },
        { department_name: "Finance", budget: 500000.00, total_salaries: 188000.00, utilization_pct: 37.6, remaining_budget: 312000.00 },
        { department_name: "Marketing", budget: 600000.00, total_salaries: 169000.00, utilization_pct: 28.2, remaining_budget: 431000.00 },
        { department_name: "Product", budget: 800000.00, total_salaries: 207000.00, utilization_pct: 25.9, remaining_budget: 593000.00 },
        { department_name: "Engineering", budget: 2500000.00, total_salaries: 533000.00, utilization_pct: 21.3, remaining_budget: 1967000.00 },
        { department_name: "Sales", budget: 1200000.00, total_salaries: 237000.00, utilization_pct: 19.8, remaining_budget: 963000.00 },
      ],
      orderMatters: true,
    },
  ],
};
