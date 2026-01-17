import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import ActionSheet, {
  FlatList,
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import { Category, Tag } from "../../types";
import { SearchBar } from "../ui/searchbar";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { TabView } from "../ui/TabView";
import Checkbox from "../ui/Checkbox";
import RadioButton from "../ui/RadioButton";

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
  return (
    <Pressable style={[styles.item]} onPress={onPress}>
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
        <Text style={[styles.itemName]}>{item.name}</Text>
      </View>
      {multiSelect ? (
        <Checkbox checked={isSelected} />
      ) : (
        <RadioButton selected={isSelected} />
      )}
    </Pressable>
  );
};

// Category Sheet
export const ExpenseCategorySheet = (
  props: SheetProps<"expense-category-sheet">
) => {
  const { categories } = useFinanceStore();
  const { selectedId } = props.payload || {};
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!categories.length) return { income: [], expense: [] };
    const filtered = categories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      income: filtered.filter((item) => item.type === "income"),
      expense: filtered.filter((item) => item.type === "expense"),
    };
  }, [categories, search]);

  // Determine which tab has the selected category
  const selectedCategoryType = useMemo(() => {
    if (!selectedId) return null;
    const selected = categories.find((cat) => cat.id === selectedId);
    return selected?.type || null;
  }, [selectedId, categories]);

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

  // Define routes
  const routes = [
    {
      key: "income",
      title: "Income",
      badge: selectedCategoryType === "income",
    },
    {
      key: "expense",
      title: "Expense",
      badge: selectedCategoryType === "expense",
    },
  ];

  // Define scenes
  const IncomeScene = () => (
    <FlatList
      data={filteredItems.income}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
    />
  );

  const ExpenseScene = () => (
    <FlatList
      data={filteredItems.expense}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
    />
  );

  return (
    <ActionSheet
      id={props.sheetId}
      indicatorStyle={styles.indicator}
      gestureEnabled
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h2">{t("categoryManager.title")}</Text>
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
        <TabView
          routes={routes}
          screens={{
            income: IncomeScene,
            expense: ExpenseScene,
          }}
        />
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
          <Text variant="h2">{t("filter.tags")}</Text>
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
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    height: (rt.screen.height / 100) * 70,
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
    paddingVertical: theme.paddings.sm,
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
}));
