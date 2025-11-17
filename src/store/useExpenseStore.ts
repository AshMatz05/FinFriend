import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Expense, MoodStat, CategoryEmojiStat, MoodType } from './types';
import { getCategoryEmoji } from '../utils/emoji';
import {
  buildCategoryEmojiStats,
  buildMoodStats,
  getPredictedMood as predictMoodFromStats,
  shouldWarn as shouldWarnFromStats,
} from '../utils/statistics';

const moodEmojiMap: Record<MoodType, string> = {
  positive: '👍',
  negative: '👎',
  neutral: '😐',
};

export interface AddExpensePayload {
  amount: number;
  category: string;
  description?: string;
  date: string;
  mood?: MoodType;
}

interface ExpenseState {
  expenses: Expense[];
  moodStats: Record<string, MoodStat>;
  categoryEmojiStats: Record<string, CategoryEmojiStat>;
  addExpense: (payload: AddExpensePayload) => Expense;
  getPredictedMood: (category: string) => MoodType;
  shouldWarn: (category: string) => boolean;
  getCategoryEmoji: (category: string, description?: string) => string;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      moodStats: {},
      categoryEmojiStats: {},
      addExpense: ({ mood, ...payload }) => {
        const normalizedCategory = payload.category.trim();
        const resolvedMood = mood ?? get().getPredictedMood(normalizedCategory);
        const expense: Expense = {
          id: nanoid(),
          amount: payload.amount,
          category: normalizedCategory,
          description: payload.description?.trim(),
          date: payload.date,
          mood: resolvedMood,
          moodEmoji: moodEmojiMap[resolvedMood],
          categoryEmoji: getCategoryEmoji(normalizedCategory, payload.description),
        };

        set((state) => {
          const expenses = [expense, ...state.expenses];
          return {
            expenses,
            moodStats: buildMoodStats(expenses),
            categoryEmojiStats: buildCategoryEmojiStats(expenses),
          };
        });

        return expense;
      },
      getPredictedMood: (category) => predictMoodFromStats(category, get().moodStats),
      shouldWarn: (category) => shouldWarnFromStats(category, get().moodStats),
      getCategoryEmoji,
    }),
    {
      name: 'expense-mood-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        expenses: state.expenses,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const expenses = state.expenses ?? [];
        state.moodStats = buildMoodStats(expenses);
        state.categoryEmojiStats = buildCategoryEmojiStats(expenses);
      },
    }
  )
);

