const defaultEmoji = '💰';

// Comprehensive emoji mapping organized by category themes
const emojiMap: Record<string, string[]> = {
  // Food & Dining
  '🍴': ['restaurant', 'dining', 'dine', 'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'brunch'],
  '🍔': ['food', 'fastfood', 'fast food', 'burger', 'hamburger', 'snack'],
  '🍕': ['pizza'],
  '🍜': ['noodles', 'ramen', 'pasta', 'spaghetti'],
  '🍰': ['dessert', 'cake', 'sweet', 'bakery', 'pastry'],
  '☕': ['coffee', 'cafe', 'café', 'latte', 'espresso', 'cappuccino', 'tea', 'beverage', 'drink'],
  '🍺': ['beer', 'bar', 'pub', 'alcohol', 'drinks'],
  '🍷': ['wine'],
  
  // Shopping
  '🛒': ['groceries', 'grocery', 'supermarket', 'market', 'shopping', 'store', 'retail'],
  '👚': ['clothing', 'clothes', 'apparel', 'fashion', 'wardrobe'],
  '👗': ['dress', 'outfit'],
  '👟': ['shoes', 'footwear', 'sneakers'],
  '💄': ['cosmetics', 'makeup', 'beauty', 'skincare'],
  '🛍️': ['mall', 'department', 'boutique'],
  
  // Transportation
  '🚕': ['taxi', 'cab', 'uber', 'lyft', 'ride'],
  '🚌': ['bus', 'transport', 'public transport', 'transit'],
  '🚇': ['subway', 'metro', 'underground', 'tube'],
  '🚆': ['train', 'railway', 'rail'],
  '🚗': ['car', 'vehicle', 'gas', 'fuel', 'petrol', 'parking'],
  '✈️': ['flight', 'airplane', 'air travel', 'airport'],
  '🚢': ['cruise', 'ship', 'ferry'],
  '🚲': ['bike', 'bicycle', 'cycling'],
  
  // Accommodation & Travel
  '🏨': ['hotel', 'lodging', 'accommodation'],
  '🏖️': ['vacation', 'holiday', 'beach', 'resort'],
  '✈': ['travel', 'trip', 'journey'],
  '🎫': ['ticket', 'booking'],
  
  // Bills & Utilities
  '💡': ['bills', 'utilities', 'electric', 'electricity', 'power', 'energy'],
  '💧': ['water', 'water bill'],
  '📱': ['phone', 'mobile', 'telephone', 'internet', 'wifi', 'data'],
  '📺': ['tv', 'television', 'cable', 'streaming', 'netflix'],
  '💸': ['rent', 'housing', 'mortgage', 'lease'],
  '🏠': ['home', 'house', 'property'],
  
  // Health & Medical
  '🏥': ['medical', 'health', 'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'drug'],
  '💊': ['medication', 'prescription'],
  '🏋️': ['gym', 'fitness', 'workout', 'exercise', 'sports'],
  '🧘': ['yoga', 'wellness', 'spa', 'massage'],
  
  // Entertainment
  '🎬': ['movie', 'cinema', 'film', 'theater', 'theatre'],
  '🎮': ['game', 'gaming', 'video game', 'console'],
  '🎵': ['music', 'concert', 'spotify', 'apple music'],
  '📚': ['book', 'reading', 'library', 'education', 'course', 'class'],
  '🎨': ['art', 'museum', 'gallery', 'craft'],
  '🎪': ['entertainment', 'show', 'event', 'festival'],
  
  // Technology & Electronics
  '💻': ['computer', 'laptop', 'software', 'tech'],
  '📱': ['phone', 'mobile', 'smartphone', 'device'],
  '⌚': ['watch', 'smartwatch'],
  '🎧': ['headphones', 'audio', 'speaker'],
  
  // Services
  '💇': ['haircut', 'hair', 'salon', 'barber'],
  '🧹': ['cleaning', 'laundry', 'dry cleaning'],
  '🔧': ['repair', 'maintenance', 'service'],
  '📦': ['delivery', 'shipping', 'package'],
  
  // Education
  '📖': ['school', 'tuition', 'education', 'student', 'university', 'college'],
  '✏️': ['stationery', 'supplies', 'office'],
  
  // Pets
  '🐕': ['pet', 'dog', 'veterinary', 'vet'],
  '🐈': ['cat'],
  
  // Insurance & Finance
  '🛡️': ['insurance', 'coverage'],
  '💳': ['credit', 'card', 'payment', 'bank'],
  '💰': ['money', 'cash', 'finance', 'investment', 'savings'],
  
  // Gifts & Donations
  '🎁': ['gift', 'present', 'donation', 'charity'],
  
  // Miscellaneous
  '🍽️': ['kitchen', 'cooking', 'appliance'],
  '🛋️': ['furniture', 'home decor', 'decoration'],
  '🌱': ['garden', 'plant', 'gardening'],
};

/**
 * Automatically selects an appropriate emoji for a category based on keyword matching
 * Uses a comprehensive emoji mapping to find the best match
 */
export const getCategoryEmoji = (category: string, description?: string): string => {
  const text = `${category} ${description ?? ''}`.toLowerCase().trim();
  
  if (!text) return defaultEmoji;
  
  // Split into words for better matching
  const words = text.split(/\s+/);
  
  // Score each emoji based on matches
  const emojiScores: Record<string, number> = {};
  
  // Check each emoji's keywords
  for (const [emoji, keywords] of Object.entries(emojiMap)) {
    let score = 0;
    
    for (const keyword of keywords) {
      // Exact word match gets highest score
      if (words.includes(keyword)) {
        score += 10;
      }
      // Partial word match (word contains keyword or keyword contains word)
      else if (words.some(word => word.includes(keyword) || keyword.includes(word))) {
        score += 5;
      }
      // Substring match in full text
      else if (text.includes(keyword)) {
        score += 3;
      }
    }
    
    if (score > 0) {
      emojiScores[emoji] = score;
    }
  }
  
  // Return the emoji with the highest score, or default if no match
  if (Object.keys(emojiScores).length === 0) {
    return defaultEmoji;
  }
  
  const bestMatch = Object.entries(emojiScores).reduce((best, [emoji, score]) => {
    return score > best.score ? { emoji, score } : best;
  }, { emoji: defaultEmoji, score: 0 });
  
  return bestMatch.emoji;
};

