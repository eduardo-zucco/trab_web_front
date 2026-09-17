import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AppHttpError } from '../interceptors/error.interceptor';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  public readonly toasts = this.toastsSignal.asReadonly();
  private nextId = 1;

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = this.nextId++;
    const toast: ToastMessage = { id, message, type, duration };

    this.toastsSignal.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4500): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  remove(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toastsSignal.set([]);
  }

  handleError(error: unknown, fallbackMessage = 'Ocorreu um erro inesperado'): void {
    let message = fallbackMessage;

    if (error instanceof AppHttpError) {
      if (Array.isArray(error.errors) && error.errors.length > 0) {
        message = error.errors.join(' | ');
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        message = 'Não foi possível conectar ao servidor. Verifique se a API está online.';
      } else if (error.error) {
        if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.error.message) {
          message = error.error.message;
        } else if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          message = error.error.errors.join(' | ');
        } else if (error.status === 400) {
          message = 'Dados inválidos. Verifique as informações preenchidas.';
        } else if (error.status === 401) {
          message = 'Não autorizado. Verifique suas credenciais.';
        } else if (error.status === 403) {
          message = 'Acesso negado.';
        } else if (error.status === 404) {
          message = 'Recurso não encontrado.';
        } else if (error.status >= 500) {
          message = 'Erro interno do servidor. Tente novamente mais tarde.';
        }
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    this.error(message);
  }
}
