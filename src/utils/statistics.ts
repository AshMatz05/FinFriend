import { Expense, MoodStat, CategoryEmojiStat, MoodType } from '../store/types';

export const buildMoodStats = (expenses: Expense[]): Record<string, MoodStat> =>
  expenses.reduce<Record<string, MoodStat>>((acc, expense) => {
    const key = expense.category.toLowerCase();
    if (!acc[key]) {
      acc[key] = { category: key, positive: 0, negative: 0, neutral: 0 };
    }
    acc[key][expense.mood] += 1;
    return acc;
  }, {});

export const buildCategoryEmojiStats = (expenses: Expense[]): Record<string, CategoryEmojiStat> =>
  expenses.reduce<Record<string, CategoryEmojiStat>>((acc, expense) => {
    const emoji = expense.categoryEmoji;
    if (!acc[emoji]) {
      acc[emoji] = { emoji, count: 0 };
    }
    acc[emoji].count += 1;
    return acc;
  }, {});

export const getPredictedMood = (category: string, stats: Record<string, MoodStat>): MoodType => {
  const stat = stats[category.toLowerCase()];
  if (!stat) return 'neutral';
  const { positive, negative, neutral } = stat;
  const max = Math.max(positive, negative, neutral);
  if (max === positive) return 'positive';
  if (max === negative) return 'negative';
  return 'neutral';
};

export const shouldWarn = (category: string, stats: Record<string, MoodStat>): boolean => {
  const stat = stats[category.toLowerCase()];
  if (!stat) return false;
  const total = stat.positive + stat.negative + stat.neutral;
  if (!total) return false;
  return stat.negative / total > 0.6;
};

export const accumulateCategories = (expenses: Expense[]) =>
  expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + 1;
    return acc;
  }, {});

export const accumulateMoods = (expenses: Expense[]) =>
  expenses.reduce<Record<MoodType, number>>((acc, { mood }) => {
    acc[mood] = (acc[mood] ?? 0) + 1;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

export const mapToWordCloud = (records: Record<string, number>) =>
  Object.entries(records).map(([text, value]) => ({ text, value }));

// Get dominant mood for a category
export const getCategoryDominantMood = (
  category: string,
  expenses: Expense[],
  moodStats: Record<string, MoodStat>
): MoodType => {
  const stat = moodStats[category.toLowerCase()];
  if (!stat) return 'neutral';
  const { positive, negative, neutral } = stat;
  const max = Math.max(positive, negative, neutral);
  if (max === positive) return 'positive';
  if (max === negative) return 'negative';
  return 'neutral';
};

// Get dominant mood for an emoji based on expenses
export const getEmojiDominantMood = (emoji: string, expenses: Expense[]): MoodType => {
  const emojiExpenses = expenses.filter((e) => e.categoryEmoji === emoji);
  if (!emojiExpenses.length) return 'neutral';
  
  const moodCounts = emojiExpenses.reduce(
    (acc, e) => {
      acc[e.mood] = (acc[e.mood] ?? 0) + 1;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 } as Record<MoodType, number>
  );
  
  const max = Math.max(moodCounts.positive, moodCounts.negative, moodCounts.neutral);
  if (max === moodCounts.positive) return 'positive';
  if (max === moodCounts.negative) return 'negative';
  return 'neutral';
};

// Get average mood emoji based on overall expense moods
// Returns one of 13 emojis representing a gradient from super happy to super sad
export const getAverageMoodEmoji = (expenses: Expense[]): string => {
  if (!expenses.length) return '😐';
  
  const moodCounts = accumulateMoods(expenses);
  const { positive, negative, neutral } = moodCounts;
  const total = positive + negative + neutral;
  
  if (total === 0) return '😐';
  
  const positiveRatio = positive / total;
  const negativeRatio = negative / total;
  const neutralRatio = neutral / total;
  const diff = positiveRatio - negativeRatio;
  
  // Super happy (>65% positive or very strong positive dominance)
  if (positiveRatio > 0.65 || (positiveRatio > 0.5 && positive > negative * 3)) {
    return '🤩'; // Super happy - KEEP
  }
  
  // Very happy (55-65% positive)
  if (positiveRatio > 0.55 && positiveRatio <= 0.65) {
    return '😄'; // Very happy
  }
  
  // Happy (45-55% positive, positive clearly leads)
  if (positiveRatio > 0.45 && positiveRatio <= 0.55 && diff > 0.15) {
    return '😁'; // Happy
  }
  
  // Slightly happy (35-45% positive, positive > negative)
  if (positiveRatio > 0.35 && positiveRatio <= 0.45 && positive > negative) {
    return '😊'; // Slightly happy
  }
  
  // Neutral-positive (25-35% positive, positive > negative)
  if (positiveRatio > 0.25 && positiveRatio <= 0.35 && positive > negative) {
    return '🙂'; // Neutral-positive
  }
  
  // Neutral-balanced (balanced within 15% difference, or neutral majority)
  if (
    neutralRatio > 0.5 ||
    (Math.abs(diff) <= 0.15 && positiveRatio <= 0.35 && negativeRatio <= 0.35)
  ) {
    return '😐'; // Neutral - KEEP
  }
  
  // Neutral-negative (25-35% negative, negative > positive)
  if (negativeRatio > 0.25 && negativeRatio <= 0.35 && negative > positive) {
    return '😑'; // Neutral-negative
  }
  
  // Slightly sad (35-45% negative, negative > positive)
  if (negativeRatio > 0.35 && negativeRatio <= 0.45 && negative > positive) {
    return '😕'; // Slightly sad
  }
  
  // Sad (45-55% negative, negative clearly leads)
  if (negativeRatio > 0.45 && negativeRatio <= 0.55 && diff < -0.15) {
    return '😔'; // Sad
  }
  
  // Very sad (55-60% negative)
  if (negativeRatio > 0.55 && negativeRatio <= 0.60) {
    return '😢'; // Very sad
  }
  
  // Very very sad (60-70% negative)
  if (negativeRatio > 0.60 && negativeRatio <= 0.70) {
    return '😰'; // Very very sad
  }
  
  // Extremely sad (70-75% negative)
  if (negativeRatio > 0.70 && negativeRatio <= 0.75) {
    return '😨'; // Extremely sad
  }
  
  // Super sad (>75% negative or very strong negative dominance)
  if (negativeRatio > 0.75 || (negativeRatio > 0.5 && negative > positive * 3)) {
    return '😭'; // Super sad - KEEP
  }
  
  return '😐'; // Default neutral
};

