export interface TaskModel {
  id: number;
  title: string;
  description?: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluida' | string;
  priority: 'Baixa' | 'Media' | 'Alta' | string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export interface CreateTaskModel {
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
}

export interface UpdateTaskModel {
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
}

export interface TaskSummaryModel {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  recentTasks: TaskModel[];
}
