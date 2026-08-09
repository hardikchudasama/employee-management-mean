import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EmployeeDialog } from '../employee-dialog/employee-dialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, FormsModule, DialogModule, InputTextModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, EmployeeDialog],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
})
export class EmployeeList {
  employees: Employee[] = [];
  filtered: Employee[] = [];
  loading = false;
  dialogVisible = false;
  selectedEmployee: Employee | null = null;
  searchTerm = '';

  constructor(private employeeService: EmployeeService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.data || [];
        this.filtered = [...this.employees];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({severity: 'error', summary: 'Load failed', detail: 'Failed to load employees.'});
        console.error('Failed to load employees:', error);
      }
    });
  }

  applyFilter(): void {
    const q = this.searchTerm?.toLowerCase().trim();
    if (!q) {
      this.filtered = [...this.employees];
      return;
    }
    this.filtered = this.employees.filter(e =>
      (e.firstName + ' ' + e.lastName).toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }

  openAdd(): void {
    this.selectedEmployee = null;
    this.dialogVisible = true;
  }

  openEdit(emp: Employee): void {
    this.selectedEmployee = {...emp};
    this.dialogVisible = true;
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  onDialogSave(payload: Employee): void {
    this.loading = true;
    if (payload._id) {
      // update
      this.employeeService.updateEmployee(payload._id, payload).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Updated', detail: 'Employee updated successfully.'});
          this.dialogVisible = false;
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({severity: 'error', summary: 'Update failed', detail: 'Failed to update employee.'});
          console.error(err);
        }
      });
    } else {
      // create
      this.employeeService.createEmployee(payload).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Created', detail: 'Employee created successfully.'});
          this.dialogVisible = false;
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({severity: 'error', summary: 'Create failed', detail: 'Failed to create employee.'});
          console.error(err);
        }
      });
    }
  }

  confirmDelete(emp: Employee): void {
    this.confirmationService.confirm({
  header: 'Delete Employee',

  message: `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`,

  acceptButtonProps: {
    label: 'Yes',
    severity: 'danger'
  },

  rejectButtonProps: {
    label: 'No',
    severity: 'secondary'
  },

  accept: () => {
    this.loading = true;

    if (emp._id) {
      this.employeeService.deleteEmployee(emp._id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Employee deleted.'
          });

          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Delete failed',
            detail: 'Failed to delete employee.'
          });

          console.error(err);
        }
      });
    }
  }
});
  }
}
