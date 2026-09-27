import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CreateTaskModel, TaskModel, TaskSummaryModel, UpdateTaskModel } from '../models/task.model';
import { MOCK_TASKS } from '../mocks/task.mock';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiService = inject(ApiService);
  private localMockTasks: TaskModel[] = [...MOCK_TASKS];

  public getTasks(status?: string, priority?: string, search?: string): Observable<ApiResponse<TaskModel[]>> {
    let endpoint = 'tasks';
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.apiService.get<TaskModel[]>(endpoint).pipe(
      catchError(() => {
        let filtered = [...this.localMockTasks];
        if (status) {
          filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
        }
        if (priority) {
          filtered = filtered.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
        }
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s)));
        }
        return of({
          data: filtered,
          message: 'Tarefas obtidas (Modo Local)',
          success: true
        });
      })
    );
  }

  public getById(id: number): Observable<ApiResponse<TaskModel>> {
    return this.apiService.getById<TaskModel>('tasks', id).pipe(
      catchError(() => {
        const found = this.localMockTasks.find(t => t.id === id) || this.localMockTasks[0];
        return of({
          data: found,
          message: 'Tarefa obtida (Modo Local)',
          success: true
        });
      })
    );
  }

  public create(data: CreateTaskModel): Observable<ApiResponse<TaskModel>> {
    return this.apiService.post<TaskModel>('tasks', data).pipe(
      catchError(() => {
        const newTask: TaskModel = {
          id: this.localMockTasks.length ? Math.max(...this.localMockTasks.map(t => t.id)) + 1 : 1,
          title: data.title,
          description: data.description,
          status: data.status || 'Pendente',
          priority: data.priority || 'Media',
          dueDate: data.dueDate,
          createdAt: new Date().toISOString()
        };
        this.localMockTasks.unshift(newTask);
        return of({
          data: newTask,
          message: 'Tarefa criada com sucesso! (Modo Local)',
          success: true
        });
      })
    );
  }

  public update(id: number, data: UpdateTaskModel): Observable<ApiResponse<TaskModel>> {
    return this.apiService.put<TaskModel>('tasks', id, data).pipe(
      catchError(() => {
        const index = this.localMockTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.localMockTasks[index] = {
            ...this.localMockTasks[index],
            ...data,
            updatedAt: new Date().toISOString()
          };
          return of({
            data: this.localMockTasks[index],
            message: 'Tarefa atualizada com sucesso! (Modo Local)',
            success: true
          });
        }
        throw new Error('Tarefa não encontrada');
      })
    );
  }

  public updateStatus(id: number, status: string): Observable<ApiResponse<TaskModel>> {
    return this.apiService.patch<TaskModel, { status: string }>('tasks', `${id}/status`, { status }).pipe(
      catchError(() => {
        const index = this.localMockTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.localMockTasks[index].status = status;
          this.localMockTasks[index].updatedAt = new Date().toISOString();
          return of({
            data: this.localMockTasks[index],
            message: 'Status atualizado com sucesso! (Modo Local)',
            success: true
          });
        }
        throw new Error('Tarefa não encontrada');
      })
    );
  }

  public delete(id: number): Observable<ApiResponse<boolean>> {
    return this.apiService.delete<boolean>('tasks', id).pipe(
      catchError(() => {
        this.localMockTasks = this.localMockTasks.filter(t => t.id !== id);
        return of({
          data: true,
          message: 'Tarefa excluída com sucesso! (Modo Local)',
          success: true
        });
      })
    );
  }

  public getSummary(): Observable<ApiResponse<TaskSummaryModel>> {
    return this.apiService.get<TaskSummaryModel>('tasks/summary').pipe(
      catchError(() => {
        const total = this.localMockTasks.length;
        const pending = this.localMockTasks.filter(t => t.status === 'Pendente').length;
        const inProgress = this.localMockTasks.filter(t => t.status === 'Em Andamento').length;
        const completed = this.localMockTasks.filter(t => t.status === 'Concluida' || t.status === 'Concluída').length;
        const recent = this.localMockTasks.slice(0, 5);

        return of({
          data: {
            totalTasks: total,
            pendingTasks: pending,
            inProgressTasks: inProgress,
            completedTasks: completed,
            recentTasks: recent
          },
          message: 'Resumo carregado (Modo Local)',
          success: true
        });
      })
    );
  }
}
