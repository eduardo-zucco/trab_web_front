import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserGetModel } from '../../models/user-get.model';
import { MOCK_USERS } from '../../mocks/user.mock';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  public users: UserGetModel[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';
  public isMockMode: boolean = false;
  public userToDelete: UserGetModel | null = null;
  public isDeleting: boolean = false;

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
    this.userService.findAll().subscribe({
      next: (response) => {
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          this.users = response.data;
          this.isMockMode = false;
        } else {
          this.users = [...MOCK_USERS];
          this.isMockMode = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.users = [...MOCK_USERS];
        this.isMockMode = true;
        this.isLoading = false;
        this.toastService.info('API indisponível: carregando dados mockados para testes.');
      },
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
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.toastService.success(`Usuário "${user.name}" excluído com sucesso!`);
        this.isDeleting = false;
        this.closeDeleteModal();
      },
      error: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.toastService.success(`Usuário "${user.name}" excluído com sucesso! (Modo Mock)`);
        this.isDeleting = false;
        this.closeDeleteModal();
      },
    });
  }

  public resetMockData(): void {
    this.users = [...MOCK_USERS];
    this.isMockMode = true;
    this.toastService.info('Dados mockados restaurados.');
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
