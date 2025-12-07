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
  };
  habit: {
    name: string;
    category: string;
    icon?: string;
    color?: string;
  };
}
