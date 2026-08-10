import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule
  ],

  templateUrl: './employee-dialog.html',
  styleUrls: ['./employee-dialog.scss']
})
export class EmployeeDialog implements OnChanges {
  @Input() visible = false;
  @Input() employee: Employee | null = null;
  @Output() save = new EventEmitter<Employee>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  employeeForm: FormGroup;

  departments = [
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

  constructor(private fb: FormBuilder) {

    this.employeeForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      department: [
        '',
        Validators.required
      ],

      designation: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      salary: [
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      joiningDate: [
        null,
        Validators.required
      ]

    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.employee) {

      this.employeeForm.patchValue({
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        email: this.employee.email,
        phone: this.employee.phone,
        department: this.employee.department,
        designation: this.employee.designation,
        salary: this.employee.salary,
        joiningDate: this.employee.joiningDate
          ? new Date(this.employee.joiningDate)
          : null
      });

      this.employeeForm.markAsPristine();
      this.employeeForm.markAsUntouched();

    } else {

      this.employeeForm.reset();

      this.employeeForm.patchValue({
        salary: null
      });
    }
  }

  onSave(): void {

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;

    const payload: Employee = {
      ...formValue,

      joiningDate:
        formValue.joiningDate instanceof Date
          ? formValue.joiningDate.toISOString().slice(0, 10)
          : formValue.joiningDate
    };

    if (this.employee?._id) {
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