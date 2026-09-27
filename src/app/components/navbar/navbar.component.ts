import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  public isMenuOpen = false;

  readonly navLinks = [
    { label: 'Painel Principal', path: '/', icon: 'bi-speedometer2' },
    { label: 'Lista de Tarefas', path: '/tasks', icon: 'bi-check2-square' },
    { label: 'Nova Tarefa', path: '/tasks/new', icon: 'bi-plus-circle' },
    { label: 'Perfil', path: '/profile', icon: 'bi-person-circle' }
  ];

  public get currentUser() {
    return this.authService.getCurrentUser();
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu(): void {
    this.isMenuOpen = false;
  }

  public logout(): void {
    this.authService.logout();
  }
}
