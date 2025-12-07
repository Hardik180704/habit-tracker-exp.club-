export interface User {
  id: number;
  username: string;
  email: string;
  _count?: {
    followers: number;
    following: number;
  };
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

export interface SocialUser {
  id: number;
  username: string;
  isFollowing: boolean;
}

export interface FeedItem {
  id: number;
  completedAt: string;
  user: {
    username: string;
    isFollowing?: boolean;
    _count?: {
        followers: number;
        following: number;
    };
  };
  habit: {
    name: string;
    category: string;
    icon?: string;
    color?: string;
  };
}

export interface DashboardStats {
  activeHabits: number;
  topHabit: {
    name: string;
    streak: number;
    icon?: string;
  };
  weeklyActivity: {
    label: string;
    value: number;
  }[];
  scoreChange: number;
  totalCompletions: number;
}
