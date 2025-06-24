import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'crop-summary' },
  {
    path: 'crop-summary',
    loadChildren: () =>
      import('./player-summary/player-summary.module').then(
        (m) => m.CropSummaryModule
      ),
    data: { preload: true },
  },
  {
    path: 'crop-summary-api',
    loadChildren: () =>
      import('./player-summary-response/player-summary-response.module').then(
        (m) => m.CropSummaryResponseModule
      ),
    data: { preload: true },
  },
  { path: '**', redirectTo: 'crop-summary' },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
  routes,
  { relativeLinkResolution: 'legacy' }
);
