import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '@features/dashboard/services/dashboard.service';
import { Account } from '@model/account.model';
import { AccountGroup, WeekBucket } from '@model/dashboard.model';
import { formatDate, formatTime } from '@shared/date/utils';
import { AppPath } from '../../../../app-routing.model';

export type ChartType = 'mirror' | 'area' | 'waterfall' | 'heatmap';

interface MirrorBar {
  x: number;
  label: string;
  incomeY: number;
  incomeH: number;
  expenseY: number;
  expenseH: number;
}

interface WaterfallBar {
  x: number;
  label: string;
  y: number;
  h: number;
  positive: boolean;
}

interface BalanceAreaData {
  linePath: string;
  areaPath: string;
  zeroY: number;
  viewH: number;
}

interface HeatmapCell {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  row: 'income' | 'expense';
  label: string;
}

const CHART_W = 240;
const COL_W = CHART_W / 12;
const BAR_W = 8;

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
  protected readonly groups = this.dashboardService.groups;
  protected readonly expandedCurrency = this.dashboardService.expandedCurrency;
  protected readonly loading = this.dashboardService.loading;

  protected readonly activeChart = signal<Record<string, ChartType>>({});

  protected readonly chartTypes: ChartType[] = ['mirror', 'area', 'waterfall', 'heatmap'];
  protected readonly BAR_W = BAR_W;

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  public ngOnInit(): void {
    this.dashboardService.load();
  }

  protected toggle(currency: string): void {
    this.dashboardService.toggle(currency);
  }

  protected getChart(currency: string): ChartType {
    return this.activeChart()[currency] ?? 'mirror';
  }

  protected setChart(currency: string, type: ChartType): void {
    this.activeChart.update((m) => ({ ...m, [currency]: type }));
  }

  protected navigateToTransactions(): void {
    this.router.navigate(['/' + AppPath.transactions]);
  }

  protected fmtMoney(amount: number, currency = 'USD'): string {
    const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    return (
      (sym[currency] ?? currency + ' ') +
      Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }

  protected fmtSigned(amount: number, currency = 'USD'): string {
    const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    const prefix = amount >= 0 ? '+' : '−';
    return (
      prefix +
      (sym[currency] ?? currency + ' ') +
      Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
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

  protected mirrorBars(weeks: WeekBucket[]): MirrorBar[] {
    const max = Math.max(...weeks.flatMap((w) => [w.income, w.expense]), 1) * 1.1;
    const centerY = 55;
    const maxH = 50;
    return weeks.map((w, i) => {
      const x = COL_W * i + COL_W / 2;
      const ih = (w.income / max) * maxH;
      const eh = (w.expense / max) * maxH;
      return { x, label: w.label, incomeY: centerY - ih, incomeH: ih, expenseY: centerY, expenseH: eh };
    });
  }

  protected balanceArea(weeks: WeekBucket[]): BalanceAreaData {
    const nets: number[] = [];
    let running = 0;
    for (const w of weeks) {
      running += w.income - w.expense;
      nets.push(running);
    }
    const min = Math.min(...nets, 0);
    const max = Math.max(...nets, 1);
    const range = max - min || 1;
    const viewH = 90;
    const pad = 8;
    const avail = viewH - 2 * pad;
    const pts = nets.map((v, i) => ({
      x: COL_W * i + COL_W / 2,
      y: viewH - pad - ((v - min) / range) * avail
    }));
    const zeroY = viewH - pad - ((0 - min) / range) * avail;
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const last = pts[pts.length - 1];
    const first = pts[0];
    const areaPath = `${linePath} L${last.x.toFixed(1)},${zeroY.toFixed(1)} L${first.x.toFixed(1)},${zeroY.toFixed(1)} Z`;
    return { linePath, areaPath, zeroY, viewH };
  }

  protected waterfallBars(weeks: WeekBucket[]): WaterfallBar[] {
    const nets = weeks.map((w) => w.income - w.expense);
    const max = Math.max(...nets.map(Math.abs), 1) * 1.1;
    const centerY = 55;
    const maxH = 50;
    return weeks.map((w, i) => {
      const net = w.income - w.expense;
      const h = (Math.abs(net) / max) * maxH;
      return {
        x: COL_W * i + COL_W / 2 - BAR_W / 2,
        label: w.label,
        y: net >= 0 ? centerY - h : centerY,
        h,
        positive: net >= 0
      };
    });
  }

  protected heatmapCells(weeks: WeekBucket[]): HeatmapCell[] {
    const maxI = Math.max(...weeks.map((w) => w.income), 1);
    const maxE = Math.max(...weeks.map((w) => w.expense), 1);
    const cellW = 18;
    const cellH = 22;
    const cells: HeatmapCell[] = [];
    weeks.forEach((w, i) => {
      const x = COL_W * i + (COL_W - cellW) / 2;
      cells.push({ x, y: 3, w: cellW, h: cellH, opacity: w.income / maxI, row: 'income', label: w.label });
      cells.push({ x, y: 30, w: cellW, h: cellH, opacity: w.expense / maxE, row: 'expense', label: w.label });
    });
    return cells;
  }

  protected sparklinePath(weeks: WeekBucket[]): string {
    const nets = weeks.map((w) => w.income - w.expense);
    const min = Math.min(...nets);
    const max = Math.max(...nets, 1);
    const range = max - min || 1;
    const W = 60,
      H = 24,
      pad = 3;
    const pts = nets.map((v, i) => {
      const x = pad + (i / (nets.length - 1)) * (W - 2 * pad);
      const y = H - pad - ((v - min) / range) * (H - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts.join(' L')}`;
  }

  protected accountSparkline(accountId: string, group: AccountGroup): string {
    const weeks = group.accountWeeks[accountId] ?? [];
    return this.sparklinePath(weeks.length > 0 ? weeks : group.weeks);
  }

  protected trackById(_: number, item: Account): string {
    return item.id;
  }

  protected trackByCurrency(_: number, group: AccountGroup): string {
    return group.currency;
  }
}
