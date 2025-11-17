import { useMemo } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import {
  accumulateCategories,
  accumulateMoods,
  mapToWordCloud,
  getCategoryDominantMood,
  getEmojiDominantMood,
} from '../utils/statistics';
import { CloudDatum } from '../components/WordCloud';

export const useWordCloudData = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const moodStats = useExpenseStore((state) => state.moodStats);
  const categoryEmojiStats = useExpenseStore((state) => state.categoryEmojiStats);

  const categoryCloud = useMemo<CloudDatum[]>(() => {
    const categoryCounts = accumulateCategories(expenses);
    return Object.entries(categoryCounts).map(([text, value]) => ({
      text,
      value,
      mood: getCategoryDominantMood(text, expenses, moodStats),
    }));
  }, [expenses, moodStats]);

  const moodCloud = useMemo<CloudDatum[]>(() => {
    const moodCounts = accumulateMoods(expenses);
    return Object.entries(moodCounts).map(([text, value]) => ({
      text,
      value,
      mood: text as 'positive' | 'negative' | 'neutral',
    }));
  }, [expenses]);

  const emojiCloud = useMemo<CloudDatum[]>(() => {
    const emojiCounts = Object.values(categoryEmojiStats).reduce<Record<string, number>>(
      (acc, stat) => {
        acc[stat.emoji] = stat.count;
        return acc;
      },
      {}
    );
    return Object.entries(emojiCounts).map(([text, value]) => ({
      text,
      value,
      mood: getEmojiDominantMood(text, expenses),
    }));
  }, [categoryEmojiStats, expenses]);

  return { categoryCloud, moodCloud, emojiCloud };
};

