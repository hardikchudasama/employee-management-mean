import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';

function getBackendErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.errors) {
    return Object.values(error.error.errors).join(', ');
  }

  return error.error?.message || 'Something went wrong.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      switch (error.status) {

        case 401:
          notificationService.error(
            error.error?.message ||
            'Unauthorize user. Please login to continue.',
            'Access Denied'
          );
          break;

        case 403:
          notificationService.error(
            error.error?.message ||
            'You do not have permission to perform this action.',
            'Access Denied'
          );
          break;

        case 404:
          notificationService.error(
            error.error?.message ||
            'Requested resource was not found.',
            'Not Found'
          );
          break;

        case 409:
          console.log("innn");
          
          notificationService.error(
            error.error?.message || 'This email is already registered.',
            'Registration Failed'
          );
          break;

        case 400:
        case 422:
          notificationService.error(
            getBackendErrorMessage(error),
            'Validation Error'
          );
          break;

        case 500:
          notificationService.error(
            'Something went wrong on the server.',
            'Server Error'
          );
          break;

        default:
          notificationService.error(
            'Something went wrong. Please try again.',
            'Error'
          );
      }

      return throwError(() => error);
    })
  );
};