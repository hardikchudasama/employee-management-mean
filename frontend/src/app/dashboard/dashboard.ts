import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardResponse, DashboardService } from '../services/dashboard';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, ChartModule, ProgressSpinnerModule, TableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  dashboardData: DashboardResponse['data'] | null = null;
  departmentChartData: any;
  departmentChartOptions: any;

  statusChartData: any;
  statusChartOptions: any;

  isLoading = true;
  hasError = false;
  errorMessage = 'Something went wrong while loading the dashboard.';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  get recentEmployees() {
    return this.dashboardData?.recentEmployees ?? [];
  }

  get totalEmployees() {
    return this.dashboardData?.totalEmployees ?? 0;
  }

  get activeEmployees() {
    return this.dashboardData?.activeEmployees ?? 0;
  }

  get inactiveEmployees() {
    return this.dashboardData?.inactiveEmployees ?? 0;
  }

  get departmentCount() {
    return this.dashboardData?.departmentCount ?? 0;
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getDashboardStats()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.dashboardData = response.data;
          this.setDepartmentChart();
          this.setStatusChart();
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = 'Unable to load the dashboard right now. Please try again.';
          this.dashboardData = null;
          console.error('Failed to load dashboard:', error);
        }
      });
  }

  private setDepartmentChart(): void {
    if (!this.dashboardData) {
      return;
    }

    this.departmentChartData = {
      labels: this.dashboardData.departmentStats.map(
        item => item.department
      ),
      datasets: [
        {
          label: 'Employees',
          data: this.dashboardData.departmentStats.map(
            item => item.count
          )
        }
      ]
    };

    this.departmentChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private setStatusChart(): void {
    if (!this.dashboardData) {
      return;
    }

    this.statusChartData = {
      labels: this.dashboardData.statusStats.map(
        item => item.status
      ),
      datasets: [
        {
          data: this.dashboardData.statusStats.map(
            item => item.count
          )
        }
      ]
    };

    this.statusChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

}