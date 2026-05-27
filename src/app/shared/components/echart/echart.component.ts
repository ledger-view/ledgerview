import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';

echarts.use([BarChart, LineChart, HeatmapChart, GridComponent, VisualMapComponent, TooltipComponent, SVGRenderer]);

@Component({
  selector: 'app-echart',
  template: '<div #el style="width:100%;height:100%"></div>',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class EchartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('el') private elRef!: ElementRef<HTMLDivElement>;
  @Input() option: EChartsOption = {};

  private chart?: echarts.ECharts;
  private ro?: ResizeObserver;

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.elRef.nativeElement, null, { renderer: 'svg' });
    this.chart.setOption(this.option);
    this.ro = new ResizeObserver(() => this.chart?.resize());
    this.ro.observe(this.elRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['option'] && this.chart) {
      this.chart.setOption(changes['option'].currentValue, { notMerge: true });
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.chart?.dispose();
  }
}
