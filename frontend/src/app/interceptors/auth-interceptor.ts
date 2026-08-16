import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { Router } from '@angular/router';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const token = localStorage.getItem('token');

  // Don't attach token to login/refresh requests
  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/logout');

  if (isAuthRequest) {
    return next(
      req.clone({
        withCredentials: true
      })
    );
  }

  // No access token
  if (!token) {
    return next(req);
  }

  // Attach access token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // Only handle 401
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Access token expired → refresh token
      return authService.refreshToken().pipe(

        switchMap((response) => {

          const newToken = response.data.token;

          // Store new access token
          localStorage.setItem('token', newToken);

          // Retry original request with new token
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });

          return next(retryReq);
        }),

        catchError((refreshError) => {

          // Refresh token is invalid/expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          notificationService.error(
            'Your session has expired. Please login again.',
            'Session Expired'
          );

          router.navigate(['/login']);

          return throwError(() => refreshError);
        })
      );
    })
  );
};