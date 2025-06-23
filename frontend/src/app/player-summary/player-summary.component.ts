import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PlayersService } from '../_services/players.service';

@UntilDestroy()
@Component({
  selector: 'player-summary-component',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSummaryComponent implements OnInit, OnDestroy {
  //default player id
  playerID: number = 1;

  playerSummary: any;
  // all the games this player played in date field
  gameDates: string[] = [];
  //current dropdown selected game date
  selectedGameDate: string;
  gameStats: any;
  shots: any[] = [];
  // court diagram canvas dimension in pixels
  courtWidth: number = 600; 
  courtHeight: number = 600; 
  // court diagram background image object
  backgroundImage = new Image();

  constructor(
    // manually have change detection
    protected cdr: ChangeDetectorRef,
    // fetch the player's data
    protected playersService: PlayersService
  ) {}

  ngOnInit(): void {
    this.fetchPlayerSummary();
    //set the court as background and draw the diagram
    this.backgroundImage.src = 'assets/court_diagram.jpg';
    this.backgroundImage.onload = () => {
      this.drawCourt();
    };
  }

  // fetch data for the new player base on id
  changePlayer(): void {
    this.fetchPlayerSummary();
  }

  fetchPlayerSummary(): void {
    this.playersService
      .getPlayerSummary(this.playerID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data) => {
          this.playerSummary = data.apiResponse;
          this.extractGameDates();
          this.cdr.markForCheck();
        },
        (error) => {
          console.error('Error fetching player summary:', error);
        }
      );
  }

  extractGameDates(): void {
    if (this.playerSummary && this.playerSummary.games) {
      this.gameDates = this.playerSummary.games.map((game) => game.date);
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
    if (this.playerSummary && this.playerSummary.games) {
      const selectedGame = this.playerSummary.games.find(
        (game) => game.date === this.selectedGameDate
      );
      if (selectedGame) {
        // for the stats we don't need shots yet
        const { shots, ...statsWithoutShots } = selectedGame;
        this.gameStats = statsWithoutShots;
        // get the shots and draw them on the diagram
        this.shots = shots; 
        this.drawCourt(); 
      }
    }
  }

  drawCourt(): void {
    // set up canvas rendering it 2d
    const canvas = document.getElementById('courtCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx && this.backgroundImage.complete) {
      // clear canvas, set dimensions and draw the court background
      ctx.clearRect(0, 0, this.courtWidth, this.courtHeight);
      ctx.drawImage(this.backgroundImage, 0, 0, this.courtWidth, this.courtHeight);

      // place each shot with reference to the json data
      this.shots.forEach((shot) => {
        const { locationX, locationY, isMake } = shot;
        this.drawShot(ctx, locationX, locationY, isMake);
      });
    }
  }

  drawShot(ctx: CanvasRenderingContext2D, x: number, y: number, isMake: boolean): void {
    const centerX = this.courtWidth / 2;
    const centerY = this.courtHeight / 2;

    const scaleFactorX = 10; 
    const scaleFactorY = 10; 

    // calculate shot position relative to the center of the court
    const posX = centerX + (x * scaleFactorX);
    const posY = centerY - (y * scaleFactorY); 

    // if shots made its green otherwise red
    ctx.fillStyle = isMake ? 'green' : 'red';

    // fill the shot circle of radius 5 pixels
    ctx.beginPath();
    ctx.arc(posX, posY, 5, 0, 2 * Math.PI); 
    ctx.fill();
  }

  ngOnDestroy() {}
}
 
