import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcomescreen/welcomescreen.component').then((m) => m.WelcomescreenComponent)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];
