import { Injectable, signal } from '@angular/core';
import { Account } from '@model/account.model';
import { DashboardSummary, ExpenseByCategory } from '@model/dashboard.model';
import { Transaction } from '@model/transaction.model';
import { forkJoin } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _summary = signal<DashboardSummary | null>(null);
  private _expensesByCategory = signal<ExpenseByCategory[]>([]);
  private _recentTransactions = signal<Transaction[]>([]);
  private _accounts = signal<Account[]>([]);
  private _loading = signal(false);

  readonly summary = this._summary.asReadonly();
  readonly expensesByCategory = this._expensesByCategory.asReadonly();
  readonly recentTransactions = this._recentTransactions.asReadonly();
  readonly accounts = this._accounts.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private api: DashboardApiService) {}

  load(): void {
    this._loading.set(true);
    forkJoin({
      summary: this.api.getSummary$(),
      expenses: this.api.getExpensesByCategory$(),
      recent: this.api.getRecentTransactions$(),
      accounts: this.api.getAccounts$()
    }).subscribe({
      next: ({ summary, expenses, recent, accounts }) => {
        this._summary.set(summary);
        this._expensesByCategory.set(expenses);
        this._recentTransactions.set(recent);
        this._accounts.set(accounts);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }
}
