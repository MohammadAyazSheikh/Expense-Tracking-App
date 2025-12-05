import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Calendar } from "react-native-calendars";
import { useFinanceStore } from "../../store";
import { useTranslation } from "../../hooks/useTranslation";
import { Text } from "../ui/Text";
import ModalWrapper from "../ui/ModalWrapper";
import { Icon } from "../ui/Icon";
import { Category, Tag } from "../../types";

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

const CategoryFilterButton = ({
  category,
  isActive,
  onPress,
}: {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}) => {
  styles.useVariants({
    active: isActive,
  });

  return (
    <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Icon
          size={16}
          color="white"
          type={category.iconFamily as any}
          name={category.icon}
        />
      </View>
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const TagFilterButton = ({
  tag,
  isActive,
  onPress,
}: {
  tag: Tag;
  isActive: boolean;
  onPress: () => void;
}) => {
  styles.useVariants({
    active: isActive,
  });

  return (
    <TouchableOpacity style={styles.tagButton} onPress={onPress}>
      <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
      <Text style={styles.tagText}>{tag.name}</Text>
    </TouchableOpacity>
  );
};

const DateRangeButton = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  styles.useVariants({
    active: isActive,
  });

  return (
    <TouchableOpacity style={styles.dateRangeButton} onPress={onPress}>
      <Text style={styles.dateRangeText}>{label}</Text>
    </TouchableOpacity>
  );
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { t } = useTranslation();
  const { categories, tags } = useFinanceStore();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter((id) => id !== categoryId),
        };
      } else {
        return { ...prev, categories: [...prev.categories, categoryId] };
      }
    });
  };

  const handleTagToggle = (tagId: string) => {
    setFilters((prev) => {
      const isSelected = prev.tags.includes(tagId);
      if (isSelected) {
        return {
          ...prev,
          tags: prev.tags.filter((id) => id !== tagId),
        };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
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
    onApply(filters);
    onClose();
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
    <ModalWrapper
      visible={visible}
      containerStyles={{ justifyContent: "flex-end" }}
      onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
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
              <DateRangeButton
                key={option.value}
                label={option.label}
                isActive={filters.dateRange === option.value}
                onPress={() => handleDateRangeSelect(option.value)}
              />
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
                      ? {
                          [filters.customStartDate]: { selected: true },
                        }
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
                      ? {
                          [filters.customEndDate]: { selected: true },
                        }
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
          <Text weight="semiBold" style={styles.sectionTitle}>
            {t("categoryManager.title")}
          </Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <CategoryFilterButton
                key={category.id}
                category={category}
                isActive={filters.categories.includes(category.id)}
                onPress={() => handleCategoryToggle(category.id)}
              />
            ))}
          </View>

          {/* Tags Filter */}
          <Text weight="semiBold" style={styles.sectionTitle}>
            {t("filter.tags", "Tags")}
          </Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TagFilterButton
                key={tag.id}
                tag={tag}
                isActive={filters.tags.includes(tag.id)}
                onPress={() => handleTagToggle(tag.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>
              {t("filter.applyFilters")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create((theme, context) => ({
  container: {
    backgroundColor: theme.colors.background,
    height: (context.screen.height / 100) * 85,
    borderTopEndRadius: theme.radius.xl,
    borderTopStartRadius: theme.radius.xl,
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
    paddingBottom: theme.paddings.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    marginTop: theme.margins.lg,
    marginBottom: theme.margins.md,
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
    variants: {
      active: {
        true: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
      },
    },
  },
  dateRangeText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.sm,
    variants: {
      active: {
        true: {
          color: theme.colors.primaryForeground,
        },
      },
    },
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
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
    variants: {
      active: {
        true: {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primary + "15",
        },
      },
    },
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.sm,
    variants: {
      active: {
        true: {
          color: theme.colors.primary,
        },
        false: {
          color: theme.colors.foreground,
        },
      },
    },
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
    variants: {
      active: {
        true: {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primary + "15",
        },
      },
    },
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagText: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.sm,
    variants: {
      active: {
        true: {
          color: theme.colors.primary,
        },
        false: {
          color: theme.colors.foreground,
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
