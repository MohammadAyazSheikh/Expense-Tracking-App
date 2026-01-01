import React, { useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { FlatList, RouteScreenProps } from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useTranslation } from "../../../hooks/useTranslation";
import { useFinanceStore } from "../../../store";
import { Category, Tag } from "../../../types";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";
import { SearchBar } from "../../ui/searchbar";
import { TabView } from "../../ui/TabView";

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
  toggleSelect: (id: string) => void;
};

// Item Component
const Item = ({ item, isSelected, toggleSelect }: ItemProps) => {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected]}
      onPress={() => toggleSelect(item.id)}
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
        name={isSelected ? "checkbox" : "square-outline"}
        size={22}
        color={
          isSelected ? theme.colors.background : theme.colors.mutedForeground
        }
      />
    </TouchableOpacity>
  );
};

export const CategorySelectSheet = ({
  router,
  params,
}: RouteScreenProps<"filter-sheet", "category-select-sheet">) => {
  const { categories } = useFinanceStore();
  const { selectedIds: selectedIds_ } = params;
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedIds_ || []);

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

  // Determine which tabs have selected categories
  const hasSelectedInIncome = useMemo(() => {
    return categories.some(
      (cat) => cat.type === "income" && selectedIds.includes(cat.id)
    );
  }, [categories, selectedIds]);

  const hasSelectedInExpense = useMemo(() => {
    return categories.some(
      (cat) => cat.type === "expense" && selectedIds.includes(cat.id)
    );
  }, [categories, selectedIds]);

  const toggleSelect = (id: string) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
  };

  const handleApply = () => {
    router.navigate("main", {
      fromSheet: "category",
      selectedCatIds: selectedIds,
    });
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <Item item={item} isSelected={isSelected} toggleSelect={toggleSelect} />
    );
  };

  // Define routes
  const routes = [
    {
      key: "income",
      title: "Income",
      badge: hasSelectedInIncome,
    },
    {
      key: "expense",
      title: "Expense",
      badge: hasSelectedInExpense,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">{t("categoryManager.title")}</Text>
        <TouchableOpacity onPress={handleApply}>
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
      <TabView
        routes={routes}
        screens={{
          income: IncomeScene,
          expense: ExpenseScene,
        }}
      />
    </View>
  );
};

export const TagsSelectSheet = ({
  router,
  params,
}: RouteScreenProps<"filter-sheet", "tags-select-sheet">) => {
  const { tags } = useFinanceStore();
  const { selectedIds: selectedIds_ } = params;
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedIds_ || []);

  const filteredItems = useMemo(() => {
    if (!tags.length) return [];
    return tags.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  const toggleSelect = (id: string) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
  };

  const handleApply = () => {
    router.navigate("main", {
      fromSheet: "tag",
      selectedTagIds: selectedIds,
    });
  };

  const renderItem = ({ item }: { item: Tag }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <Item item={item} isSelected={isSelected} toggleSelect={toggleSelect} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">{t("tags.title")}</Text>
        <TouchableOpacity onPress={handleApply}>
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
