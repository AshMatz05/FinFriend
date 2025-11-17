import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import ExpenseForm from '../components/ExpenseForm';
import { colors, spacing } from '../theme';

const AddExpenseScreen = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Log an expense</Text>
      <Text style={styles.subheading}>Track how spending makes you feel.</Text>
      <ExpenseForm />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subheading: {
    color: colors.muted,
    marginBottom: spacing.md,
  },
});

export default AddExpenseScreen;

