import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/spacex/launchpad-explorer').then((m) => m.LaunchpadExplorer),
  },
  {
    path: 'spaceXStatus',
    loadComponent: () =>
      import('./components/spacex/spacex-api-status').then((m) => m.SystemStatus),
  },
];
