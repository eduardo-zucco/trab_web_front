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
    this.token = null;
    this.toastService.info('Sessão encerrada.');
    this.router.navigate(['/login']);
  }
}
