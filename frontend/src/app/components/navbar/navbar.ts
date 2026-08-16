import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: any = null;

  constructor() {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
    }
  }

  logout(): void {
  this.authService.logout()
    .pipe(
      finalize(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.router.navigate(['/login']);
      })
    )
    .subscribe();
}
}