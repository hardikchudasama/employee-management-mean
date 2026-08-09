import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/employee.model';

interface EmployeeResponse {
  success: boolean;
  data: Employee[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.apiUrl);
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