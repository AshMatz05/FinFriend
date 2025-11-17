import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useExpenseStore } from '../store/useExpenseStore';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';
import type { TabParamList } from '../navigation/AppNavigator';
import Logo from '../../assets/logo.svg';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const expenses = useExpenseStore((state) => state.expenses);
  const { colors, mode } = useTheme();

  const todayKey = dayjs().format('YYYY-MM-DD');
  const todaysExpenses = expenses.filter((expense) => dayjs(expense.date).format('YYYY-MM-DD') === todayKey);
  const todayTotal = todaysExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const dynamicStyles = makeStyles(colors);
  const logoColor = mode === 'dark' ? '#ffffff' : '#000000';

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.heading}>FinFriend</Text>
        <Logo width={44} height={44} fill={logoColor} />
      </View>
      <View style={dynamicStyles.summary}>
        <Text style={dynamicStyles.summaryLabel}>Today's spend</Text>
        <Text style={dynamicStyles.summaryValue}>₹{todayTotal.toFixed(2)}</Text>
        <TouchableOpacity style={dynamicStyles.addButton} onPress={() => navigation.navigate('Add' as never)}>
          <Text style={dynamicStyles.addText}>Add expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={dynamicStyles.sectionTitle}>Today</Text>
      <FlatList
        data={todaysExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.expenseCard}>
            <View>
              <Text style={dynamicStyles.expenseTitle}>
                {item.categoryEmoji} {item.category}
              </Text>
              <Text style={dynamicStyles.expenseSubtitle}>{dayjs(item.date).format('h:mm A')}</Text>
            </View>
            <View style={dynamicStyles.expenseAmount}>
              <Text style={dynamicStyles.expenseValue}>₹{item.amount.toFixed(2)}</Text>
              <Text style={dynamicStyles.expenseMood}>{item.moodEmoji}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={dynamicStyles.emptyText}>No expenses logged today.</Text>}
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
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    summary: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: 24,
      alignItems: 'center',
      gap: spacing.sm,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
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
      color: colors.text,
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
      color: colors.text,
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

