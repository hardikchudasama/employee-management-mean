import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-details-dialog',
  imports: [DialogModule,
    ButtonModule,
    DatePipe],
  templateUrl: './employee-details-dialog.html',
  styleUrl: './employee-details-dialog.scss',
})
export class EmployeeDetailsDialog {
private employeeService = inject(EmployeeService);

  @Input() visible = false;
  @Input() employeeId: string | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();

  employee: Employee | null = null;
  loading = false;

  onShow(): void {
    if (!this.employeeId) {
      return;
    }

    this.loading = true;
    this.employee = null;

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (response) => {
        this.employee = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
