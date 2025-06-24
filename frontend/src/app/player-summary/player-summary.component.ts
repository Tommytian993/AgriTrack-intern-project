import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CropsService } from '../_services/players.service';

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
