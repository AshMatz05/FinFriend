import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { Expense, MoodType } from '../store/types';
import { spacing, lightColors } from '../theme';
import { useTheme } from '../hooks/useTheme';
import EmojiSelector from './EmojiSelector';

export interface EditExpenseValues {
  amount: number;
  category: string;
  description?: string;
  date: string;
  mood: MoodType;
}

interface EditExpenseModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (values: EditExpenseValues) => void;
}

const EditExpenseModal = ({ visible, expense, onClose, onSave }: EditExpenseModalProps) => {
  const { colors } = useTheme();
  const dynamicStyles = makeStyles(colors);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description ?? '');
      setDate(expense.date);
      setSelectedMood(expense.mood);
    }
  }, [expense]);

  const handleSave = () => {
    if (!expense) return;

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid positive amount.');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Category required', 'Please enter a category.');
      return;
    }

    onSave({
      amount: parsedAmount,
      category: category.trim(),
      description: description.trim() || undefined,
      date,
      mood: selectedMood,
    });
    onClose();
  };

  const handleConfirmDate = (pickedDate: Date) => {
    setDate(pickedDate.toISOString());
    setDatePickerVisible(false);
  };

  const modalTitle = expense ? `Edit ${expense.category}` : 'Edit expense';

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={dynamicStyles.overlay}>
        <View style={dynamicStyles.sheet}>
          <Text style={dynamicStyles.title}>{modalTitle}</Text>
          <Text style={dynamicStyles.label}>Amount (₹)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.muted}
            style={dynamicStyles.input}
          />

          <Text style={dynamicStyles.label}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Enter category"
            placeholderTextColor={colors.muted}
            style={dynamicStyles.input}
          />

          <Text style={dynamicStyles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            placeholderTextColor={colors.muted}
            style={[dynamicStyles.input, dynamicStyles.multiline]}
            multiline
          />

          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <Text style={dynamicStyles.dateText}>Date: {dayjs(date).format('MMM D, YYYY')}</Text>
          </TouchableOpacity>

          <Text style={dynamicStyles.label}>Mood</Text>
          <EmojiSelector selected={selectedMood} onSelect={setSelectedMood} />

          <View style={dynamicStyles.actions}>
            <TouchableOpacity style={[dynamicStyles.button, dynamicStyles.cancel]} onPress={onClose}>
              <Text style={dynamicStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[dynamicStyles.button, dynamicStyles.save]} onPress={handleSave}>
              <Text style={[dynamicStyles.buttonText, dynamicStyles.saveText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(date)}
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
      />
    </Modal>
  );
};

const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      gap: spacing.sm,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    label: {
      fontWeight: '600',
      color: colors.text,
      marginTop: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: spacing.sm,
      color: colors.text,
      backgroundColor: colors.background,
    },
    multiline: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
    dateText: {
      marginTop: spacing.xs,
      color: colors.accent,
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 16,
      alignItems: 'center',
    },
    cancel: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    save: {
      backgroundColor: colors.accent,
    },
    buttonText: {
      fontWeight: '600',
      color: colors.text,
    },
    saveText: {
      color: '#fff',
    },
  });

export default EditExpenseModal;


