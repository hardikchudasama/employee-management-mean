import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';

export interface DepartmentStats {
  department: string;
  count: number;
}

export interface StatusStats {
  status: 'Active' | 'Inactive';
  count: number;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    departmentCount: number;
    departmentStats: DepartmentStats[];
    recentEmployees: Employee[];
    statusStats: StatusStats[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }
}