import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  protected readonly baseUrl = `${environment.apiUrl}`;

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
    });
  }

  getById<T>(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  post<T, B = unknown>(endpoint: string, body: B): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body);
  }

  put<T, B = unknown>(endpoint: string, id: string | number, body: B): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, body);
  }

  patch<T, B = unknown>(
    endpoint: string,
    id: string | number,
    body: Partial<B>,
  ): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, body);
  }

  delete<T>(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
