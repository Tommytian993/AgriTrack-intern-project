import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CropSummaryComponent } from './player-summary.component';

const routes: Routes = [
  {
    path: '',
    component: CropSummaryComponent,
    data: { title: 'Crop Summary' },
  },
];

export const routing: ModuleWithProviders<RouterModule> =
  RouterModule.forChild(routes);
