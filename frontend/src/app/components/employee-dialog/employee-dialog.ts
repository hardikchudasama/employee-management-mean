import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DialogModule, ButtonModule, InputTextModule, DatePickerModule],
  templateUrl: './employee-dialog.html',
  styleUrls: ['./employee-dialog.scss']
})
export class EmployeeDialog {
  @Input() visible = false;
  @Input() employee: Employee | null = null;
  @Output() save = new EventEmitter<Employee>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      joiningDate: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.employee) {
      this.form.patchValue({
        ...this.employee,
        joiningDate: this.employee.joiningDate ? new Date(this.employee.joiningDate) : ''
      });
    } else {
      this.form.reset();
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Employee = {
      ...this.form.value,
      joiningDate: this.form.value.joiningDate instanceof Date ? this.form.value.joiningDate.toISOString().slice(0,10) : this.form.value.joiningDate
    };

    if (this.employee && this.employee._id) {
      payload._id = this.employee._id;
    }

    this.save.emit(payload);
  }

  onClose(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  onHide(): void {
    this.visibleChange.emit(false);
  }
}
