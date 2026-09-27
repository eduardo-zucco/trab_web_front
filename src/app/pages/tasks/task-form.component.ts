import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  public taskForm!: FormGroup;
  public isLoading = false;
  public isSubmitting = false;
  public editMode = false;
  public taskId: number | null = null;

  public readonly statusOptions = ['Pendente', 'Em Andamento', 'Concluida'];
  public readonly priorityOptions = ['Baixa', 'Media', 'Alta'];

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      status: ['Pendente', Validators.required],
      priority: ['Media', Validators.required],
      dueDate: [null],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  private loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const t = res.data;
          this.taskForm.patchValue({
            title: t.title,
            description: t.description ?? '',
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate ? t.dueDate.substring(0, 10) : null,
          });
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastService.error('Não foi possível carregar a tarefa.');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  public submitForm(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.taskForm.value;

    const obs = this.editMode && this.taskId
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    obs.subscribe({
      next: (res) => {
        this.toastService.success(
          this.editMode ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!'
        );
        this.isSubmitting = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
