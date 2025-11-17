const defaultEmoji = '💰';

const categoryKeywordMap: Record<string, string> = {
  restaurant: '🍴',
  food: '🍔',
  cafe: '☕',
  coffee: '☕',
  tea: '☕',
  groceries: '🛒',
  supermarket: '🛒',
  market: '🛒',
  clothing: '👚',
  apparel: '👗',
  entertainment: '🎬',
  movie: '🎬',
  cinema: '🎬',
  taxi: '🚕',
  cab: '🚕',
  transport: '🚌',
  bus: '🚌',
  subway: '🚇',
  train: '🚆',
  bills: '💡',
  utilities: '💡',
  rent: '💸',
  medical: '🏥',
  health: '🏥',
  doctor: '🏥',
  travel: '✈',
  flight: '✈',
  hotel: '🏨',
  vacation: '🏖',
};

export const getCategoryEmoji = (category: string, description?: string): string => {
  const haystack = `${category} ${description ?? ''}`.toLowerCase();
  const match = Object.keys(categoryKeywordMap).find((key) => haystack.includes(key));
  return match ? categoryKeywordMap[match] : defaultEmoji;
};

