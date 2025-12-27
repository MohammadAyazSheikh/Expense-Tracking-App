import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, TextInput, SectionList } from "react-native";
import { FlatList, RouteScreenProps } from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useTranslation } from "../../../hooks/useTranslation";
import { useFinanceStore } from "../../../store";
import { Category, Tag } from "../../../types";
import { Text } from "../../ui/Text";
import { Icon } from "../../ui/Icon";
import { SearchBar } from "../../ui/searchbar";

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
const Item = ({ item, isSelected, toggleSelect }: ItemProps) => {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected]}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.itemLeft}>
        {item.icon && (
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Icon
              type={item.iconFamily as any}
              name={item.icon}
              size={16}
              color="white"
            />
          </View>
        )}
        {!item.icon && (
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
    if (!categories.length) return [];
    return categories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const sections = useMemo(() => {
    if (!categories.length) return [];

    const income = categories.filter((item) => item.type === "income");
    const expense = categories.filter((item) => item.type === "expense");
    return [
      {
        title: "Income",
        data: income,
      },
      {
        title: "Expense",
        data: expense,
      },
    ];
  }, [filteredItems]);

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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.groupHeader}>
            <Text variant="caption" weight="semiBold" style={styles.groupTitle}>
              {section.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

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
