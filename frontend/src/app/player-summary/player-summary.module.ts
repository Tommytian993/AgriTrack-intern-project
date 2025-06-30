import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropSummaryComponent } from './player-summary.component';
import { routing } from 'app/player-summary/player-summary.routing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CropsService } from 'app/_services/players.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [CropSummaryComponent],
  imports: [
    FlexLayoutModule,
    CommonModule,
    routing,
    MatToolbarModule,
    MatCardModule,
    FlexModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatProgressBarModule,
  ],
  providers: [CropsService],
  bootstrap: [CropSummaryComponent],
})
export class CropSummaryModule {}
