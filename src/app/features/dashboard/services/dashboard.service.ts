import { Injectable, signal } from '@angular/core';
import { buildWeeks, CASHFLOW_DAYS_DEFAULT } from '@features/dashboard/utils';
import { Account } from '@model/account.model';
import { AccountGroup, DashboardSummary, WeekBucket } from '@model/dashboard.model';
import { Transaction } from '@model/transaction.model';
import { forkJoin } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _summary = signal<DashboardSummary | null>(null);
  private _groups = signal<AccountGroup[]>([]);
  private _expandedCurrency = signal<string | null>(null);
  private _loading = signal(false);

  readonly summary = this._summary.asReadonly();
  readonly groups = this._groups.asReadonly();
  readonly expandedCurrency = this._expandedCurrency.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private api: DashboardApiService) {}

  load(cashFlowDays: number = CASHFLOW_DAYS_DEFAULT): void {
    this._loading.set(true);
    forkJoin({
      summary: this.api.getSummary$(),
      accounts: this.api.getAccounts$(),
      cashflow: this.api.getCashflowTransactions$(cashFlowDays)
    }).subscribe({
      next: ({ summary, accounts, cashflow }) => {
        this._summary.set(summary);
        const groups = this.buildGroups(accounts, cashflow);
        this._groups.set(groups);
        if (groups.length > 0 && this._expandedCurrency() === null) {
          this._expandedCurrency.set(groups[0].currency);
        }
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  toggle(currency: string): void {
    this._expandedCurrency.update((cur) => (cur === currency ? null : currency));
  }

  private buildGroups(accounts: Account[], transactions: Transaction[]): AccountGroup[] {
    const now = new Date();
    const weeks = buildWeeks(now, 12);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const byCurrency: Record<string, Account[]> = {};
    for (const acc of accounts) {
      if (!byCurrency[acc.currency]) byCurrency[acc.currency] = [];
      byCurrency[acc.currency].push(acc);
    }

    return Object.entries(byCurrency)
      .map(([currency, accs]) => {
        const totalBalance = accs.reduce((s, a) => s + a.balance, 0);
        const txs = transactions.filter((t) => t.currency === currency);

        const monthTxs = txs.filter((t) => new Date(t.date) >= monthStart);
        const totalIncome = monthTxs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const totalExpenses = monthTxs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

        const weekBuckets: WeekBucket[] = weeks.map((w) => {
          const wTxs = txs.filter((t) => {
            const d = new Date(t.date);
            return d >= w.start && d <= w.end;
          });
          const income = wTxs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
          const expense = wTxs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
          return { label: w.label, income, expense };
        });

        const accountWeeks: Record<string, WeekBucket[]> = {};
        for (const acc of accs) {
          const aTxs = txs.filter((t) => t.accountId === acc.id);
          accountWeeks[acc.id] = weeks.map((w) => {
            const wTxs = aTxs.filter((t) => {
              const d = new Date(t.date);
              return d >= w.start && d <= w.end;
            });
            const income = wTxs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
            const expense = wTxs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
            return { label: w.label, income, expense };
          });
        }

        return {
          currency,
          totalBalance,
          totalIncome,
          totalExpenses,
          netFlow: totalIncome - totalExpenses,
          accounts: accs,
          weeks: weekBuckets,
          accountWeeks
        };
      })
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }
}
