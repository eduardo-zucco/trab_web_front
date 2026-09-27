import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { TaskModel, TaskSummaryModel } from '../../models/task.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  public summary: TaskSummaryModel = {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    recentTasks: []
  };
  public isLoading: boolean = false;
  public isMockMode: boolean = false;

  public get currentUser() {
    return this.authService.getCurrentUser();
  }

  public get currentHour(): number {
    return new Date().getHours();
  }

  public get greeting(): string {
    const h = this.currentHour;
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  ngOnInit(): void {
    this.loadSummary();
  }

  public loadSummary(): void {
    this.isLoading = true;
    this.taskService.getSummary().pipe(
      catchError(() => {
        this.isMockMode = true;
        this.isLoading = false;
        this.cdr.markForCheck();
        return of(null);
      })
    ).subscribe((response) => {
      if (!response) return;
      if (response.data) {
        this.summary = response.data;
        if (response.message?.includes('Local')) {
          this.isMockMode = true;
          this.toastService.info('Exibindo dados de exemplo (API indisponível).');
        }
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Concluida':
      case 'Concluída':
        return 'badge bg-success';
      case 'Em Andamento':
        return 'badge bg-primary';
      case 'Pendente':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  public getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Alta': return 'badge bg-danger';
      case 'Media': return 'badge bg-info text-dark';
      case 'Baixa': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }
}
