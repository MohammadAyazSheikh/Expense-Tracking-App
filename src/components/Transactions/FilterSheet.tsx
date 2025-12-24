import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  ScrollView,
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet } from "react-native-unistyles";
import { Calendar } from "react-native-calendars";
import { useFinanceStore } from "../../store";
import { useTranslation } from "../../hooks/useTranslation";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Category, Tag } from "../../types";
import { FilterState, DateRange } from "./FilterModal";

const FilterTypeButton = ({
  type,
  isActive,
  onPress,
  label,
}: {
  type: string;
  isActive: boolean;
  onPress: () => void;
  label: string;
}) => {
  styles.useVariants({
    active: isActive,
  });

  return (
    <TouchableOpacity style={styles.typeButton} onPress={onPress}>
      <Text style={styles.typeText}>{label}</Text>
    </TouchableOpacity>
  );
};

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

export const FilterSheet = (props: SheetProps<"filter-sheet">) => {
  const { t } = useTranslation();
  const { categories, tags } = useFinanceStore();
  const [filters, setFilters] = useState<FilterState>(
    props.payload?.initialFilters || {
      type: "all",
      categories: [],
      dateRange: "all",
      tags: [],
    }
  );
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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
    SheetManager.show("multi-select-sheet", {
      payload: {
        title: t("categoryManager.title"),
        items: categories.map((c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          icon: c.icon,
          iconFamily: c.iconFamily,
          group: t(
            `transactions.${c.type === "income" ? "income" : "expenses"}`
          ),
        })),
        selectedIds: filters.categories,
        onSelect: (ids) => setFilters((prev) => ({ ...prev, categories: ids })),
      },
    });
  };

  const openTagSelector = () => {
    SheetManager.show("multi-select-sheet", {
      payload: {
        title: t("filter.tags", "Tags"),
        items: tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
        selectedIds: filters.tags,
        onSelect: (ids) => setFilters((prev) => ({ ...prev, tags: ids })),
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
    SheetManager.hide(props.sheetId, { payload: filters });
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

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={styles.indicator}
      gestureEnabled
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => SheetManager.hide(props.sheetId)}>
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
          {t("filter.dateRange", "Date Range")}
        </Text>
        <View style={styles.dateRangeContainer}>
          {dateRangeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dateRangeButton,
                filters.dateRange === option.value &&
                  styles.dateRangeButtonActive,
              ]}
              onPress={() => handleDateRangeSelect(option.value)}
            >
              <Text
                style={[
                  styles.dateRangeText,
                  filters.dateRange === option.value &&
                    styles.dateRangeTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Date Pickers */}
        {filters.dateRange === "custom" && (
          <View style={styles.customDateContainer}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowStartCalendar(!showStartCalendar)}
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

            {showStartCalendar && (
              <Calendar
                onDayPress={(day: any) => {
                  setFilters((prev) => ({
                    ...prev,
                    customStartDate: day.dateString,
                  }));
                  setShowStartCalendar(false);
                }}
                markedDates={
                  filters.customStartDate
                    ? { [filters.customStartDate]: { selected: true } }
                    : {}
                }
                theme={{
                  selectedDayBackgroundColor: "#6C63FF",
                  todayTextColor: "#6C63FF",
                }}
              />
            )}

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowEndCalendar(!showEndCalendar)}
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

            {showEndCalendar && (
              <Calendar
                onDayPress={(day: any) => {
                  setFilters((prev) => ({
                    ...prev,
                    customEndDate: day.dateString,
                  }));
                  setShowEndCalendar(false);
                }}
                markedDates={
                  filters.customEndDate
                    ? { [filters.customEndDate]: { selected: true } }
                    : {}
                }
                theme={{
                  selectedDayBackgroundColor: "#6C63FF",
                  todayTextColor: "#6C63FF",
                }}
              />
            )}
          </View>
        )}

        {/* Transaction Type Filter */}
        <Text weight="semiBold" style={styles.sectionTitle}>
          {t("filter.transactionType")}
        </Text>
        <View style={styles.typeContainer}>
          {(["all", "income", "expense"] as const).map((type) => (
            <FilterTypeButton
              key={type}
              type={type}
              isActive={filters.type === type}
              onPress={() => handleTypeSelect(type)}
              label={t(
                `transactions.${type === "expense" ? "expenses" : type}`
              )}
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
            <Icon type="Ionicons" name="add-circle" size={24} color="#6C63FF" />
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
            <Icon type="Ionicons" name="add-circle" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedItemsContainer}>
          {selectedTags.length === 0 ? (
            <Text style={styles.emptyText}>
              {t("filter.allTags", "All Tags")}
            </Text>
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
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>{t("filter.applyFilters")}</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderTopEndRadius: theme.radius.xl,
    borderTopStartRadius: theme.radius.xl,
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
  applyButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  applyButtonText: {
    color: theme.colors.primaryForeground,
    fontWeight: "bold",
    fontSize: theme.fontSize.md,
  },
}));
