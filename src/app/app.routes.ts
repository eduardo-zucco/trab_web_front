import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Início | WebApp',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: Register,
    title: 'Cadastro | WebApp'
  },
  {
    path: 'login',
    component: Login,
    title: 'Login | WebApp'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 - Não Encontrado | WebApp'
  }
];
