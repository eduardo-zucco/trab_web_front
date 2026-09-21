import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';
import { UserGetModel } from '../models/user-get.model';
import { UpdateUserModel } from '../models/update-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  public findAll(): Observable<ApiResponse<UserGetModel[]>> {
    return this.apiService.get<UserGetModel[]>('users');
  }

  public getById(id: number): Observable<ApiResponse<UserGetModel>> {
    return this.apiService.getById<UserGetModel>('users', id);
  }

  public update(id: number, data: UpdateUserModel): Observable<ApiResponse<UserGetModel>> {
    return this.apiService.put<UserGetModel>('users', id, data);
  }

  public delete(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>('users', id);
  }
}
