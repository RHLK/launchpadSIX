import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/launchpad-explorer').then(m => m.LaunchpadExplorer)
  }
];
