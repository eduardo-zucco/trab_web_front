import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { CreateUserModel } from '../models/create-user.model';
import { UserResponse } from '../models/user-response.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginModel } from '../models/login.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  token: string | null = null;

  register(user: CreateUserModel): Observable<ApiResponse<UserResponse>> {
    return this.apiService.post<UserResponse>('users/register', user).pipe(
      tap({
        next: (response) => {
          if (response.data?.token) {
            this.token = response.data.token;
            this.saveToken(this.token);
            this.saveCurrentUser(response.data);
          }
          this.toastService.success(response.message || 'Conta criada com sucesso!');
        },
        error: (error) => {
          this.toastService.handleError(error, 'Erro ao criar conta. Tente novamente.');
        },
      }),
    );
  }

  login(credentials: LoginModel, remember?: boolean): Observable<ApiResponse<UserResponse>> {
    return this.apiService.post<UserResponse>('users/login', credentials).pipe(
      tap({
        next: (response) => {
          if (response.data?.token) {
            this.token = response.data.token;
            this.saveToken(this.token, remember);
            this.saveCurrentUser(response.data, remember);
          }
          this.toastService.success(response.message || 'Logado com sucesso!');
        },
        error: (error) => {
          this.toastService.handleError(error, 'Erro ao logar. Tente novamente.');
        },
      }),
    );
  }

  saveToken(token: string, remember?: boolean): void {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    sessionStorage.setItem('token', token);
  }

  saveCurrentUser(user: UserResponse, remember?: boolean): void {
    const data = JSON.stringify(user);
    if (remember) {
      localStorage.setItem('currentUser', data);
    } else {
      localStorage.removeItem('currentUser');
    }
    sessionStorage.setItem('currentUser', data);
  }

  getCurrentUser(): UserResponse | null {
    const raw = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  updateCurrentUser(user: Partial<UserResponse>): void {
    const current = this.getCurrentUser();
    if (current) {
      const updated = { ...current, ...user };
      const raw = JSON.stringify(updated);
      if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', raw);
      }
      sessionStorage.setItem('currentUser', raw);
    }
  }

  getToken(): string | null {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    this.token = token;
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.token = null;
    this.toastService.info('Sessão encerrada.');
    this.router.navigate(['/login']);
  }
}
