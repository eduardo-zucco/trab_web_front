import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { UserResponse } from '../models/user-response.model';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { UserGetModel } from '../models/user-get.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public findAll(): Observable<ApiResponse<UserGetModel[]>> {
    return this.apiService.get<UserGetModel[]>('users');
  }

  public delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>('users', id);
  }
}
