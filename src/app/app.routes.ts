import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Settings } from './settings/settings';
import { Pages } from './pages/pages';
import { PreventivoContainerComponent } from './preventivo/preventivo-container';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'preventivo', component: PreventivoContainerComponent },
    { path: 'settings', component: Settings },
    { path: 'pages', component: Pages },
];
