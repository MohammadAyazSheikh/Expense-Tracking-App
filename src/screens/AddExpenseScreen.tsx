import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Pressable,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainTabParamList, RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { useFinanceStore } from "../store";
import { useFonts } from "../hooks/useFonts";
import { useTranslation } from "../hooks/useTranslation";
import { Icon, IconType } from "../components/ui/Icon";
import { SheetManager } from "react-native-actions-sheet";
import Animated from "react-native-reanimated";
import { LayoutAnimation } from "../utils/animation";
import { Header } from "../components/ui/Headers";

const PressAbleAnimated = Animated.createAnimatedComponent(Pressable);

const paymentModes = ["Cash", "Bank", "Card", "Wallet"];

export const CategoryItem = ({
  item,
  isSelected,
  onPress,
  isTag = false,
}: {
  item: {
    name: string;
    color: string;
    icon?: string;
    iconFamily?: IconType;
  };
  isSelected: boolean;
  onPress: () => void;
  isTag?: boolean;
}) => {
  const { theme } = useUnistyles();

  return (
    <PressAbleAnimated
      layout={LayoutAnimation}
      style={[
        styles.selectionItem,
        isTag && styles.tagItem,
        isSelected && styles.selectionItemSelected,
        isTag && isSelected && styles.tagItemSelected,
      ]}
      onPress={onPress}
    >
      {!isTag ? (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color || theme.colors.primary },
          ]}
        >
          <Icon
            type={item.iconFamily || "Ionicons"}
            name={item.icon || "help-circle"}
            size={20}
            color="white"
          />
        </View>
      ) : (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isSelected ? "white" : item.color,
          }}
        />
      )}
      <Text
        variant="caption"
        weight="medium"
        style={[isTag ? { fontSize: 14 } : undefined]}
      >
        {item.name}
      </Text>
    </PressAbleAnimated>
  );
};

export const AddExpenseScreen = () => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, "AddExpense">>(); // Adjusted type
  const { getFont } = useFonts();

  const transactions = useFinanceStore((state) => state.transactions);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const categories = useFinanceStore((state) => state.categories);
  const tags = useFinanceStore((state) => state.tags);

  const editId = route.params?.transactionId;
  const isEditMode = !!editId;
  const existingTransaction = useMemo(
    () => (editId ? transactions.find((t) => t.id === editId) : null),
    [editId, transactions],
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      category: "", // Store ID
      payment: "Card",
      description: "",
      notes: "",
      tags: [] as string[], // Store IDs
      isRecurring: false,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedCategory = watch("category");
  const selectedPayment = watch("payment");
  const isRecurring = watch("isRecurring");
  const selectedTags = watch("tags") || [];
  const selectedDate = watch("date");

  // Populate form for Edit Mode
  useEffect(() => {
    if (route.params?.date) {
      setValue("date", route.params.date);
    }

    if (isEditMode && existingTransaction) {
      const cat = categories.find(
        (c) => c.name === existingTransaction.category,
      );

      reset({
        amount: Math.abs(existingTransaction.amount).toString(),
        category: cat?.id || "",
        payment: existingTransaction.payment,
        description: existingTransaction.name,
        notes: existingTransaction.note || "",
        tags: existingTransaction.tags || [],
        isRecurring: existingTransaction.recurring || false,
        date: existingTransaction.date,
      });
    } else if (!isEditMode && !route.params?.date) {
      // Reset to default for Add Mode if navigating back/forth
      reset({
        amount: "",
        category: categories[0]?.id || "",
        payment: "Card",
        description: "",
        notes: "",
        tags: [],
        isRecurring: false,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [isEditMode, existingTransaction, categories, reset, route.params?.date]);

  // Sort Categories by Usage
  const sortedCategories = useMemo(() => {
    const usage: Record<string, number> = {};
    transactions.forEach((t) => {
      // t.category is Name
      usage[t.category] = (usage[t.category] || 0) + 1;
    });
    return [...categories].sort((a, b) => {
      const aCount = usage[a.name] || 0;
      const bCount = usage[b.name] || 0;
      return bCount - aCount;
    });
  }, [categories, transactions]);

  // Sort Tags by Usage
  const sortedTags = useMemo(() => {
    const usage: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.tags) {
        t.tags.forEach((tagId) => {
          usage[tagId] = (usage[tagId] || 0) + 1;
        });
      }
    });
    return [...tags].sort((a, b) => {
      const aCount = usage[a.id] || 0;
      const bCount = usage[b.id] || 0;
      return bCount - aCount;
    });
  }, [tags, transactions]);

  const topCategories = useMemo(() => {
    let list = [...sortedCategories];
    // If we have a selected category, ensure it's in the list
    if (selectedCategory) {
      const selectedCatObj = categories.find((c) => c.id === selectedCategory);
      if (selectedCatObj) {
        // Remove it if it exists to avoid duplicates, then unshift it to top
        list = list.filter((c) => c.id !== selectedCategory);
        list.unshift(selectedCatObj);
      }
    }
    return list.slice(0, 5);
  }, [sortedCategories, selectedCategory, categories]);

  const topTags = useMemo(() => {
    // Separate selected and unselected tags
    const selectedTagObjs = tags.filter((t) => selectedTags.includes(t.id));
    const unselectedTagObjs = sortedTags.filter(
      (t) => !selectedTags.includes(t.id),
    );

    // Show all selected tags, plus fill up to 5 with unselected tags
    const fillCount = Math.max(0, 5 - selectedTagObjs.length);
    return [...selectedTagObjs, ...unselectedTagObjs.slice(0, fillCount)];
  }, [sortedTags, selectedTags, tags]);

  const onSubmit = (data: any) => {
    const catName =
      categories.find((c) => c.id === data.category)?.name || "Other";

    const transactionData = {
      name: data.description || "Expense",
      category: catName,
      amount: -parseFloat(data.amount), // Ensure negative for expense
      date: data.date,
      time: existingTransaction
        ? existingTransaction.time
        : new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      type: "expense" as const,
      payment: data.payment,
      note: data.notes,
      tags: data.tags,
      recurring: data.isRecurring,
    };

    if (isEditMode && editId) {
      updateTransaction(editId, transactionData);
    } else {
      addTransaction(transactionData);
    }
    navigation.goBack();
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTags;
    if (current.includes(tagId)) {
      setValue(
        "tags",
        current.filter((id: string) => id !== tagId),
      );
    } else {
      setValue("tags", [...current, tagId]);
    }
  };

  const openCategorySheet = async () => {
    const result = await SheetManager.show("expense-category-sheet", {
      payload: { selectedId: selectedCategory },
    });
    if (result) {
      setValue("category", result);
    }
  };

  const openTagSheet = async () => {
    const result = await SheetManager.show("expense-tag-sheet", {
      payload: { selectedIds: selectedTags },
    });
    if (result) {
      setValue("tags", result);
    }
  };

  const openDateSheet = async () => {
    const result = await SheetManager.show("date-picker-sheet", {
      payload: { date: selectedDate },
    });
    if (result) {
      setValue("date", result);
    }
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <Header
        title={isEditMode ? "Edit Expense" : "Add Expense"}
        showBack={false}
      >
        <View style={styles.amountContainer}>
          <Text variant="caption" style={styles.amountLabel}>
            Amount
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol} variant="h1" weight="bold">
              $
            </Text>
            <Controller
              control={control}
              name="amount"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={[styles.amountInput, { fontFamily: getFont("bold") }]}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              )}
            />
          </View>
        </View>
      </Header>

      <View style={styles.content}>
        {/* Category Selection */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text weight="semiBold">{t("addExpense.category")}</Text>
          </View>
          <View style={styles.grid}>
            {topCategories.map((category) => (
              <CategoryItem
                key={category.id}
                item={category}
                isSelected={selectedCategory === category.id}
                onPress={() => setValue("category", category.id)}
              />
            ))}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={openCategorySheet}
            >
              <Feather
                name="more-horizontal"
                size={24}
                color={theme.colors.foreground}
              />
              <Text variant="caption">More</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Tags Selection */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text weight="semiBold">Tags</Text>
          </View>
          <View style={styles.gridTag}>
            {topTags.map((tag) => (
              <CategoryItem
                key={tag.id}
                item={tag}
                isSelected={selectedTags.includes(tag.id)}
                onPress={() => toggleTag(tag.id)}
                isTag
              />
            ))}
            <TouchableOpacity
              style={[styles.moreButton, styles.tagItem, { width: 60 }]}
              onPress={openTagSheet}
            >
              <Feather
                name="more-horizontal"
                size={20}
                color={theme.colors.foreground}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Payment Mode */}
        <Card>
          <Text weight="semiBold" style={styles.sectionLabel}>
            Payment Mode
          </Text>
          <View style={styles.paymentRow}>
            {paymentModes.map((mode) => (
              <Button
                key={mode}
                title={mode}
                variant={selectedPayment === mode ? undefined : "outline"}
                size="sm"
                onPress={() => setValue("payment", mode)}
                style={styles.paymentButton}
              />
            ))}
          </View>
        </Card>

        {/* Date Selection */}
        <Card>
          <DropDownButton
            label="Date"
            selectedValue={selectedDate}
            onPress={openDateSheet}
            leftIcon={
              <Icon
                type="Feather"
                name="calendar"
                size={20}
                color={theme.colors.mutedForeground}
              />
            }
          />
        </Card>

        {/* Details */}
        <Card>
          <Controller
            control={control}
            name="description"
            rules={{ required: "Description is required" }}
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
                style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Card>

        {/* Upload Receipt */}
        <Card>
          <Text weight="semiBold" style={styles.sectionLabel}>
            Receipt (Optional)
          </Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Feather
              name="upload"
              size={24}
              color={theme.colors.mutedForeground}
            />
            <Text variant="caption">Upload Receipt</Text>
          </TouchableOpacity>
        </Card>

        {/* Recurring */}
        <Card>
          <View style={styles.recurringRow}>
            <View>
              <Text weight="semiBold">Recurring Expense</Text>
              <Text variant="caption">
                Set this expense to repeat automatically
              </Text>
            </View>
            <Switch
              value={isRecurring}
              onValueChange={(val) => setValue("isRecurring", val)}
              trackColor={{
                false: theme.colors.muted,
                true: theme.colors.primary,
              }}
              thumbColor="white"
            />
          </View>
        </Card>

        <Button
          title={isEditMode ? "Update Expense" : "Add Expense"}
          size="lg"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
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
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  headerTitle: {
    color: "white",
  },
  amountContainer: {
    alignItems: "center",
    marginVertical: theme.margins.lg,
  },
  amountLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: theme.margins.xs,
  },
  currencySymbol: {
    color: "white",
    fontSize: 48,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    color: "white",
    fontSize: 48,
    minWidth: 100,
    textAlign: "center",
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
    width: "100%",
    maxWidth: {
      md: 600,
    },
    alignSelf: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.sm,
  },
  sectionLabel: {
    marginBottom: theme.margins.sm,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.margins.md,
  },
  gridTag: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.md,
  },
  selectionItem: {
    width: {
      xs: "30%",
      sm: "23%",
      md: "18%",
    },
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    gap: 4,
  },
  tagItem: {
    width: "auto",
    aspectRatio: undefined,
    height: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    borderRadius: 20,
  },
  selectionItemSelected: {
    borderColor: theme.colors.primary,
  },
  tagItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  moreButton: {
    width: {
      xs: "30%",
      sm: "23%",
      md: "18%",
    },
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  paymentRow: {
    flexDirection: "row",
    gap: theme.margins.sm,
    flexWrap: "wrap",
  },
  paymentButton: {
    flex: 1,
    minWidth: "45%",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.radius.lg,
    padding: theme.paddings.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.margins.sm,
  },
  recurringRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    marginTop: theme.margins.md,
    marginBottom: theme.margins.xl,
  },

  // Modal Styles
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.paddings.lg,
    maxHeight: "80%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.lg,
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.sm,
    paddingBottom: theme.paddings.md,
  },
  manageButton: {
    marginTop: theme.margins.md,
  },
}));
