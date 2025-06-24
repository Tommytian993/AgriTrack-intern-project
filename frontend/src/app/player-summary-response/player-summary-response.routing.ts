import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CropSummaryResponseComponent } from './player-summary-response.component';

const routes: Routes = [
  {
    path: '',
    component: CropSummaryResponseComponent,
    data: { title: 'Crop Summary Response' },
  },
];

export const routing: ModuleWithProviders<RouterModule> =
  RouterModule.forChild(routes);
