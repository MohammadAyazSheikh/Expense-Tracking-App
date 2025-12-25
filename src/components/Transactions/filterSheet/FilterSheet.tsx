import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  Route,
  RouteScreenProps,
  useSheetPayload,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
// Calendar import removed
import { useFinanceStore } from "../../../store";

import { useTranslation } from "../../../hooks/useTranslation";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";
import { Category, Tag } from "../../../types";
import { CategorySelectSheet, TagsSelectSheet } from "./MultiSelectSheet";
import { Button } from "../../ui/Button";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export type DateRange = "today" | "week" | "month" | "year" | "all" | "custom";

export interface FilterState {
  type: "all" | "income" | "expense";
  categories: string[];
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  tags: string[];
}

const SelectedItem = ({
  item,
  onRemove,
  type = "category",
}: {
  item: Category | Tag;
  onRemove: () => void;
  type?: "category" | "tag";
}) => {
  return (
    <View style={styles.selectedItem}>
      {type === "category" ? (
        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
          <Icon
            size={14}
            color="white"
            type={(item as Category).iconFamily as any}
            name={(item as Category).icon}
          />
        </View>
      ) : (
        <View style={[styles.tagDot, { backgroundColor: item.color }]} />
      )}
      <Text style={styles.selectedItemText}>{item.name}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Icon type="Ionicons" name="close-circle" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );
};
type SelectedTypeProp = {
  title: string;
  selected: boolean;
  onPress: () => void;
};
const SelectedType = ({ title, selected, onPress }: SelectedTypeProp) => {
  return (
    <TouchableOpacity
      style={[styles.dateRangeButton, selected && styles.dateRangeButtonActive]}
      onPress={onPress}
    >
      <Text
        style={[styles.dateRangeText, selected && styles.dateRangeTextActive]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const FilterSheet = ({
  params,
  router,
}: RouteScreenProps<"filter-sheet", "main">) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const payload = useSheetPayload("filter-sheet");
  const { categories, tags } = useFinanceStore();
  const [filters, setFilters] = useState<FilterState>(
    payload?.initialFilters || {
      type: "all",
      categories: [],
      dateRange: "all",
      tags: [],
    }
  );

  const selectedCategories = categories.filter((c) =>
    filters.categories.includes(c.id)
  );
  const selectedTags = tags.filter((t) => filters.tags.includes(t.id));

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: "today", label: t("filter.today", "Today") },
    { value: "week", label: t("filter.thisWeek", "This Week") },
    { value: "month", label: t("filter.thisMonth", "This Month") },
    { value: "year", label: t("filter.thisYear", "This Year") },
    { value: "all", label: t("filter.allTime", "All Time") },
    { value: "custom", label: t("filter.custom", "Custom") },
  ];

  const handleTypeSelect = (type: FilterState["type"]) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const openCategorySelector = () => {
    router.navigate("category-select-sheet", {
      payload: {
        selectedIds: filters.categories,
      },
    });
  };

  const openTagSelector = () => {
    router.navigate("tags-select-sheet", {
      payload: {
        selectedIds: filters.tags,
      },
    });
  };

  const handleDateRangeSelect = (range: DateRange) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
      customStartDate: range !== "custom" ? undefined : prev.customStartDate,
      customEndDate: range !== "custom" ? undefined : prev.customEndDate,
    }));
  };

  const handleReset = () => {
    setFilters({
      type: "all",
      categories: [],
      dateRange: "all",
      tags: [],
    });
  };

  const handleApply = () => {
    SheetManager.hide("filter-sheet", { payload: filters });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Select Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const selectedTagIds = params?.selectedTagIds;
    const selectedCatIds = params?.selectedCatIds;
    const fromSheet = params?.fromSheet;
    if (fromSheet === "category")
      setFilters((prev) => ({ ...prev, categories: selectedCatIds }));

    if (fromSheet === "tag")
      setFilters((prev) => ({ ...prev, tags: selectedTagIds }));
  }, [params]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => SheetManager.hide("filter-sheet")}>
          <Text style={styles.cancelButton}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("filter.title")}</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>{t("common.reset")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Range Filter */}
        <Text weight="semiBold" style={styles.sectionTitle}>
          {t("filter.dateRange")}
        </Text>
        <View style={styles.dateRangeContainer}>
          {dateRangeOptions.map((option) => (
            <SelectedType
              key={option.value}
              title={option.label}
              selected={filters.dateRange === option.value}
              onPress={() => handleDateRangeSelect(option.value)}
            />
          ))}
        </View>

        {/* Custom Date Pickers */}
        {filters.dateRange === "custom" && (
          <View style={styles.customDateContainer}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={async () => {
                const result = await SheetManager.show("date-picker-sheet", {
                  payload: { date: filters.customStartDate },
                });
                if (result) {
                  setFilters((prev) => ({
                    ...prev,
                    customStartDate: result,
                  }));
                }
              }}
            >
              <Icon
                type="Ionicons"
                name="calendar-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.datePickerText}>
                {formatDate(filters.customStartDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={async () => {
                const result = await SheetManager.show("date-picker-sheet", {
                  payload: { date: filters.customEndDate },
                });
                if (result) {
                  setFilters((prev) => ({
                    ...prev,
                    customEndDate: result,
                  }));
                }
              }}
            >
              <Icon
                type="Ionicons"
                name="calendar-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.datePickerText}>
                {formatDate(filters.customEndDate)}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transaction Type Filter */}
        <Text weight="semiBold" style={styles.sectionTitle}>
          {t("filter.transactionType")}
        </Text>
        <View style={styles.dateRangeContainer}>
          {(["all", "income", "expense"] as const).map((type) => (
            <SelectedType
              key={type}
              title={t(
                `transactions.${type === "expense" ? "expenses" : type}`
              )}
              selected={filters.type === type}
              onPress={() => handleTypeSelect(type)}
            />
          ))}
        </View>

        {/* Categories Filter */}
        <View style={styles.sectionHeader}>
          <Text weight="semiBold" style={styles.sectionTitleHeader}>
            {t("categoryManager.title")}
          </Text>
          <TouchableOpacity
            onPress={openCategorySelector}
            style={styles.addButton}
          >
            <Icon
              type="Ionicons"
              name="add-circle"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedItemsContainer}>
          {selectedCategories.length === 0 ? (
            <Text style={styles.emptyText}>
              {t("filter.allCategories", "All Categories")}
            </Text>
          ) : (
            selectedCategories.map((c) => (
              <SelectedItem
                key={c.id}
                item={c}
                onRemove={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categories: prev.categories.filter((id) => id !== c.id),
                  }))
                }
              />
            ))
          )}
        </View>

        {/* Tags Filter */}
        <View style={styles.sectionHeader}>
          <Text weight="semiBold" style={styles.sectionTitleHeader}>
            {t("filter.tags", "Tags")}
          </Text>
          <TouchableOpacity onPress={openTagSelector} style={styles.addButton}>
            <Icon
              type="Ionicons"
              name="add-circle"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedItemsContainer}>
          {selectedTags.length === 0 ? (
            <Text style={styles.emptyText}>{t("filter.allTags")}</Text>
          ) : (
            selectedTags.map((tag) => (
              <SelectedItem
                key={tag.id}
                item={tag}
                type="tag"
                onRemove={() =>
                  setFilters((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((id) => id !== tag.id),
                  }))
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t("filter.applyFilters")} onPress={handleApply} />
      </View>
    </View>
  );
};

const routes: Route[] = [
  {
    name: "main",
    component: FilterSheet,
  },
  {
    name: "tags-select-sheet",
    component: TagsSelectSheet,
  },
  {
    name: "category-select-sheet",
    component: CategorySelectSheet,
  },
];

function FilterSheetWithRouter(props: SheetProps) {
  return (
    <ActionSheet
      routes={routes}
      initialRoute="main"
      enableRouterBackNavigation={true}
    />
  );
}

export default FilterSheetWithRouter;

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderTopEndRadius: theme.radius.xl,
    borderTopStartRadius: theme.radius.xl,
    paddingBottom: theme.paddings.md,
  },
  indicator: {
    backgroundColor: theme.colors.border,
    width: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  cancelButton: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.md,
  },
  resetButton: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
  },
  content: {
    padding: theme.paddings.md,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    marginTop: theme.margins.lg,
    marginBottom: theme.margins.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.margins.lg,
    marginBottom: theme.margins.md,
  },
  sectionTitleHeader: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
  },
  addButton: {
    padding: 2,
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 40,
    alignItems: "center",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.input,
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  selectedItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  removeButton: {
    marginLeft: 2,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    fontStyle: "italic",
    fontSize: theme.fontSize.sm,
  },
  dateRangeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateRangeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dateRangeText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.sm,
  },
  dateRangeTextActive: {
    color: theme.colors.primaryForeground,
  },
  customDateContainer: {
    marginTop: theme.margins.md,
    gap: 12,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  datePickerText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.sm,
  },
  typeContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.input,
    borderRadius: theme.radius.md,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.radius.sm,
    variants: {
      active: {
        true: {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.foreground,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
      },
    },
  },
  typeText: {
    color: theme.colors.mutedForeground,
    fontWeight: "500",
    variants: {
      active: {
        true: {
          color: theme.colors.foreground,
          fontWeight: "600",
        },
      },
    },
  },
  footer: {
    padding: theme.paddings.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));
