import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { UserGetModel } from '../models/user-get.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  public findAll(): Observable<ApiResponse<UserGetModel[]>> {
    return this.apiService.get<UserGetModel[]>('users');
  }

  public delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>('users', id);
  }
}
