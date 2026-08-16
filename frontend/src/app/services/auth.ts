import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}


interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'user';
    };
  };
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/auth';

  register(
    credentials: RegisterRequest
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      credentials
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials,
      {
        withCredentials: true
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }
    );
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user).role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  refreshToken() {
    return this.http.post<any>(
      `${this.apiUrl}/refresh`,
      {},
      {
        withCredentials: true
      }
    );
  }
}