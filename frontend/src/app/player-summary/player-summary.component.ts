import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CropsService } from '../_services/players.service';
import { ChartData, ChartOptions } from 'chart.js';

@UntilDestroy()
@Component({
  selector: 'crop-summary-component',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CropSummaryComponent implements OnInit, OnDestroy {
  cropID: number = 1;
  cropSummary: any;
  harvestDates: string[] = [];
  selectedHarvestDate: string;
  harvestStats: any;
  gameDates: string[] = [];
  selectedGameDate: string;
  gameStats: any;
  shots: any[] = [];
  courtWidth: number = 600;
  courtHeight: number = 600;
  backgroundImage = new Image();
  objectKeys = Object.keys;
  // 可视化相关变量
  statCards: { label: string; value: any }[] = [];
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  barChartOptions: ChartOptions = { responsive: true };
  lineChartLabels: string[] = [];
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  lineChartOptions: ChartOptions = { responsive: true };
  irrigationProgress = 0;
  organicInputProgress = 0;
  machineryProgress = 0;
  eventPieChartLabels: string[] = [];
  eventPieChartData: number[] = [];
  eventPieChartDatasets: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };
  eventPieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(
    protected cdr: ChangeDetectorRef,
    protected cropsService: CropsService
  ) {}

  ngOnInit(): void {
    this.fetchCropSummary();
    this.backgroundImage.src = 'assets/court_diagram.jpg';
    this.backgroundImage.onload = () => {
      this.drawCourt();
    };
  }

  changeCrop(): void {
    this.fetchCropSummary();
  }

  fetchCropSummary(): void {
    this.cropsService
      .getCropSummary(this.cropID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data) => {
          this.cropSummary = data.apiResponse;
          this.extractHarvestDates();
          this.extractGameDates();
          this.cdr.markForCheck();
        },
        (error) => {
          console.error('Error fetching crop summary:', error);
        }
      );
  }

  extractHarvestDates(): void {
    if (this.cropSummary && this.cropSummary.harvests) {
      this.harvestDates = this.cropSummary.harvests.map((h) => h.date);
      if (this.harvestDates.length > 0) {
        this.selectedHarvestDate = this.harvestDates[0];
        this.displayHarvestStats();
      }
    }
  }

  changeHarvestDate(): void {
    this.displayHarvestStats();
  }

  displayHarvestStats(): void {
    if (this.cropSummary && this.cropSummary.harvests) {
      const selectedHarvest = this.cropSummary.harvests.find(
        (h) => h.date === this.selectedHarvestDate
      );
      if (selectedHarvest) {
        this.harvestStats = selectedHarvest;
        // 统计卡片
        this.statCards = [
          { label: 'Area', value: selectedHarvest.area },
          { label: 'Yield Amount', value: selectedHarvest.yieldAmount },
          { label: 'Fertilizer Used', value: selectedHarvest.fertilizerUsed },
          { label: 'Irrigation Times', value: selectedHarvest.irrigationTimes },
          { label: 'Moisture', value: selectedHarvest.moisture },
          { label: 'Pesticide Used', value: selectedHarvest.pesticideUsed },
        ];
        // 投入结构柱状图
        this.barChartLabels = [
          'Fertilizer Used',
          'Pesticide Used',
          'Organic Input Times',
          'Machinery Used',
        ];
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              label: `Input Structure on ${this.selectedHarvestDate}`,
              data: [
                selectedHarvest.fertilizerUsed,
                selectedHarvest.pesticideUsed,
                selectedHarvest.organicInputTimes,
                selectedHarvest.machineryUsed,
              ],
              backgroundColor: [
                '#FF6384', // Fertilizer Used
                '#36A2EB', // Pesticide Used
                '#FFCE56', // Organic Input Times
                '#4BC0C0', // Machinery Used
              ],
            },
          ],
        };
        // 折线图（如有历史）
        if (this.cropSummary.harvests.length > 0) {
          this.lineChartLabels = this.cropSummary.harvests.map((h) => h.date);
          this.lineChartData = {
            labels: this.lineChartLabels,
            datasets: [
              {
                label: 'Yield Amount',
                data: this.cropSummary.harvests.map((h) => h.yieldAmount),
              },
              {
                label: 'Area',
                data: this.cropSummary.harvests.map((h) => h.area || 0),
              },
            ],
          };
        } else {
          this.lineChartLabels = [];
          this.lineChartData = {
            labels: this.lineChartLabels,
            datasets: [],
          };
        }

        // 进度条 - 修复计算逻辑
        const irrigationTimes = selectedHarvest.irrigationTimes || 0;
        const targetIrrigation = 10; // 目标灌溉次数
        this.irrigationProgress = Math.min(
          100,
          (irrigationTimes / targetIrrigation) * 100
        );
        if (this.irrigationProgress === 0 && irrigationTimes > 0) {
          this.irrigationProgress = 10;
        }

        // 新增：有机投入进度条
        const organicInputTimes = selectedHarvest.organicInputTimes || 0;
        const organicInputTotal = selectedHarvest.organicInputTotal || 1;
        this.organicInputProgress = Math.min(
          100,
          (organicInputTimes / organicInputTotal) * 100
        );
        if (this.organicInputProgress === 0 && organicInputTimes > 0) {
          this.organicInputProgress = 10;
        }

        // 新增：机械使用进度条
        const machineryUsed = selectedHarvest.machineryUsed || 0;
        const machineryTotal = selectedHarvest.machineryTotal || 1;
        this.machineryProgress = Math.min(
          100,
          (machineryUsed / machineryTotal) * 100
        );
        if (this.machineryProgress === 0 && machineryUsed > 0) {
          this.machineryProgress = 10;
        }

        // 事件统计饼图
        this.eventPieChartLabels = [
          'Disease Events',
          'Replant Times',
          'Weed Events',
          'Soil Events',
        ];
        this.eventPieChartData = [
          selectedHarvest.diseaseEvents,
          selectedHarvest.replantTimes,
          selectedHarvest.weedEvents,
          selectedHarvest.soilEvents,
        ];
        // 检查是否有有效数据
        const hasValidData = this.eventPieChartData.some(
          (value) => value > 0 && typeof value === 'number' && !isNaN(value)
        );
        console.log(
          'Pie chart data:',
          this.eventPieChartData,
          'Has valid:',
          hasValidData
        );
        if (hasValidData) {
          this.eventPieChartDatasets = {
            labels: this.eventPieChartLabels,
            datasets: [
              {
                data: this.eventPieChartData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderWidth: 1,
              },
            ],
          };
        } else {
          // 没有有效数据时，清空饼图
          this.eventPieChartDatasets = { labels: [], datasets: [] };
        }
      }
    }
  }

  extractGameDates(): void {
    if (this.cropSummary && this.cropSummary.games) {
      this.gameDates = this.cropSummary.games.map((game) => game.date);
      if (this.gameDates.length > 0) {
        this.selectedGameDate = this.gameDates[0];
        this.displayGameStats();
      }
    }
  }

  changeGameDate(): void {
    this.displayGameStats();
  }

  displayGameStats(): void {
    if (this.cropSummary && this.cropSummary.games) {
      const selectedGame = this.cropSummary.games.find(
        (game) => game.date === this.selectedGameDate
      );
      if (selectedGame) {
        const { shots, ...statsWithoutShots } = selectedGame;
        this.gameStats = statsWithoutShots;
        this.shots = shots;
        this.drawCourt();
      }
    }
  }

  drawCourt(): void {
    const canvas = document.getElementById('courtCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx && this.backgroundImage.complete) {
      ctx.clearRect(0, 0, this.courtWidth, this.courtHeight);
      ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.courtWidth,
        this.courtHeight
      );
      this.shots.forEach((shot) => {
        const { locationX, locationY, isMake } = shot;
        this.drawShot(ctx, locationX, locationY, isMake);
      });
    }
  }

  drawShot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isMake: boolean
  ): void {
    const centerX = this.courtWidth / 2;
    const centerY = this.courtHeight / 2;
    const scaleFactorX = 10;
    const scaleFactorY = 10;
    const posX = centerX + x * scaleFactorX;
    const posY = centerY - y * scaleFactorY;
    ctx.fillStyle = isMake ? 'green' : 'red';
    ctx.beginPath();
    ctx.arc(posX, posY, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  ngOnDestroy() {}
}
