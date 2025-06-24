import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropSummaryResponseComponent } from './player-summary-response.component';
import { routing } from 'app/player-summary-response/player-summary-response.routing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CropsService } from 'app/_services/players.service';

@NgModule({
  declarations: [CropSummaryResponseComponent],
  imports: [
    CommonModule,
    routing,
    MatToolbarModule,
    MatCardModule,
    FlexModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
  ],
  providers: [CropsService],
  bootstrap: [CropSummaryResponseComponent],
})
export class CropSummaryResponseModule {}
