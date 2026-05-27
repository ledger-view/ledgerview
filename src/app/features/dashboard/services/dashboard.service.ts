import { Injectable, signal } from '@angular/core';
import { Account } from '@model/account.model';
import { AccountGroup, DashboardSummary, WeekBucket } from '@model/dashboard.model';
import { Transaction } from '@model/transaction.model';
import { forkJoin } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';

function isoWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const y1 = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - y1.getTime()) / 86400000 + 1) / 7);
}

function buildWeeks(now: Date, count: number): { label: string; start: Date; end: Date }[] {
  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const end = new Date(now);
    end.setDate(end.getDate() - i * 7);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    result.push({ label: 'W' + isoWeek(start), start, end });
  }
  return result;
}

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

  load(): void {
    this._loading.set(true);
    forkJoin({
      summary: this.api.getSummary$(),
      accounts: this.api.getAccounts$(),
      cashflow: this.api.getCashflowTransactions$()
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
