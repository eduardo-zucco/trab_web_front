import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly navLinks = [
    { label: 'Início', path: '/' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
