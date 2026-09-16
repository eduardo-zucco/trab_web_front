import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'trab_web_front';
  rotaAtual: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.rotaAtual = this.router.url;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.rotaAtual = event.urlAfterRedirects || event.url;
    });
  }

  get isAuthRoute(): boolean {
    const authRoutes = ['/register', '/login'];
    return authRoutes.some(route => this.rotaAtual.startsWith(route));
  }
}
