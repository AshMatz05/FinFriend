import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useExpenseStore } from '../store/useExpenseStore';
import { colors, spacing } from '../theme';
import type { TabParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const expenses = useExpenseStore((state) => state.expenses);

  const todayKey = dayjs().format('YYYY-MM-DD');
  const todaysExpenses = expenses.filter((expense) => dayjs(expense.date).format('YYYY-MM-DD') === todayKey);
  const todayTotal = todaysExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Today’s spend</Text>
        <Text style={styles.summaryValue}>₹{todayTotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add' as never)}>
          <Text style={styles.addText}>Add expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today</Text>
      <FlatList
        data={todaysExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View>
              <Text style={styles.expenseTitle}>
                {item.categoryEmoji} {item.category}
              </Text>
              <Text style={styles.expenseSubtitle}>{dayjs(item.date).format('h:mm A')}</Text>
            </View>
            <View style={styles.expenseAmount}>
              <Text style={styles.expenseValue}>₹{item.amount.toFixed(2)}</Text>
              <Text style={styles.expenseMood}>{item.moodEmoji}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses logged today.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  summary: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryLabel: {
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.text,
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 18,
    marginBottom: spacing.sm,
  },
  expenseTitle: {
    fontWeight: '600',
  },
  expenseSubtitle: {
    color: colors.muted,
    marginTop: 2,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  expenseValue: {
    fontWeight: '700',
  },
  expenseMood: {
    fontSize: 20,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: spacing.lg,
  },
});

export default HomeScreen;

