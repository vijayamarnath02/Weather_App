import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main-page',
    loadComponent: () => import('./mainpage/mainpage.component').then((m) => m.MainpageComponent),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcomescreen/welcomescreen.component').then((m) => m.WelcomescreenComponent)
  },
  {
    path: 'time',
    loadComponent: () => import('./timeview/timeview.component').then((m) => m.TimeviewComponent)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];
