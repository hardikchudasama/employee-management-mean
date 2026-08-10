import { Routes } from '@angular/router';
import { EmployeeList } from './components/employee-list/employee-list';
import { Layout } from './components/layout/layout';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
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
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },
];