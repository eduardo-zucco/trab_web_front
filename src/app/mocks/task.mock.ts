import { TaskModel } from '../models/task.model';

export const MOCK_TASKS: TaskModel[] = [
  {
    id: 1,
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Instalar Node.js, .NET 8 SDK e configurar banco de dados MySQL para o projeto.',
    status: 'Concluida',
    priority: 'Alta',
    dueDate: '2026-10-01',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    userId: 1
  },
  {
    id: 2,
    title: 'Migrar telas para Bootstrap 5',
    description: 'Substituir classes do Tailwind por componentes nativos do Bootstrap (navbar, cards, tabelas, forms).',
    status: 'Em Andamento',
    priority: 'Alta',
    dueDate: '2026-10-05',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    userId: 1
  },
  {
    id: 3,
    title: 'Implementar CRUD de Tarefas na API',
    description: 'Criar controller, endpoints, DTOs e entidades necessárias no backend ASP.NET Core.',
    status: 'Concluida',
    priority: 'Alta',
    dueDate: '2026-10-03',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    userId: 1
  },
  {
    id: 4,
    title: 'Desenvolver página de Perfil de Usuário',
    description: 'Permitir atualização de nome, email e senha pelo usuário autenticado.',
    status: 'Pendente',
    priority: 'Media',
    dueDate: '2026-10-10',
    createdAt: new Date().toISOString(),
    userId: 1
  },
  {
    id: 5,
    title: 'Revisão e testes de usabilidade',
    description: 'Validar formulários, mensagens de feedback (toasts) e layout responsivo.',
    status: 'Pendente',
    priority: 'Baixa',
    dueDate: '2026-10-15',
    createdAt: new Date().toISOString(),
    userId: 1
  }
];
