import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { useExpenseStore } from '../store/useExpenseStore';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const ExpenseHistoryScreen = () => {
  const expenses = useExpenseStore((state) => state.expenses);
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [emojiFilter, setEmojiFilter] = useState('');

  const filtered = useMemo(
    () =>
      expenses.filter((expense) => {
        const matchesQuery =
          expense.category.toLowerCase().includes(query.toLowerCase()) ||
          (expense.description ?? '').toLowerCase().includes(query.toLowerCase());
        const matchesMood = moodFilter ? expense.mood === moodFilter.toLowerCase() : true;
        const matchesEmoji = emojiFilter ? expense.categoryEmoji === emojiFilter : true;
        return matchesQuery && matchesMood && matchesEmoji;
      }),
    [expenses, query, moodFilter, emojiFilter]
  );

  const dynamicStyles = makeStyles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <Text style={dynamicStyles.heading}>Expense history</Text>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Search category or description"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Filter mood (positive / neutral / negative)"
        placeholderTextColor={colors.muted}
        value={moodFilter}
        onChangeText={setMoodFilter}
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Filter category emoji (e.g. 🍴)"
        placeholderTextColor={colors.muted}
        value={emojiFilter}
        onChangeText={setEmojiFilter}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.row}>
            <View>
              <Text style={dynamicStyles.rowTitle}>
                {item.categoryEmoji} {item.category}
              </Text>
              <Text style={dynamicStyles.rowSubtitle}>{item.description || 'No description'}</Text>
              <Text style={dynamicStyles.rowSubtitle}>{dayjs(item.date).format('MMM D, YYYY')}</Text>
            </View>
            <View style={dynamicStyles.rowAmount}>
              <Text style={dynamicStyles.rowValue}>${item.amount.toFixed(2)}</Text>
              <Text style={dynamicStyles.rowMood}>{item.moodEmoji}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={dynamicStyles.empty}>No expenses match the filters.</Text>}
        contentContainerStyle={filtered.length === 0 && dynamicStyles.emptyContainer}
      />
    </SafeAreaView>
  );
};

const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: colors.background,
    },
    heading: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: spacing.md,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: spacing.md,
      backgroundColor: colors.card,
      marginBottom: spacing.sm,
      color: colors.text,
    },
    row: {
      backgroundColor: colors.card,
      padding: spacing.md,
      borderRadius: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    rowTitle: {
      fontWeight: '700',
      color: colors.text,
    },
    rowSubtitle: {
      color: colors.muted,
      marginTop: 2,
    },
    rowAmount: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    rowValue: {
      fontWeight: '700',
      color: colors.text,
    },
    rowMood: {
      fontSize: 24,
    },
    empty: {
      textAlign: 'center',
      color: colors.muted,
      marginTop: spacing.lg,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });

export default ExpenseHistoryScreen;

