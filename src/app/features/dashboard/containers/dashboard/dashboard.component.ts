import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '@features/dashboard/services/dashboard.service';
import { CurrencyAmount } from '@model/dashboard.model';
import { formatDate, formatTime } from '@shared/date/utils';
import { AppPath } from '../../../../app-routing.model';

const CIRCUMFERENCE = 2 * Math.PI * 62;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  protected readonly summary = this.dashboardService.summary;
  protected readonly expensesByCategory = this.dashboardService.expensesByCategory;
  protected readonly recentTransactions = this.dashboardService.recentTransactions;
  protected readonly accounts = this.dashboardService.accounts;
  protected readonly loading = this.dashboardService.loading;

  protected readonly totalExpenses = computed(() =>
    this.expensesByCategory().reduce((sum, s) => sum + s.total, 0)
  );

  protected readonly primaryExpenseTotal = computed(() => {
    const expenses = this.expensesByCategory();
    if (!expenses.length) return null;
    const byCurrency: Record<string, number> = {};
    expenses.forEach((e) => (byCurrency[e.currency] = (byCurrency[e.currency] ?? 0) + e.total));
    const [currency, amount] = Object.entries(byCurrency).sort((a, b) => b[1] - a[1])[0];
    return { currency, amount };
  });

  protected readonly donutSegments = computed(() => {
    const segs = this.expensesByCategory();
    const total = this.totalExpenses() || 1;
    let acc = 0;
    return segs.map((s) => {
      const frac = s.total / total;
      const len = frac * CIRCUMFERENCE;
      const dash = `${len} ${CIRCUMFERENCE - len}`;
      const offset = -acc * CIRCUMFERENCE;
      acc += frac;
      return { ...s, dash, offset };
    });
  });

  protected readonly cashFlowData = [
    { w: 'W11', i: 1460, e: 920 },
    { w: 'W12', i: 0, e: 740 },
    { w: 'W13', i: 0, e: 1240 },
    { w: 'W14', i: 1460, e: 880 },
    { w: 'W15', i: 0, e: 980 },
    { w: 'W16', i: 0, e: 760 },
    { w: 'W17', i: 1460, e: 1180 },
    { w: 'W18', i: 0, e: 690 },
    { w: 'W19', i: 0, e: 1430 },
    { w: 'W20', i: 1460, e: 920 },
    { w: 'W21', i: 0, e: 870 },
    { w: 'W22', i: 0, e: 1050 }
  ];

  protected readonly cashFlowMax = Math.max(...this.cashFlowData.map((d) => Math.max(d.i, d.e))) * 1.1;

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  public ngOnInit(): void {
    this.dashboardService.load();
  }

  protected navigateToTransactions(): void {
    this.router.navigate(['/' + AppPath.transactions]);
  }

  protected fmtMoney(amount: number, currency = 'USD'): string {
    const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    return (
      (sym[currency] ?? currency + ' ') +
      Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }

  protected fmtAmounts(amounts: CurrencyAmount[]): string {
    if (!amounts.length) return '—';
    return amounts.map((a) => this.fmtMoney(a.amount, a.currency)).join(' · ');
  }

  protected pct(value: number): string {
    const total = this.totalExpenses();
    return total > 0 ? ((value / total) * 100).toFixed(0) : '0';
  }

  protected accountColor(type: string): string {
    const map: Record<string, string> = { Checking: '#4F46E5', Savings: '#16A34A', Cash: '#94A3B8', Crypto: '#F59E0B' };
    return map[type] ?? '#4F46E5';
  }

  protected accountIcon(type: string): string {
    const map: Record<string, string> = {
      Checking: 'credit_card',
      Savings: 'account_balance',
      Cash: 'wallet',
      Crypto: 'currency_bitcoin'
    };
    return map[type] ?? 'credit_card';
  }

  protected barHeight(value: number): number {
    return this.cashFlowMax > 0 ? (value / this.cashFlowMax) * 140 : 0;
  }

  protected trackByIndex(index: number): number {
    return index;
  }
}
