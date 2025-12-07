export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY';
  category: string;
  userId: number;
  createdAt: string;
  completedDates: string[]; // ISO dates
  streak: number;
  totalCompletions: number;
  color?: string; // For UI theming
  icon?: string;
}

export interface Completion {
  id: number;
  habitId: number;
  date: string;
}
