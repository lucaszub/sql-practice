export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
  descriptionFr: string;
}

export interface TableInfo {
  name: string;
  description: string;
  descriptionFr: string;
  columns: ColumnInfo[];
  rowCount: number;
}

export interface BusinessQuestion {
  id: string;
  title: string;
  titleFr: string;
  stakeholder: string;
  stakeholderRole: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  descriptionFr: string;
  hint: string;
  hintFr: string;
  solutionQuery: string;
  expectedColumns: string[];
  expectedRows: Record<string, unknown>[];
  orderMatters: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  tagline: string;
  taglineFr: string;
  sector: string;
  sectorFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  schema: string;
  tables: TableInfo[];
  questions: BusinessQuestion[];
}
