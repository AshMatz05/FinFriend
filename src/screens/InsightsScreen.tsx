import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useExpenseStore } from '../store/useExpenseStore';
import WordCloud from '../components/WordCloud';
import { useWordCloudData } from '../hooks/useWordCloudData';
import { getAverageMoodEmoji } from '../utils/statistics';
import { colors, spacing } from '../theme';

const InsightsScreen = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const moodStats = useExpenseStore((state) => state.moodStats);
  const { categoryCloud, emojiCloud } = useWordCloudData();
  const averageMoodEmoji = getAverageMoodEmoji(expenses);

  const enjoyableCategories = Object.values(moodStats)
    .filter((stat) => stat.positive > stat.negative)
    .map((stat) => stat.category)
    .join(', ');

  const regretCategories = Object.values(moodStats)
    .filter((stat) => stat.negative >= stat.positive && stat.negative > 0)
    .map((stat) => stat.category)
    .join(', ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Insights</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories you enjoy</Text>
        <Text style={styles.sectionBody}>{enjoyableCategories || 'No data yet'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories you regret</Text>
        <Text style={[styles.sectionBody, regretCategories && styles.warning]}>
          {regretCategories || 'No regrets logged'}
        </Text>
      </View>

      <WordCloud title="Category frequency" data={categoryCloud} />
      
      <View style={styles.moodSection}>
        <Text style={styles.moodTitle}>Your average mood</Text>
        <View style={styles.emojiContainer}>
          <Text style={styles.largeEmoji}>{averageMoodEmoji}</Text>
        </View>
      </View>
      
      <WordCloud title="Category emoji frequency" data={emojiCloud} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  section: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionBody: {
    color: colors.muted,
  },
  warning: {
    color: colors.warning,
    fontWeight: '600',
  },
  moodSection: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  moodTitle: {
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    width: '100%',
  },
  largeEmoji: {
    fontSize: 120, // 4x normal emoji size (30px * 4)
    textAlign: 'center',
  },
});

export default InsightsScreen;

