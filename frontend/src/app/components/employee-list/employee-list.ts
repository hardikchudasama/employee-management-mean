import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee.model';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { EmployeeDialog } from '../employee-dialog/employee-dialog';

import {
  MessageService,
  ConfirmationService
} from 'primeng/api';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

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

    EmployeeDialog
  ],

  providers: [
    MessageService,
    ConfirmationService
  ],

  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeList {

  // ================================
  // Employee Data
  // ================================

  employees: Employee[] = [];


  // ================================
  // UI State
  // ================================

  loading = false;

  dialogVisible = false;

  selectedEmployee: Employee | null = null;


  // ================================
  // Search
  // ================================

  searchControl = new FormControl<string>('');

  searchTerm = '';


  // ================================
  // Pagination
  // ================================

  currentPage = 1;

  pageSize = 10;
  first = 0;

  totalRecords = 0;

  totalPages = 0;


  // ================================
  // Sorting
  // ================================

  sortBy = 'firstName';

  sortOrder: 'asc' | 'desc' = 'asc';


  // ================================
  // Filters
  // ================================

  selectedDepartment = '';

  selectedStatus = '';


  // ================================
  // Dropdown Options
  // ================================

  departments = [
    {
      label: 'All Departments',
      value: ''
    },
    {
      label: 'IT',
      value: 'IT'
    },
    {
      label: 'HR',
      value: 'HR'
    },
    {
      label: 'Finance',
      value: 'Finance'
    },
    {
      label: 'Sales',
      value: 'Sales'
    },
    {
      label: 'Marketing',
      value: 'Marketing'
    }
  ];


  statuses = [
    {
      label: 'All Status',
      value: ''
    },
    {
      label: 'Active',
      value: 'Active'
    },
    {
      label: 'Inactive',
      value: 'Inactive'
    }
  ];


  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  // ================================
  // Initialization
  // ================================

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


  // ================================
  // Load Employees
  // ================================

  loadEmployees(): void {

    this.loading = true;

    this.employeeService.getAllEmployees({

      page: this.currentPage,

      limit: this.pageSize,

      search: this.searchTerm,

      sortBy: this.sortBy,

      sortOrder: this.sortOrder,

      department: this.selectedDepartment,

      status: this.selectedStatus

    }).subscribe({

      next: (response) => {

        this.employees = response.data || [];

        this.totalRecords =
          response.pagination?.totalRecords || 0;

        this.totalPages =
          response.pagination?.totalPages || 0;

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Failed to load employees.'
        });

        console.error(
          'Failed to load employees:',
          error
        );
      }

    });
  }


  // ================================
  // Search
  // ================================

  onSearch(): void {

    this.currentPage = 1;

    this.loadEmployees();
  }


  // ================================
  // Pagination
  // ================================

  onPageChange(event: any): void {
  this.first = event.first;
  this.pageSize = event.rows;
  this.currentPage = event.page + 1;

  this.loadEmployees();
  }


  // ================================
  // Sorting
  // ================================

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

    this.sortOrder =
      event.order === 1
        ? 'asc'
        : 'desc';

    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }


  // ================================
  // Department Filter
  // ================================

  onDepartmentChange(): void {

    this.currentPage = 1;
    this.first = 0;

    this.loadEmployees();
  }


  // ================================
  // Status Filter
  // ================================

  onStatusChange(): void {

    this.currentPage = 1;
 this.first = 0;
    this.loadEmployees();
  }


  // ================================
  // Reset Filters
  // ================================

  resetFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.first = 0;
    this.loadEmployees();
  }


  // ================================
  // Add Employee
  // ================================

  openAdd(): void {

    this.selectedEmployee = null;

    this.dialogVisible = true;
  }


  // ================================
  // Edit Employee
  // ================================

  openEdit(employee: Employee): void {

    this.selectedEmployee = {
      ...employee
    };

    this.dialogVisible = true;
  }


  // ================================
  // Cancel Dialog
  // ================================

  onDialogCancel(): void {

    this.dialogVisible = false;
  }


  // ================================
  // Create / Update Employee
  // ================================

  onDialogSave(payload: Employee): void {

    this.loading = true;


    // =================================
    // Update Employee
    // =================================

    if (payload._id) {

      this.employeeService
        .updateEmployee(
          payload._id,
          payload
        )
        .subscribe({

          next: () => {

            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail:
                'Employee updated successfully.'
            });

            this.dialogVisible = false;

            this.loadEmployees();
          },

          error: (error) => {

            this.loading = false;

            this.messageService.add({
              severity: 'error',
              summary: 'Update failed',
              detail: this.getBackendErrorMessage(error)
            });

            console.error(
              'Update failed:',
              error
            );
          }

        });

    }


    // =================================
    // Create Employee
    // =================================

    else {

      this.employeeService
        .createEmployee(payload)
        .subscribe({

          next: () => {

            this.messageService.add({
              severity: 'success',
              summary: 'Created',
              detail:
                'Employee created successfully.'
            });

            this.dialogVisible = false;

            this.loadEmployees();
          },

          error: (error) => {

            this.loading = false;

            this.messageService.add({
              severity: 'error',
              summary: 'Create failed',
              detail: this.getBackendErrorMessage(error)
            });

            console.error(
              'Create failed:',
              error
            );
          }

        });
    }
  }

  private getBackendErrorMessage(error: any): string {

  if (error.error?.errors) {

    return Object.values(error.error.errors).join(', ');
  }

  return error.error?.message || 'Something went wrong.';
}

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
        .updateEmployeeStatus(
          employee._id!,
          newStatus
        )
        .subscribe({

          next: () => {

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                `Employee ${action}d successfully.`
            });

            this.loadEmployees();
          },

          error: (error) => {

            this.loading = false;

            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail:
                `Failed to ${action} employee.`
            });

            console.error(error);
          }

        });
    }
  });
}


  // ================================
  // Delete Employee
  // ================================

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
          .subscribe({

            next: () => {

              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail:
                  'Employee deleted successfully.'
              });

              this.loadEmployees();
            },

            error: (error) => {

              this.loading = false;

              this.messageService.add({
                severity: 'error',
                summary: 'Delete failed',
                detail:
                  'Failed to delete employee.'
              });

              console.error(
                'Delete failed:',
                error
              );
            }

          });
      }

    });
  }
}
