import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export class AppHttpError extends Error {
  constructor(
    public override message: string,
    public status: number,
    public errors?: string[] | null,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppHttpError';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocorreu um erro inesperado.';
      let errors: string[] | null | undefined = null;

      if (error.error instanceof ErrorEvent) {
        message = `Erro de conexão: ${error.error.message}`;
      } else if (error.error && typeof error.error === 'object') {
        const apiError = error.error as Partial<ApiResponse<null>>;
        message = apiError.message || message;
        errors = apiError.errors;
      } else {
        switch (error.status) {
          case 400:
            message = 'Requisição inválida (400).';
            break;
          case 401:
            message = 'Não autorizado (401). Faça login novamente.';
            break;
          case 403:
            message = 'Acesso negado (403).';
            break;
          case 404:
            message = 'Recurso não encontrado (404).';
            break;
          case 500:
            message = 'Ocorreu um erro interno no servidor (500).';
            break;
          default:
            message = error.statusText || message;
        }
      }

      console.error('[HTTP Error Interceptor]:', {
        status: error.status,
        message,
        errors,
        error
      });

      return throwError(() => new AppHttpError(message, error.status, errors, error));
    })
  );
};
