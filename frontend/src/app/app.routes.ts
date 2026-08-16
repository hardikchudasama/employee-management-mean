import { Routes } from '@angular/router';

import { EmployeeList } from './components/employee-list/employee-list';
import { Layout } from './components/layout/layout';
import { Login } from './components/login/login';

import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Register } from './components/register/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },

  // Protected routes
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'employees',
        component: EmployeeList
      }
    ]
  },

  // Guest routes
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  }
];