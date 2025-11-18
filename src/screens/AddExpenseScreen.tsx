import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseForm from '../components/ExpenseForm';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';


const AddExpenseScreen = () => {
  const { colors, mode, toggleTheme } = useTheme();
  const dynamicStyles = makeStyles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.heading}>Log an expense</Text>
        <TouchableOpacity onPress={toggleTheme} style={dynamicStyles.themeToggle}>
          <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.text} />
        </TouchableOpacity>
        </View>
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
      header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    heading: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
     themeToggle: {
      padding: spacing.sm,
    },
    subheading: {
      color: colors.muted,
      marginBottom: spacing.md,
    },
  });

export default AddExpenseScreen;

