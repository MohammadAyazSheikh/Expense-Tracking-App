import React from 'react';
import { View, TextInput, TouchableOpacity, Switch } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useFinanceStore } from '../store';
import { useFonts } from '../hooks/useFonts';

const categories = [
  { id: "food", name: "Food", emoji: "🍔", color: "hsl(10 80% 65%)" },
  { id: "transport", name: "Transport", emoji: "🚗", color: "hsl(255 70% 65%)" },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "hsl(35 90% 60%)" },
  { id: "bills", name: "Bills", emoji: "📱", color: "hsl(160 70% 60%)" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "hsl(230 75% 70%)" },
  { id: "health", name: "Health", emoji: "💊", color: "hsl(145 70% 55%)" },
];

const paymentModes = ["Cash", "Bank", "Card", "Wallet"];

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  headerTitle: {
    color: 'white',
  },
  amountContainer: {
    alignItems: 'center',
  },
  amountLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.margins.xs,
  },
  currencySymbol: {
    color: 'white',
    fontSize: 48,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    color: 'white',
    fontSize: 48,
    minWidth: 100,
    textAlign: 'center',
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  sectionLabel: {
    marginBottom: theme.margins.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.margins.sm,
  },
  categoryButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  categoryButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '15',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: theme.margins.sm,
  },
  paymentButton: {
    flex: 1,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.radius.lg,
    padding: theme.paddings.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.margins.sm,
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitButton: {
    marginTop: theme.margins.md,
    marginBottom: theme.margins.xl,
  }
}));

export const AddExpenseScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const { getFont } = useFonts();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      amount: '',
      category: 'food',
      payment: 'Card',
      description: '',
      notes: '',
      tags: '',
      isRecurring: false,
    }
  });

  const selectedCategory = watch('category');
  const selectedPayment = watch('payment');
  const isRecurring = watch('isRecurring');

  const onSubmit = (data: any) => {
    addTransaction({
      name: data.description || "Expense",
      category: categories.find(c => c.id === data.category)?.name || "Other",
      amount: -parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'expense',
      payment: data.payment,
      note: data.notes,
    });
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>Add Expense</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text variant="caption" style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol} variant='h1' weight="bold">$</Text>
            <Controller
              control={control}
              name="amount"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={[styles.amountInput, { fontFamily: getFont('bold') }]}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              )}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Category Selection */}
        <Card>
          <Text weight="semiBold" style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setValue('category', category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text variant="caption" weight="medium">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Payment Mode */}
        <Card>
          <Text weight="semiBold" style={styles.sectionLabel}>Payment Mode</Text>
          <View style={styles.paymentRow}>
            {paymentModes.map((mode) => (
              <Button
                key={mode}
                title={mode}
                variant={selectedPayment === mode ? "default" : "outline"}
                size="sm"
                onPress={() => setValue('payment', mode)}
                style={styles.paymentButton}
              />
            ))}
          </View>
        </Card>

        {/* Details */}
        <Card>
          <Controller
            control={control}
            name="description"
            rules={{ required: 'Description is required' }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Description"
                placeholder="e.g., Lunch at Cafe"
                value={value}
                onChangeText={onChange}
                error={errors.description?.message as string}
              />
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Notes (Optional)"
                placeholder="Add any additional notes..."
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Tags (Optional)"
                placeholder="e.g., work, lunch, coffee"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Card>

        {/* Upload Receipt */}
        <Card>
          <Text weight="semiBold" style={styles.sectionLabel}>Receipt (Optional)</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Feather name="upload" size={24} color={theme.colors.mutedForeground} />
            <Text variant="caption">Upload Receipt</Text>
          </TouchableOpacity>
        </Card>

        {/* Recurring */}
        <Card>
          <View style={styles.recurringRow}>
            <View>
              <Text weight="semiBold">Recurring Expense</Text>
              <Text variant="caption">Set this expense to repeat automatically</Text>
            </View>
            <Switch
              value={isRecurring}
              onValueChange={(val) => setValue('isRecurring', val)}
              trackColor={{ false: theme.colors.muted, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
        </Card>

        <Button
          title="Add Expense"
          size="lg"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScreenWrapper>
  );
};
