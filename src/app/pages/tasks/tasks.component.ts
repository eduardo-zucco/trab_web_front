import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  public tasks: TaskModel[] = [];
  public isLoading = false;
  public isMockMode = false;
  public searchTerm = '';
  public statusFilter = '';
  public priorityFilter = '';

  public taskToDelete: TaskModel | null = null;
  public isDeleting = false;

  public statusOptions = ['Pendente', 'Em Andamento', 'Concluida'];
  public priorityOptions = ['Baixa', 'Media', 'Alta'];

  public get filteredTasks(): TaskModel[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.tasks.filter(t => {
      const matchSearch = !term || t.title.toLowerCase().includes(term)
        || (t.description && t.description.toLowerCase().includes(term));
      const matchStatus = !this.statusFilter || t.status === this.statusFilter;
      const matchPriority = !this.priorityFilter || t.priority === this.priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res.data ?? [];
        this.isMockMode = res.message?.includes('Local') ?? false;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  public clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
  }

  public openDeleteModal(task: TaskModel): void {
    this.taskToDelete = task;
  }

  public closeDeleteModal(): void {
    if (!this.isDeleting) this.taskToDelete = null;
  }

  public confirmDelete(): void {
    if (!this.taskToDelete) return;
    const task = this.taskToDelete;
    this.isDeleting = true;
    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.toastService.success(`Tarefa "${task.title}" excluída com sucesso!`);
        this.isDeleting = false;
        this.taskToDelete = null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isDeleting = false;
        this.cdr.markForCheck();
      }
    });
  }

  public updateStatus(task: TaskModel, newStatus: string): void {
    this.taskService.updateStatus(task.id, newStatus).subscribe({
      next: (res) => {
        if (res.data) {
          const idx = this.tasks.findIndex(t => t.id === task.id);
          if (idx !== -1) this.tasks[idx] = res.data;
        }
        this.toastService.success('Status atualizado!');
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Concluida': case 'Concluída': return 'badge bg-success';
      case 'Em Andamento': return 'badge bg-primary';
      case 'Pendente': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
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
