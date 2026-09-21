import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserGetModel } from '../../models/user-get.model';
import { MOCK_USERS } from '../../mocks/user.mock';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  public users: UserGetModel[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public isMockMode: boolean = false;
  public userToDelete: UserGetModel | null = null;
  public isDeleting: boolean = false;
  public userToEdit: UserGetModel | null = null;
  public editForm = { userName: '', email: '', password: '' };
  public isEditing: boolean = false;
  public errorMessage: string = '';

  public get filteredUsers(): UserGetModel[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.users;
    }
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.id.toString().includes(term),
    );
  }

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.findAll().pipe(
      catchError(() => {
        this.users = [...MOCK_USERS];
        this.isMockMode = true;
        this.isLoading = false;
        this.toastService.info('API indisponível: carregando dados mockados para testes.');
        this.cdr.markForCheck();
        return of(null);
      })
    ).subscribe((response) => {
      if (response === null) return;

      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        this.users = response.data;
        this.isMockMode = false;
      } else {
        this.users = [...MOCK_USERS];
        this.isMockMode = true;
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  public openDeleteModal(user: UserGetModel): void {
    this.userToDelete = user;
  }

  public closeDeleteModal(): void {
    if (!this.isDeleting) {
      this.userToDelete = null;
    }
  }

  public confirmDelete(): void {
    if (!this.userToDelete) return;
    const user = this.userToDelete;

    this.isDeleting = true;
    this.userService.delete(user.id).pipe(
      catchError(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.toastService.success(`Usuário "${user.name}" excluído com sucesso! (Modo Mock)`);
        this.isDeleting = false;
        this.userToDelete = null;
        this.cdr.markForCheck();
        return of(null);
      })
    ).subscribe((response) => {
      if (response === null) return;

      this.users = this.users.filter((u) => u.id !== user.id);
      this.toastService.success(`Usuário "${user.name}" excluído com sucesso!`);
      this.isDeleting = false;
      this.userToDelete = null;
      this.cdr.markForCheck();
    });
  }

  public resetMockData(): void {
    this.users = [...MOCK_USERS];
    this.isMockMode = true;
    this.toastService.info('Dados mockados restaurados.');
    this.cdr.markForCheck();
  }

  public openEditModal(user: UserGetModel): void {
    this.userToEdit = user;
    this.editForm = {
      userName: user.name,
      email: user.email,
      password: ''
    };
  }

  public closeEditModal(): void {
    if (!this.isEditing) {
      this.userToEdit = null;
    }
  }

  public saveEdit(): void {
    if (!this.userToEdit) return;
    
    if (!this.editForm.userName || !this.editForm.email) {
      this.toastService.error('Nome e E-mail são obrigatórios.');
      return;
    }

    const userId = this.userToEdit.id;
    const payload = {
      userName: this.editForm.userName,
      email: this.editForm.email,
      password: this.editForm.password || undefined
    };

    this.isEditing = true;

    this.userService.update(userId, payload).subscribe({
      next: (response) => {
        if (response && response.data) {
          const index = this.users.findIndex(u => u.id === userId);
          if (index !== -1) {
            this.users[index] = response.data;
          }
        }
        this.toastService.success(`Usuário "${payload.userName}" atualizado com sucesso!`);
        this.isEditing = false;
        this.userToEdit = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (this.isMockMode) {
          const index = this.users.findIndex(u => u.id === userId);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], name: payload.userName, email: payload.email };
          }
          this.toastService.success(`Usuário "${payload.userName}" atualizado com sucesso! (Modo Mock)`);
          this.isEditing = false;
          this.userToEdit = null;
        } else {
          this.isEditing = false;
        }
        this.cdr.markForCheck();
      }
    });
  }

  public getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  public getAvatarBgColor(id: number): string {
    const colors = [
      'bg-indigo-500 text-white',
      'bg-blue-500 text-white',
      'bg-emerald-500 text-white',
      'bg-violet-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-cyan-500 text-white',
    ];
    return colors[id % colors.length];
  }
}
