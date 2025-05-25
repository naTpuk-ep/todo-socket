import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../libs/features/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../libs/features/register/register.component')
      .then(c => c.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../libs/features/dashboard/dashboard.component')
      .then(c => c.DashboardComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
