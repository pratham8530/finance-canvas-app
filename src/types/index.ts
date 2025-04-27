
export type Category = 
  | "Food" 
  | "Transport" 
  | "Entertainment" 
  | "Bills" 
  | "Housing"
  | "Shopping"
  | "Health"
  | "Income" 
  | "Others";

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

export interface CategoryBudget {
  category: Category;
  amount: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
}

export interface BudgetComparison {
  category: Category;
  budgeted: number;
  spent: number;
  percentage: number;
}
