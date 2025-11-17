import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MoodType } from '../store/types';
import { colors, spacing } from '../theme';

const moodEmojis: Record<MoodType, string> = {
  positive: '👍',
  negative: '👎',
  neutral: '😐',
};

interface EmojiSelectorProps {
  selected: MoodType;
  onSelect: (mood: MoodType) => void;
}

const EmojiSelector = ({ selected, onSelect }: EmojiSelectorProps) => (
  <View style={styles.container}>
    {Object.entries(moodEmojis).map(([mood, emoji]) => {
      const isActive = selected === mood;
      return (
        <TouchableOpacity
          key={mood}
          style={[styles.button, isActive && styles.activeButton]}
          onPress={() => onSelect(mood as MoodType)}
          accessibilityLabel={`${mood} mood`}
          accessibilityRole="button"
        >
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[styles.label, isActive && styles.activeLabel]}>{mood}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeButton: {
    borderColor: colors.accent,
    backgroundColor: '#e3f2fd',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    marginTop: 4,
    textTransform: 'capitalize',
    color: colors.muted,
  },
  activeLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
});

export default EmojiSelector;

