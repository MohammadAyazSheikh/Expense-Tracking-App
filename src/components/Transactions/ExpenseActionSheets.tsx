import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, TextInput, SectionList } from "react-native";
import ActionSheet, {
  FlatList,
  SheetProps,
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import { Category, Tag } from "../../types";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { SearchBar } from "../ui/searchbar";

type ItemProps = {
  item: {
    id: string;
    name: string;
    color: string;
    icon?: string;
    iconFamily?: string;
    group?: string;
  };
  isSelected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
};

// Item Component
const Item = ({ item, isSelected, onPress, multiSelect }: ItemProps) => {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected]}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        {item.icon ? (
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Icon
              type={item.iconFamily as any}
              name={item.icon}
              size={16}
              color="white"
            />
          </View>
        ) : (
          <View style={[styles.dot, { backgroundColor: item.color }]} />
        )}
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
          {item.name}
        </Text>
      </View>
      <Icon
        type="Ionicons"
        name={
          multiSelect
            ? isSelected
              ? "checkbox"
              : "square-outline"
            : isSelected
            ? "radio-button-on"
            : "radio-button-off"
        }
        size={22}
        color={
          isSelected ? theme.colors.background : theme.colors.mutedForeground
        }
      />
    </TouchableOpacity>
  );
};

// Category Sheet
export const ExpenseCategorySheet = (
  props: SheetProps<"expense-category-sheet">
) => {
  const handlers = useScrollHandlers();
  const { categories } = useFinanceStore();
  const { selectedId } = props.payload || {};
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!categories.length) return [];
    return categories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const sections = useMemo(() => {
    const income = filteredItems.filter((item) => item.type === "income");
    const expense = filteredItems.filter((item) => item.type === "expense");
    return [
      { title: "Income", data: income },
      { title: "Expense", data: expense },
    ].filter((section) => section.data.length > 0);
  }, [filteredItems]);

  const handleSelect = (id: string) => {
    SheetManager.hide(props.sheetId, { payload: id });
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = selectedId === item.id;
    return (
      <Item
        item={item}
        isSelected={isSelected}
        onPress={() => handleSelect(item.id)}
        multiSelect={false}
      />
    );
  };

  return (
    <ActionSheet
      id={props.sheetId}
      indicatorStyle={styles.indicator}
      gestureEnabled
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h3">{t("categoryManager.title")}</Text>
          <TouchableOpacity onPress={() => SheetManager.hide(props.sheetId)}>
            <Text style={styles.cancelText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
        <SearchBar
          containerStyle={styles.searchOuterContainer}
          style={styles.searchWrapper}
          inputStyle={styles.searchInput}
          placeholder={t("common.search")}
          value={search}
          onChangeText={setSearch}
        />
        <NativeViewGestureHandler
          simultaneousHandlers={handlers.simultaneousHandlers}
        >
          <SectionList
            {...handlers.simultaneousHandlers}
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
              <View style={styles.groupHeader}>
                <Text
                  variant="caption"
                  weight="semiBold"
                  style={styles.groupTitle}
                >
                  {section.title}
                </Text>
              </View>
            )}
          />
        </NativeViewGestureHandler>
      </View>
    </ActionSheet>
  );
};

// Tag Sheet
export const ExpenseTagSheet = (props: SheetProps<"expense-tag-sheet">) => {
  const { tags } = useFinanceStore();
  const { selectedIds: initialSelectedIds } = props.payload || {
    selectedIds: [],
  };
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedIds || []
  );

  const filteredItems = useMemo(() => {
    if (!tags.length) return [];
    return tags.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    SheetManager.hide(props.sheetId, { payload: selectedIds });
  };

  const renderItem = ({ item }: { item: Tag }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <Item
        item={item}
        isSelected={isSelected}
        onPress={() => toggleSelect(item.id)}
        multiSelect={true}
      />
    );
  };

  return (
    <ActionSheet
      id={props.sheetId}
      indicatorStyle={styles.indicator}
      gestureEnabled
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h3">{t("filter.tags")}</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.applyText}>{t("common.done")}</Text>
          </TouchableOpacity>
        </View>

        <SearchBar
          containerStyle={styles.searchOuterContainer}
          style={styles.searchWrapper}
          inputStyle={styles.searchInput}
          placeholder={t("common.search")}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          style={{ maxHeight: 500 }}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    height: (rt.screen.height / 100) * 80,
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
    padding: theme.paddings.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  applyText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: theme.fontSize.md,
  },
  cancelText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.md,
  },
  searchOuterContainer: {
    margin: theme.margins.md,
  },
  searchWrapper: {
    backgroundColor: theme.colors.input,
    borderWidth: 0,
    height: 44,
  },
  searchInput: {
    fontSize: theme.fontSize.md,
  },
  listContent: {
    paddingHorizontal: theme.paddings.md,
    paddingBottom: 40,
  },
  groupHeader: {
    width: "100%",
    backgroundColor: theme.colors.background,
    paddingVertical: theme.paddings.sm,
    marginBottom: theme.margins.sm,
  },
  groupTitle: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.sm,
    marginLeft: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: theme.colors.primary + "10",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
  },
  itemName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
  },
  itemNameSelected: {
    color: theme.colors.background,
    fontWeight: "600",
  },
}));
