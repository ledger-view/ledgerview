import { Injectable, signal } from '@angular/core';
import { AccountApiService } from '@features/accounts/services/account-api.service';
import { buildWeeks, CASHFLOW_WEEKS_DEFAULT } from '@features/dashboard/utils';
import { Account } from '@model/account.model';
import { AccountGroup, CashflowRow, DashboardSummary, WeekBucket } from '@model/dashboard.model';
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

  constructor(
    private api: DashboardApiService,
    private accountApiService: AccountApiService
  ) {}

  load(weeks: number = CASHFLOW_WEEKS_DEFAULT): void {
    this._loading.set(true);
    forkJoin({
      summary: this.api.getSummary$(),
      accounts: this.accountApiService.getAccounts$(),
      cashflow: this.api.getCashflow$(weeks)
    }).subscribe({
      next: ({ summary, accounts, cashflow }) => {
        this._summary.set(summary);
        const groups = this.buildGroups(accounts, cashflow, summary, weeks);
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

  private buildGroups(accounts: Account[], cashflow: CashflowRow[], summary: DashboardSummary, weeks: number): AccountGroup[] {
    const weekScaffold = buildWeeks(new Date(), weeks);

    const byCurrency: Record<string, Account[]> = {};
    for (const acc of accounts) {
      if (!byCurrency[acc.currency]) byCurrency[acc.currency] = [];
      byCurrency[acc.currency].push(acc);
    }

    return Object.entries(byCurrency)
      .map(([currency, accs]) => {
        const totalBalance = accs.reduce((s, a) => s + a.balance, 0);
        const currencyRows = cashflow.filter((r) => r.currency === currency);

        const weekBuckets: WeekBucket[] = weekScaffold.map((w) => {
          const rows = currencyRows.filter((r) => r.weekLabel === w.label);
          return {
            label: w.label,
            income: rows.reduce((s, r) => s + r.income, 0),
            expense: rows.reduce((s, r) => s + r.expense, 0)
          };
        });

        const accountWeeks: Record<string, WeekBucket[]> = {};
        for (const acc of accs) {
          const accRows = currencyRows.filter((r) => r.accountId === acc.id);
          accountWeeks[acc.id] = weekScaffold.map((w) => {
            const row = accRows.find((r) => r.weekLabel === w.label);
            return { label: w.label, income: row?.income ?? 0, expense: row?.expense ?? 0 };
          });
        }

        const totalIncome = summary.monthlyIncome.find((c) => c.currency === currency)?.amount ?? 0;
        const totalExpenses = summary.monthlyExpenses.find((c) => c.currency === currency)?.amount ?? 0;

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
