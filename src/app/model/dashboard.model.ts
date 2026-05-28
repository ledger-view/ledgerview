import { Account } from './account.model';

export interface CashflowRow {
  weekLabel: string;
  weekStart: string;
  currency: string;
  accountId: string;
  income: number;
  expense: number;
}

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

export interface WeekBucket {
  label: string;
  income: number;
  expense: number;
}

export interface AccountGroup {
  currency: string;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  accounts: Account[];
  weeks: WeekBucket[];
  accountWeeks: Record<string, WeekBucket[]>;
}
