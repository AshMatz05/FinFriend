import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseForm from '../components/ExpenseForm';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

const AddExpenseScreen = () => {
  const { colors } = useTheme();
  const dynamicStyles = makeStyles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <Text style={dynamicStyles.heading}>Log an expense</Text>
        <Text style={dynamicStyles.subheading}>Track how spending makes you feel.</Text>
        <ExpenseForm />
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
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

