import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface UserResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'user';
  status?: 'Active' | 'Inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/users';

  getAllUsers(
    params: UserQueryParams = {}
  ): Observable<UserResponse> {

    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }

    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit);
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.role) {
      httpParams = httpParams.set('role', params.role);
    }

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }

    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<UserResponse>(
      this.apiUrl,
      {
        params: httpParams
      }
    );
  }

  getUserById(id: string): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(
      `${this.apiUrl}/${id}`
    );
  }

  updateUserStatus(
    id: string,
    status: 'Active' | 'Inactive'
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/${id}/status`,
      { status }
    );
  }

  updateUserRole(
    id: string,
    role: 'admin' | 'user'
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/${id}/role`,
      { role }
    );
  }
}