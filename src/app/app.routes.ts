import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskFormComponent } from './pages/tasks/task-form.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Painel Principal | WebApp',
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    title: 'Lista de Tarefas | WebApp',
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    title: 'Nova Tarefa | WebApp',
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    title: 'Editar Tarefa | WebApp',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Meu Perfil | WebApp',
    canActivate: [authGuard]
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
