import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import { UserService } from '../../services/user';
import { User } from '../../models/user.model';
import { UserDetailsDialog } from '../user-details-dialog/user-details-dialog';
import { ConfirmationService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-user-list',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    SelectModule,
    ConfirmDialogModule,
    UserDetailsDialog
  ],
  providers: [
    ConfirmationService
  ],

  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList implements OnInit {

  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private notificationService = inject(NotificationService);

  users: User[] = [];

  loading = false;

  // Search
  searchControl = new FormControl('');

  // Filters
  selectedRole: 'admin' | 'user' | null = null;

  selectedStatus: 'Active' | 'Inactive' | null = null;

  // Pagination
  currentPage = 1;

  pageSize = 10;

  first = 0;

  totalRecords = 0;

  // Sorting
  sortBy = 'createdAt';

  sortOrder: 'asc' | 'desc' = 'desc';

  // Role options
  roles = [
    {
      label: 'All Roles',
      value: null
    },
    {
      label: 'Admin',
      value: 'admin'
    },
    {
      label: 'User',
      value: 'user'
    }
  ];

  showDetailsDialog = false;
  selectedUserId: string | null = null;

  // Status options
  statuses = [
    {
      label: 'All Status',
      value: null
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


  ngOnInit(): void {

    this.setupSearch();

    this.loadUsers();
  }


  // Search
  setupSearch(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {

        this.currentPage = 1;

        this.first = 0;

        this.loadUsers();

      });
  }


  // Load users
  loadUsers(): void {

    this.loading = true;

    this.userService.getAllUsers({

      page: this.currentPage,

      limit: this.pageSize,

      search: this.searchControl.value || undefined,

      role: this.selectedRole || undefined,

      status: this.selectedStatus || undefined,

      sortBy: this.sortBy,

      sortOrder: this.sortOrder

    }).subscribe({

      next: (response) => {

        this.users = response.data;

        this.totalRecords =
          response.pagination.totalRecords;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });
  }


  // Role filter
  onRoleChange(): void {

    this.currentPage = 1;

    this.first = 0;

    this.loadUsers();

  }


  // Status filter
  onStatusChange(): void {

    this.currentPage = 1;

    this.first = 0;

    this.loadUsers();

  }


  // Pagination
  onPageChange(event: any): void {

    this.first = event.first;

    this.pageSize = event.rows;

    this.currentPage =
      Math.floor(event.first / event.rows) + 1;

    this.loadUsers();

  }


  // Sorting
  onSort(event: any): void {

    this.sortBy = event.field;

    this.sortOrder =
      event.order === 1 ? 'asc' : 'desc';

    this.currentPage = 1;

    this.first = 0;

    this.loadUsers();

  }

  viewUser(userId: string): void {
    this.selectedUserId = userId;
    this.showDetailsDialog = true;
  }

  toggleUserStatus(user: User): void {
    if (!user._id) {
      return;
    }

    const newStatus: 'Active' | 'Inactive' =
      user.status === 'Active' ? 'Inactive' : 'Active';

    const action = newStatus === 'Active' ? 'activate' : 'deactivate';

    this.confirmationService.confirm({
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} ${user.name}?`,
      icon: newStatus === 'Active'
        ? 'pi pi-check-circle'
        : 'pi pi-exclamation-triangle',
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

        this.userService
          .updateUserStatus(user._id!, newStatus)
          .subscribe({
            next: (response) => {
              this.notificationService.success(
                response.message || `User ${action}d successfully.`
              );

              this.loadUsers();
            },
            error: () => {
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            }
          });
      }
    });
  }

  changeUserRole(user: User): void {

  const newRole: 'admin' | 'user' =
    user.role === 'admin'
      ? 'user'
      : 'admin';

  const roleLabel =
    newRole === 'admin'
      ? 'Admin'
      : 'User';

  this.confirmationService.confirm({

    message:
      `Are you sure you want to change ${user.name}'s role to ${roleLabel}?`,

    header: 'Change User Role',

    icon: 'pi pi-user-edit',

    accept: () => {

      this.userService
        .updateUserRole(user._id!, newRole)
        .subscribe({

          next: (response) => {

            user.role = newRole;

            this.notificationService.success(
              response.message
            );

          }

        });

    }

  });
}


  // Reset filters
  resetFilters(): void {

    this.searchControl.setValue('');

    this.selectedRole = null;

    this.selectedStatus = null;

    this.currentPage = 1;

    this.first = 0;

    this.sortBy = 'createdAt';

    this.sortOrder = 'desc';

    this.loadUsers();

  }

}