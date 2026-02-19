export type Locale = "en" | "fr";

export const translations = {
  // Navigation
  "nav.exercises": { en: "Exercises", fr: "Exercices" },
  "nav.daRoadmap": { en: "DA Roadmap", fr: "Parcours DA" },
  "nav.deRoadmap": { en: "DE Roadmap", fr: "Parcours DE" },
  "nav.company": { en: "Real-World Cases", fr: "Cas Concrets" },
  "nav.back": { en: "Back", fr: "Retour" },
  "nav.prev": { en: "Prev", fr: "Prec" },
  "nav.next": { en: "Next", fr: "Suiv" },
  "nav.backToExercises": { en: "Back to exercises", fr: "Retour aux exercices" },

  // Home page hero
  "home.title": {
    en: "Master data skills, one exercise at a time",
    fr: "Progressez en data, un exercice a la fois",
  },
  "home.subtitle": {
    en: "Real business questions. Instant feedback. SQL today, Pandas tomorrow.",
    fr: "Des questions business reelles. Feedback instantane. SQL aujourd'hui, Pandas demain.",
  },
  "home.poweredBy": {
    en: "Powered by DuckDB \u2014 runs entirely in your browser",
    fr: "Propulse par DuckDB \u2014 tourne entierement dans votre navigateur",
  },
  "home.exercisesSolved": { en: "exercises solved", fr: "exercices resolus" },
  "home.overallProgress": { en: "overall progress", fr: "progression globale" },
  "home.exercises": { en: "Exercises", fr: "Exercices" },
  "home.otherExercises": { en: "Other Exercises", fr: "Autres exercices" },
  "home.noMatch": {
    en: "No exercises match the selected filter.",
    fr: "Aucun exercice ne correspond au filtre selectionne.",
  },
  "home.comingSoon": { en: "Coming Soon", fr: "Bientot" },
  "home.companyCta": {
    en: "New: Solve SQL challenges based on real business scenarios",
    fr: "Nouveau : Resolvez des defis SQL bases sur des scenarios business reels",
  },

  // Companies page
  "companies.title": { en: "Pick a business, start querying", fr: "Choisis un cas, lance tes requetes" },
  "companies.subtitle": {
    en: "Each case drops you into a real company with its own data, stakeholders, and business questions.",
    fr: "Chaque cas te plonge dans une vraie entreprise avec ses propres donnees, interlocuteurs et questions business.",
  },
  "companies.comingSoon": { en: "Coming soon", fr: "Bientot disponible" },

  // Difficulty filter
  "difficulty.all": { en: "All Levels", fr: "Tous niveaux" },
  "difficulty.easy": { en: "Easy", fr: "Facile" },
  "difficulty.medium": { en: "Medium", fr: "Moyen" },
  "difficulty.hard": { en: "Hard", fr: "Difficile" },

  // Exercise page
  "exercise.notFound": { en: "Exercise not found", fr: "Exercice introuvable" },
  "exercise.loading": { en: "Loading SQL engine...", fr: "Chargement du moteur SQL..." },
  "exercise.results": { en: "Results", fr: "Resultats" },
  "exercise.tests": { en: "Tests", fr: "Tests" },
  "exercise.sqlEditor": { en: "SQL Editor", fr: "Editeur SQL" },
  "exercise.submit": { en: "Submit (Ctrl+Enter)", fr: "Soumettre (Ctrl+Enter)" },
  "exercise.running": { en: "Running...", fr: "Execution..." },
  "exercise.runQuery": { en: "Run a query to see results", fr: "Executez une requete pour voir les resultats" },
  "exercise.error": { en: "Error", fr: "Erreur" },
  "exercise.showHint": { en: "Show Hint", fr: "Afficher l'indice" },
  "exercise.revealSolution": { en: "Reveal Solution", fr: "Voir la solution" },
  "exercise.hideSolution": { en: "Hide Solution", fr: "Masquer la solution" },
  "exercise.solutionQuery": { en: "Solution Query", fr: "Requete solution" },
  "exercise.schema": { en: "Schema", fr: "Schema" },
  "exercise.expectedOutput": { en: "Expected output", fr: "Resultat attendu" },
  "exercise.rowsTotal": { en: "rows total", fr: "lignes au total" },
  "exercise.rows": { en: "rows", fr: "lignes" },

  // Test results
  "test.submitToSee": { en: "Submit your query to see test results", fr: "Soumettez votre requete pour voir les resultats" },
  "test.allPassed": { en: "All tests passed!", fr: "Tous les tests sont passes !" },
  "test.testsPassed": { en: "tests passed", fr: "tests passes" },
  "test.greatJob": {
    en: "Great job! Move on to the next exercise.",
    fr: "Bravo ! Passez a l'exercice suivant.",
  },
  "test.expectedColumns": { en: "Expected columns: ", fr: "Colonnes attendues : " },
  "test.gotColumns": { en: "Got columns: ", fr: "Colonnes obtenues : " },
  "test.expectedRow": { en: "Expected row:", fr: "Ligne attendue :" },
  "test.gotInstead": { en: "Got instead:", fr: "Obtenu a la place :" },

  // Validator messages
  "validator.incorrectColumns": { en: "Incorrect columns.", fr: "Colonnes incorrectes." },
  "validator.incorrectRowCount": {
    en: "Incorrect row count: expected {expected}, got {actual}.",
    fr: "Nombre de lignes incorrect : attendu {expected}, obtenu {actual}.",
  },
  "validator.incorrectRow": {
    en: "Row {row} incorrect.",
    fr: "Ligne {row} incorrecte.",
  },
  "validator.incorrectContent": {
    en: "Incorrect content: {missing} missing rows, {extra} extra rows.",
    fr: "Contenu incorrect : {missing} lignes manquantes, {extra} lignes en trop.",
  },

  // Activity graph
  "activity.activeDays": { en: "active day(s)", fr: "jour(s) d'activite" },
  "activity.dayStreak": { en: "day streak", fr: "jours consecutifs" },

  // Roadmap
  "roadmap.daTitle": { en: "Data Analyst SQL Roadmap", fr: "Parcours SQL Data Analyst" },
  "roadmap.daSubtitle": {
    en: "From your first SELECT to FAANG-level analytical SQL",
    fr: "De votre premier SELECT au SQL analytique niveau FAANG",
  },
  "roadmap.deTitle": { en: "Data Engineer SQL Roadmap", fr: "Parcours SQL Data Engineer" },
  "roadmap.deSubtitle": {
    en: "From schema design to production-grade data pipelines",
    fr: "Du schema design aux pipelines de donnees en production",
  },
  "roadmap.exercises": { en: "exercises", fr: "exercices" },
  "roadmap.completed": { en: "completed", fr: "termines" },

  // Levels
  "level.beginner": { en: "Beginner", fr: "Debutant" },
  "level.intermediate": { en: "Intermediate", fr: "Intermediaire" },
  "level.advanced": { en: "Advanced", fr: "Avance" },
  "level.beginner.desc": { en: "Build your SQL foundations", fr: "Construisez vos bases SQL" },
  "level.intermediate.desc": { en: "Compose complex queries", fr: "Composez des requetes complexes" },
  "level.advanced.desc": { en: "Master analytical patterns", fr: "Maitrisez les patterns analytiques" },

  // Footer
  "footer.tagline": {
    en: "Open-source SQL practice — runs in your browser",
    fr: "Entrainement SQL open-source — tourne dans votre navigateur",
  },

  // Roadmap company CTA
  "roadmap.companyCta": {
    en: "Ready for the real thing? Try a business case!",
    fr: "Pret pour du concret ? Lance-toi sur un cas business !",
  },
  "roadmap.tryCompany": { en: "Try", fr: "Essayer" },

  // The Briefing
  "nav.briefing": { en: "The Briefing", fr: "Le Briefing" },
  "briefing.tagline": { en: "Prepare your mission", fr: "Prépare ta mission" },
  "briefing.subtitle": {
    en: "Questions one by one. No answer before you validate. Timer optional. Score at the end.",
    fr: "Questions une par une. Pas de réponse avant de valider. Timer optionnel. Score à la fin.",
  },
  "briefing.start": { en: "Start Briefing", fr: "Lancer le Briefing" },
  "briefing.difficulty": { en: "Difficulty", fr: "Difficulté" },
  "briefing.questions": { en: "Number of questions", fr: "Nombre de questions" },
  "briefing.available": { en: "exercises available.", fr: "exercices disponibles." },
  "briefing.onlyN": { en: "Only {n} will be used.", fr: "Seulement {n} seront utilisés." },
  "briefing.noMatch": { en: "No exercises match — change difficulty.", fr: "Aucun exercice — changez le niveau." },
  "briefing.timer": { en: "Timer per question", fr: "Timer par question" },
  "briefing.timerOff": { en: "Off", fr: "Désactivé" },
  "briefing.timerHint": {
    en: "Timer resets on each new question. Expired questions count as failed.",
    fr: "Le timer se remet à zéro à chaque question. Les questions expirées comptent comme ratées.",
  },
  "briefing.skip": { en: "Skip", fr: "Passer" },
  "briefing.validate": { en: "Validate", fr: "Valider" },
  "briefing.validated": { en: "Validated", fr: "Validé" },
  "briefing.running": { en: "Running…", fr: "Exécution…" },
  "briefing.allPassed": { en: "✓ All tests passed", fr: "✓ Tous les tests passés" },
  "briefing.testsPassed": { en: "{n}/{t} tests passed", fr: "{n}/{t} tests passés" },
  "briefing.next": { en: "Next", fr: "Suivant" },
  "briefing.seeResults": { en: "See results", fr: "Voir les résultats" },
  "briefing.loading": { en: "Loading…", fr: "Chargement…" },
  "briefing.debrief": { en: "Debrief", fr: "Débrief" },
  "briefing.newBriefing": { en: "New Briefing", fr: "Nouveau Briefing" },
  "briefing.passed": { en: "Passed", fr: "Réussis" },
  "briefing.failed": { en: "Failed", fr: "Ratés" },
  "briefing.skipped": { en: "Skipped", fr: "Passés" },
  "briefing.breakdown": { en: "Question breakdown", fr: "Détail par question" },
  "briefing.solutionViewed": { en: "solution viewed", fr: "solution consultée" },
  "briefing.solutionsViewed": { en: "solutions viewed", fr: "solutions consultées" },
  "briefing.timerLimit": { en: "{n} min limit", fr: "limite {n} min" },

  // Module statuses
  "status.notStarted": { en: "Not Started", fr: "Non commence" },
  "status.inProgress": { en: "In Progress", fr: "En cours" },
  "status.complete": { en: "Complete", fr: "Termine" },
  "status.locked": { en: "Locked", fr: "Verrouille" },
  "status.comingSoon": { en: "Coming Soon", fr: "Bientot" },
} as const;

export type TranslationKey = keyof typeof translations;
