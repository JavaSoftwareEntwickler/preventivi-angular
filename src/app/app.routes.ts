import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Preventivo } from './preventivo/preventivo';
import { Settings } from './settings/settings';
import { Pages } from './pages/pages';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'preventivo', component: Preventivo},
  { path: 'settings', component: Settings },
  { path: 'pages', component: Pages },
];
