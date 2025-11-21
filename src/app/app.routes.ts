import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Settings } from './settings/settings';
import { Pages } from './pages/pages';
import { PreventivoPage } from './preventivo/preventivo.page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'preventivo', component: PreventivoPage},
  { path: 'settings', component: Settings },
  { path: 'pages', component: Pages },
];
