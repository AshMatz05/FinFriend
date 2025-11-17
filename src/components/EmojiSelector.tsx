import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MoodType } from '../store/types';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const moodEmojis: Record<MoodType, string> = {
  positive: '👍',
  negative: '👎',
  neutral: '😐',
};

interface EmojiSelectorProps {
  selected: MoodType;
  onSelect: (mood: MoodType) => void;
}

const EmojiSelector = ({ selected, onSelect }: EmojiSelectorProps) => {
  const { colors, mode } = useTheme();
  const dynamicStyles = makeStyles(colors, mode);

  return (
    <View style={dynamicStyles.container}>
      {Object.entries(moodEmojis).map(([mood, emoji]) => {
        const isActive = selected === mood;
        return (
          <TouchableOpacity
            key={mood}
            style={[dynamicStyles.button, isActive && dynamicStyles.activeButton]}
            onPress={() => onSelect(mood as MoodType)}
            accessibilityLabel={`${mood} mood`}
            accessibilityRole="button"
          >
            <Text style={dynamicStyles.emoji}>{emoji}</Text>
            <Text style={[dynamicStyles.label, isActive && dynamicStyles.activeLabel]}>{mood}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const makeStyles = (colors: typeof lightColors, mode: 'light' | 'dark') =>
  StyleSheet.create({
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
      backgroundColor: colors.card,
    },
    activeButton: {
      borderColor: colors.accent,
      backgroundColor: mode === 'dark' ? '#1e3a5f' : '#e3f2fd',
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

