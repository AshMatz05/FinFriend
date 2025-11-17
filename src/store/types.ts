export type MoodType = 'positive' | 'negative' | 'neutral';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  mood: MoodType;
  moodEmoji: string;
  categoryEmoji: string;
}

export interface MoodStat {
  category: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface CategoryEmojiStat {
  emoji: string;
  count: number;
}

