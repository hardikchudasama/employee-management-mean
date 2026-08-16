import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  finalize
} from 'rxjs';

import {
  ConfirmationService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth';
import { EmployeeService } from '../../services/employee';
import { NotificationService } from '../../services/notification';
import { EmployeeDialog } from '../employee-dialog/employee-dialog';
import { Router } from '@angular/router';
import { EmployeeDetailsDialog } from '../employee-details-dialog/employee-details-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    EmployeeDialog,
    EmployeeDetailsDialog
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeList {

  private router = inject(Router);

  // Employee data
  employees: Employee[] = [];

  showDetailsDialog = false;
  selectedEmployeeId: string | null = null;

  // UI state
  loading = false;
  dialogVisible = false;
  selectedEmployee: Employee | null = null;
  isAdmin = false;

  // Search
  searchControl = new FormControl<string>('');
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  first = 0;
  totalRecords = 0;
  totalPages = 0;

  // Sorting
  sortBy = 'firstName';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Filters
  selectedDepartment = '';
  selectedStatus = '';

  // Department options
  departments = [
    { label: 'All Departments', value: '' },
    { label: 'IT', value: 'IT' },
    { label: 'HR', value: 'HR' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Marketing', value: 'Marketing' }
  ];

  // Status options
  statuses = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  // Initialization
  ngOnInit(): void {
    this.loadEmployees();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchTerm = value?.trim() || '';
        this.currentPage = 1;
        this.first = 0;
        this.loadEmployees();
      });
  }

  // Load employees
  loadEmployees(): void {
    this.loading = true;

    this.employeeService
      .getAllEmployees({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchTerm,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        department: this.selectedDepartment,
        status: this.selectedStatus
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: response => {
          this.employees = response.data || [];
          this.totalRecords = response.pagination?.totalRecords || 0;
          this.totalPages = response.pagination?.totalPages || 0;
        }
      });
  }

  // Search
  onSearch(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  // Pagination
  onPageChange(event: any): void {
    this.first = event.first;
    this.pageSize = event.rows;
    this.currentPage = event.page + 1;

    this.loadEmployees();
  }

  // Sorting
  onSort(event: any): void {
    if (!event.field) {
      return;
    }

    this.sortBy = event.field;

    /*
     * PrimeNG:
     *  1  = ascending
     * -1  = descending
     */
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }

  // Department filter
  onDepartmentChange(): void {
    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }

  // Status filter
  onStatusChange(): void {
    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }

  // Reset filters
  resetFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }

  // Add employee
  openAdd(): void {
    this.selectedEmployee = null;
    this.dialogVisible = true;
  }

  // Edit employee
  openEdit(employee: Employee): void {
    this.selectedEmployee = {
      ...employee
    };

    this.dialogVisible = true;
  }

  // Cancel dialog
  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  // Create or update employee
  onDialogSave(payload: Employee): void {
    this.loading = true;

    if (payload._id) {
      this.updateEmployee(payload);
    } else {
      this.createEmployee(payload);
    }
  }

  // Update employee
  private updateEmployee(payload: Employee): void {
    this.employeeService
      .updateEmployee(payload._id!, payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Employee updated successfully.'
          );

          this.dialogVisible = false;
          this.loadEmployees();
        }
      });
  }

  // Create employee
  private createEmployee(payload: Employee): void {
    this.employeeService
      .createEmployee(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Employee created successfully.'
          );

          this.dialogVisible = false;
          this.loadEmployees();
        }
      });
  }

  // Activate / deactivate employee
  toggleEmployeeStatus(employee: Employee): void {
    if (!employee._id) {
      return;
    }

    const newStatus =
      employee.status === 'Active'
        ? 'Inactive'
        : 'Active';

    const action =
      newStatus === 'Active'
        ? 'activate'
        : 'deactivate';

    this.confirmationService.confirm({
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} Employee`,

      message:
        `Are you sure you want to ${action} ` +
        `${employee.firstName} ${employee.lastName}?`,

      acceptButtonProps: {
        label: action.charAt(0).toUpperCase() + action.slice(1),
        severity: newStatus === 'Active' ? 'success' : 'warn'
      },

      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary'
      },

      accept: () => {
        this.loading = true;

        this.employeeService
          .updateEmployeeStatus(employee._id!, newStatus)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe({
            next: () => {
              this.notificationService.success(
                `Employee ${action}d successfully.`
              );

              this.loadEmployees();
            }
          });
      }
    });
  }

  // Delete employee
  confirmDelete(employee: Employee): void {
    this.confirmationService.confirm({
      header: 'Delete Employee',

      message:
        `Are you sure you want to delete ` +
        `${employee.firstName} ${employee.lastName}?`,

      acceptButtonProps: {
        label: 'Yes',
        severity: 'danger'
      },

      rejectButtonProps: {
        label: 'No',
        severity: 'secondary'
      },

      accept: () => {
        if (!employee._id) {
          return;
        }

        this.loading = true;

        this.employeeService
          .deleteEmployee(employee._id)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Employee deleted successfully.'
              );

              this.loadEmployees();
            }
          });
      }
    });
  }

  viewEmployee(id: string): void {
  this.selectedEmployeeId = id;
  this.showDetailsDialog = true;
}
}