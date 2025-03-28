export interface AssetClass {
  id: string;
  name: string;
  percentage: number;
  color?: string;
}

export interface Asset {
  id: string;
  ticker: string;
  classId: string;
  quantity: number;
  price: number;
  minInvestment: number;
  score: number;
}

export interface Investment {
  classId: string;
  assetId: string;
  amount: number;
  suggested: number;
  actual: number | null;
  newPercentage: number;
  idealPercentage: number;
}

export interface CerradoDiagram {
  assetClasses: AssetClass[];
  assets: Asset[];
  investments: Investment[];
  contributionAmount: number;
  expandedSteps: Record<string, boolean>;
}

export interface ChecklistItem {
  label: string;
  description: string;
  points: number;
}

export interface ChecklistClass {
  label: string;
  items: ChecklistItem[];
}

export interface Checklist {
  [key: string]: ChecklistClass[];
}
