import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '@features/dashboard/services/dashboard.service';
import { Account } from '@model/account.model';
import { AccountGroup, WeekBucket } from '@model/dashboard.model';
import { formatDate, formatTime } from '@shared/date/utils';
import type { EChartsOption } from 'echarts/types/dist/shared';
import { AppPath } from '../../../../app-routing.model';

export type ChartType = 'mirror' | 'area' | 'waterfall' | 'heatmap';

const C = {
  income: '#16a34a',
  incomeSoft: '#e8f7ee',
  expense: '#e11d48',
  expenseSoft: '#fdecef',
  accent: '#4f46e5',
  muted: '#9ca3af',
  border: '#e5e7eb'
} as const;

const GRID = { top: 8, bottom: 28, left: 4, right: 4, containLabel: false };
const X_AXIS_STYLE = {
  axisLabel: { fontSize: 9, color: C.muted, fontFamily: 'monospace' },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { show: false }
};
const TOOLTIP_STYLE = {
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  borderWidth: 1,
  borderRadius: 8,
  padding: [8, 12],
  textStyle: { fontSize: 12, color: '#0f1115', fontFamily: 'inherit' },
  extraCssText: 'box-shadow: 0 4px 16px rgba(15,17,21,0.10)'
};

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
  protected readonly chartTypes: ChartType[] = ['area', 'mirror', 'waterfall', 'heatmap'];

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  public ngOnInit(): void {
    this.dashboardService.load();
  }

  protected toggle(currency: string): void {
    this.dashboardService.toggle(currency);
  }

  protected getChart(currency: string): ChartType {
    return this.activeChart()[currency] ?? 'area';
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
      (sym[currency] ?? currency + ' ') +
      Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }

  protected fmtSigned(amount: number, currency = 'USD'): string {
    const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    const prefix = amount >= 0 ? '+' : '−';
    return (
      prefix +
      (sym[currency] ?? currency + ' ') +
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

  // ── ECharts options ────────────────────────────────────────────────────────

  protected groupChartOption(group: AccountGroup, type: ChartType): EChartsOption {
    switch (type) {
      case 'mirror':
        return this.mirrorBarsOption(group.weeks);
      case 'area':
        return this.balanceAreaOption(group.weeks);
      case 'waterfall':
        return this.waterfallOption(group.weeks);
      case 'heatmap':
        return this.heatmapOption(group.weeks);
    }
  }

  protected sparklineOption(weeks: WeekBucket[]): EChartsOption {
    const nets = weeks.map((w) => w.income - w.expense);
    return {
      animation: false,
      grid: { top: 2, bottom: 2, left: 2, right: 2 },
      xAxis: { type: 'category', show: false, data: weeks.map((w) => w.label) },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'line',
          data: nets,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: C.muted, width: 1.5 }
        }
      ]
    };
  }

  private mirrorBarsOption(weeks: WeekBucket[]): EChartsOption {
    return {
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        formatter: (params: any) => {
          const week = params[0]?.axisValue ?? '';
          const income = params.find((p: any) => p.seriesName === 'Income')?.value ?? 0;
          const expense = Math.abs(params.find((p: any) => p.seriesName === 'Expenses')?.value ?? 0);
          return (
            `<div style="font-weight:600;margin-bottom:4px">${week}</div>` +
            `<div style="color:${C.income}">↑ Income &nbsp;<b>${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>` +
            `<div style="color:${C.expense}">↓ Expenses <b>${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>`
          );
        }
      },
      xAxis: { type: 'category', data: weeks.map((w) => w.label), ...X_AXIS_STYLE },
      yAxis: { type: 'value', show: false },
      series: [
        {
          name: 'Income',
          type: 'bar',
          data: weeks.map((w) => w.income),
          itemStyle: { color: C.income, borderRadius: [3, 3, 0, 0] },
          barMaxWidth: 12
        },
        {
          name: 'Expenses',
          type: 'bar',
          data: weeks.map((w) => -w.expense),
          itemStyle: { color: C.expense, opacity: 0.85, borderRadius: [0, 0, 3, 3] },
          barMaxWidth: 12
        }
      ]
    };
  }

  private balanceAreaOption(weeks: WeekBucket[]): EChartsOption {
    const nets: number[] = [];
    let running = 0;
    for (const w of weeks) {
      running += w.income - w.expense;
      nets.push(running);
    }
    const trend = nets[nets.length - 1] >= nets[0] ? C.income : C.expense;
    return {
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        formatter: (params: any) => {
          const week = params[0]?.axisValue ?? '';
          const val = params[0]?.value ?? 0;
          const color = val >= 0 ? C.income : C.expense;
          return (
            `<div style="font-weight:600;margin-bottom:4px">${week}</div>` +
            `<div style="color:${color}">Balance <b>${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>`
          );
        }
      },
      xAxis: { type: 'category', data: weeks.map((w) => w.label), ...X_AXIS_STYLE },
      yAxis: { type: 'value', show: false, splitLine: { show: false } },
      series: [
        {
          type: 'line',
          data: nets,
          smooth: 0.4,
          symbol: 'none',
          lineStyle: { color: trend, width: 2 },
          areaStyle: { color: trend, opacity: 0.12 }
        }
      ]
    };
  }

  private waterfallOption(weeks: WeekBucket[]): EChartsOption {
    const nets = weeks.map((w) => w.income - w.expense);
    return {
      animation: false,
      grid: GRID,
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        formatter: (params: any) => {
          const week = params[0]?.axisValue ?? '';
          const val = params[0]?.value ?? 0;
          const color = val >= 0 ? C.income : C.expense;
          const label = val >= 0 ? 'Surplus' : 'Deficit';
          return (
            `<div style="font-weight:600;margin-bottom:4px">${week}</div>` +
            `<div style="color:${color}">${label} <b>${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>`
          );
        }
      },
      xAxis: { type: 'category', data: weeks.map((w) => w.label), ...X_AXIS_STYLE },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'bar',
          data: nets.map((v) => ({
            value: v,
            itemStyle: { color: v >= 0 ? C.income : C.expense, borderRadius: v >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3] }
          })),
          barMaxWidth: 14
        }
      ]
    };
  }

  private heatmapOption(weeks: WeekBucket[]): EChartsOption {
    const maxI = Math.max(...weeks.map((w) => w.income), 1);
    const maxE = Math.max(...weeks.map((w) => w.expense), 1);
    return {
      animation: false,
      grid: { top: 8, bottom: 28, left: 60, right: 4 },
      tooltip: {
        ...TOOLTIP_STYLE,
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params;
          const week = weeks[p.data[0]]?.label ?? '';
          const row = p.data[1] === 1 ? 'Income' : 'Expenses';
          const color = p.data[1] === 1 ? C.income : C.expense;
          return (
            `<div style="font-weight:600;margin-bottom:4px">${week}</div>` +
            `<div style="color:${color}">${row} <b>${p.data[2].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>`
          );
        }
      },
      xAxis: { type: 'category', data: weeks.map((w) => w.label), ...X_AXIS_STYLE, splitArea: { show: false } },
      yAxis: {
        type: 'category',
        data: ['Expenses', 'Income'],
        axisLabel: { fontSize: 9, color: C.muted },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      visualMap: [
        { seriesIndex: 0, min: 0, max: maxI, show: false, inRange: { color: [C.incomeSoft, C.income] } },
        { seriesIndex: 1, min: 0, max: maxE, show: false, inRange: { color: [C.expenseSoft, C.expense] } }
      ] as any,
      series: [
        { type: 'heatmap', data: weeks.map((w, i) => [i, 1, w.income]) } as any,
        { type: 'heatmap', data: weeks.map((w, i) => [i, 0, w.expense]) } as any
      ]
    };
  }

  protected trackById(_: number, item: Account): string {
    return item.id;
  }

  protected trackByCurrency(_: number, group: AccountGroup): string {
    return group.currency;
  }
}
