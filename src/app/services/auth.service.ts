import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { CreateUserModel } from '../models/create-user.model';
import { UserResponse } from '../models/user-response.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  token: string | null = null;

  register(user: CreateUserModel): Observable<ApiResponse<UserResponse>> {
    return this.apiService.post<UserResponse>('register', user).pipe(
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
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token = null;
    this.toastService.info('Sessão encerrada.');
  }
}
