import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';



export interface EmployeeResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  department?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environment.apiUrl + '/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(params: EmployeeQueryParams = {}): Observable<EmployeeResponse> {

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

    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }

    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    if (params.department) {
      httpParams = httpParams.set('department', params.department);
    }

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<EmployeeResponse>(
      this.apiUrl,
      { params: httpParams }
    );
  }

  updateEmployeeStatus(
  id: string,
  status: 'Active' | 'Inactive'
): Observable<any> {
  return this.http.patch(
    `${this.apiUrl}/${id}/status`,
    { status }
  );
}

  createEmployee(payload: Employee): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  updateEmployee(id: string, payload: Employee): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}