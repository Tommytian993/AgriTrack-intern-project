import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CropsService } from '../_services/players.service';
import { ChartData, ChartOptions } from 'chart.js';

@UntilDestroy()
@Component({
  selector: 'crop-summary-response-component',
  templateUrl: './player-summary-response.component.html',
  styleUrls: ['./player-summary-response.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CropSummaryResponseComponent implements OnInit, OnDestroy {
  endpoint: any;
  apiResponse: any;
  cropID: number = 1;
  cropStats: any[] = [];

  // 折线图：产量趋势
  yieldLineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: '产量', data: [] }],
  };
  yieldLineChartOptions: ChartOptions = { responsive: true };

  // 饼图：投入结构
  inputPieChartData: ChartData<'pie'> = {
    labels: ['化肥', '农药', '有机投入', '机械'],
    datasets: [{ data: [] }],
  };
  inputPieChartOptions: ChartOptions = { responsive: true };

  // 柱状图：事件统计
  eventBarChartData: ChartData<'bar'> = {
    labels: ['病害', '杂草', '土壤', '补种'],
    datasets: [{ label: '事件次数', data: [] }],
  };
  eventBarChartOptions: ChartOptions = { responsive: true };

  // 进度条：产量进度
  yieldProgress = 0;
  yieldGoal = 100; // 你可以根据实际目标调整

  displayedColumns: string[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected cropsService: CropsService
  ) {}

  ngOnInit(): void {
    this.fetchApiResponse();
  }

  changeParams(): void {
    this.fetchApiResponse();
  }

  fetchApiResponse(): void {
    this.cropsService
      .getCropSummary(this.cropID)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.endpoint = data.endpoint;
        this.apiResponse = JSON.stringify(data.apiResponse, null, 2);
        this.cropStats = Array.isArray(data.apiResponse)
          ? data.apiResponse
          : [data.apiResponse];
        // 1. 产量趋势折线图
        this.yieldLineChartData.labels = this.cropStats.map((s) => s.date);
        this.yieldLineChartData.datasets[0].data = this.cropStats.map(
          (s) => s.yieldAmount
        );
        // 2. 投入结构饼图（取最新一天）
        const last = this.cropStats[this.cropStats.length - 1] || {};
        this.inputPieChartData.datasets[0].data = [
          last.fertilizerUsed || 0,
          last.pesticideUsed || 0,
          last.organicInputTotal || 0,
          last.machineryTotal || 0,
        ];
        // 3. 事件统计柱状图（取最新一天）
        this.eventBarChartData.datasets[0].data = [
          last.diseaseEvents || 0,
          last.weedEvents || 0,
          last.soilEvents || 0,
          last.replantTimes || 0,
        ];
        // 4. 进度条
        this.yieldProgress = last.yieldAmount || 0;
        // 5. 表格字段
        this.displayedColumns = Object.keys(last);
      });
  }

  ngOnDestroy() {}
}
