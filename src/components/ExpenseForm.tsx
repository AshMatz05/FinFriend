import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import { useExpenseStore } from '../store/useExpenseStore';
import { MoodType } from '../store/types';
import EmojiSelector from './EmojiSelector';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';

interface ExpenseFormProps {
  onSaved?: () => void;
}

const ExpenseForm = ({ onSaved }: ExpenseFormProps) => {
  const { addExpense, getPredictedMood, shouldWarn, getCategoryEmoji } = useExpenseStore();
  const { colors } = useTheme();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(dayjs().toISOString());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [moodManuallySelected, setMoodManuallySelected] = useState(false);

  const suggestedMood = useMemo<MoodType>(
    () => getPredictedMood(category || ''),
    [category, getPredictedMood]
  );

  const [selectedMood, setSelectedMood] = useState<MoodType>(suggestedMood);

  useEffect(() => {
    if (!moodManuallySelected) {
      setSelectedMood(suggestedMood);
    }
  }, [suggestedMood, moodManuallySelected]);

  const categoryEmoji = useMemo(
    () => getCategoryEmoji(category || '', description),
    [category, description, getCategoryEmoji]
  );

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(dayjs().toISOString());
    setMoodManuallySelected(false);
  };

  const handleSubmit = () => {
    if (!amount || Number.isNaN(Number(amount))) {
      Alert.alert('Amount missing', 'Please provide a valid number.');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Category missing', 'Please provide a category name.');
      return;
    }

    const warn = shouldWarn(category);
    const proceed = () => {
      addExpense({
        amount: Number(amount),
        category,
        description,
        date,
        mood: selectedMood,
      });
      Toast.show({ type: 'success', text1: 'Expense saved' });
      resetForm();
      onSaved?.();
    };

    if (warn) {
      Alert.alert('Heads up', 'You’ve disliked expenses in this category before. Continue?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: proceed },
      ]);
    } else {
      proceed();
    }
  };

  const dynamicStyles = makeStyles(colors);

  return (
    <View style={dynamicStyles.card}>
      <Text style={dynamicStyles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="e.g. 24.99"
        placeholderTextColor={colors.muted}
        style={dynamicStyles.input}
      />

      <Text style={dynamicStyles.label}>Category</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. Groceries"
        placeholderTextColor={colors.muted}
        style={dynamicStyles.input}
        autoCapitalize="words"
      />

      <Text style={dynamicStyles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Add some notes"
        placeholderTextColor={colors.muted}
        style={[dynamicStyles.input, dynamicStyles.multiline]}
        multiline
      />

      <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
        <Text style={dynamicStyles.dateText}>Date: {dayjs(date).format('MMM D, YYYY')}</Text>
      </TouchableOpacity>

      <Text style={dynamicStyles.label}>Mood</Text>
      <EmojiSelector
        selected={selectedMood}
        onSelect={(mood) => {
          setMoodManuallySelected(true);
          setSelectedMood(mood);
        }}
      />
      <Text style={dynamicStyles.helper}>
        Suggested mood: <Text style={dynamicStyles.helperValue}>{suggestedMood}</Text> • Category emoji:{' '}
        <Text style={dynamicStyles.helperValue}>{categoryEmoji}</Text>
      </Text>

      <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSubmit}>
        <Text style={dynamicStyles.saveText}>Save expense</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(date)}
        onConfirm={(picked) => {
          setDate(picked.toISOString());
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
};

const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 12,
      gap: spacing.sm,
    },
    label: {
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card,
      color: colors.text,
    },
    multiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    dateText: {
      marginTop: spacing.xs,
      color: colors.accent,
      fontWeight: '600',
    },
    helper: {
      color: colors.muted,
      marginTop: spacing.xs,
    },
    helperValue: {
      fontWeight: '700',
      color: colors.text,
    },
    saveButton: {
      marginTop: spacing.md,
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      borderRadius: 16,
      alignItems: 'center',
    },
    saveText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });

export default ExpenseForm;

