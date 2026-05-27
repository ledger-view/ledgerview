export interface CurrencyAmount {
  currency: string;
  amount: number;
}

export interface DashboardSummary {
  totalBalance: CurrencyAmount[];
  monthlyIncome: CurrencyAmount[];
  monthlyExpenses: CurrencyAmount[];
  netFlow: CurrencyAmount[];
}

export interface ExpenseByCategory {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  currency: string;
  total: number;
}
