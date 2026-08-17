import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { UserService } from '../../services/user';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-details-dialog',
  standalone: true,

  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ],

  templateUrl: './user-details-dialog.html',
  styleUrls: ['./user-details-dialog.scss']
})
export class UserDetailsDialog implements OnChanges {

  private userService = inject(UserService);

  @Input() visible = false;
  @Input() userId: string | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();

  user: User | null = null;

  loading = false;

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['visible']?.currentValue === true &&
      this.userId
    ) {
      this.loadUser();
    }
  }

  loadUser(): void {

    if (!this.userId) {
      return;
    }

    this.loading = true;
    this.user = null;

    this.userService.getUserById(this.userId).subscribe({

      next: (response) => {
        this.user = response.data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });
  }

  onClose(): void {
    this.visibleChange.emit(false);
  }
}