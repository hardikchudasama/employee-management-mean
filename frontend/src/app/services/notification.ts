import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messageService = inject(MessageService);

  success(message: string, summary = 'Success'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: message
    });
  }

  error(message: string, summary = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: message
    });
  }

  warn(message: string, summary = 'Warning'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: message
    });
  }

  info(message: string, summary = 'Info'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: message
    });
  }
}