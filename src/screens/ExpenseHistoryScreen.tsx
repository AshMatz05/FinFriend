import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import dayjs from 'dayjs';
import { useExpenseStore } from '../store/useExpenseStore';
import { colors, spacing } from '../theme';

const ExpenseHistoryScreen = () => {
  const expenses = useExpenseStore((state) => state.expenses);
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expense history</Text>
      <TextInput
        style={styles.input}
        placeholder="Search category or description"
        value={query}
        onChangeText={setQuery}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter mood (positive / neutral / negative)"
        value={moodFilter}
        onChangeText={setMoodFilter}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter category emoji (e.g. 🍴)"
        value={emojiFilter}
        onChangeText={setEmojiFilter}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>
                {item.categoryEmoji} {item.category}
              </Text>
              <Text style={styles.rowSubtitle}>{item.description || 'No description'}</Text>
              <Text style={styles.rowSubtitle}>{dayjs(item.date).format('MMM D, YYYY')}</Text>
            </View>
            <View style={styles.rowAmount}>
              <Text style={styles.rowValue}>₹{item.amount.toFixed(2)}</Text>
              <Text style={styles.rowMood}>{item.moodEmoji}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No expenses match the filters.</Text>}
        contentContainerStyle={filtered.length === 0 && styles.emptyContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: '#fff',
    marginBottom: spacing.sm,
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

