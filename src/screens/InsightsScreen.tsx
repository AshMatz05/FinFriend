import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import WordCloud from '../components/WordCloud';
import { useWordCloudData } from '../hooks/useWordCloudData';
import { getAverageMoodEmoji } from '../utils/statistics';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const InsightsScreen = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const moodStats = useExpenseStore((state) => state.moodStats);
  const { categoryCloud, emojiCloud } = useWordCloudData();
  const averageMoodEmoji = getAverageMoodEmoji(expenses);
  const { colors, mode, toggleTheme } = useTheme();
  const dynamicStyles = makeStyles(colors);

  const enjoyableCategories = Object.values(moodStats)
    .filter((stat) => stat.positive > stat.negative)
    .map((stat) => stat.category)
    .join(', ');

  const regretCategories = Object.values(moodStats)
    .filter((stat) => stat.negative >= stat.positive && stat.negative > 0)
    .map((stat) => stat.category)
    .join(', ');

  return (
    <SafeAreaView style={dynamicStyles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.heading}>Insights</Text>
        <TouchableOpacity onPress={toggleTheme} style={dynamicStyles.themeToggle}>
          <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Categories you enjoy</Text>
        <Text style={dynamicStyles.sectionBody}>{enjoyableCategories || 'No data yet'}</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Categories you regret</Text>
        <Text style={[dynamicStyles.sectionBody, regretCategories && dynamicStyles.warning]}>
          {regretCategories || 'No regrets logged'}
        </Text>
      </View>

      <WordCloud title="Category frequency" data={categoryCloud} />
      
      <View style={dynamicStyles.moodSection}>
        <Text style={dynamicStyles.moodTitle}>Your average mood</Text>
        <View style={dynamicStyles.emojiContainer}>
          <Text style={dynamicStyles.largeEmoji}>{averageMoodEmoji}</Text>
        </View>
      </View>
      
      <WordCloud title="Category emoji frequency" data={emojiCloud} />
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    heading: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.text,
    },
    themeToggle: {
      padding: spacing.sm,
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
      color: colors.text,
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

