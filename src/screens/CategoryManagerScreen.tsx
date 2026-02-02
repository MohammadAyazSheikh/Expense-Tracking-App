import React, { useEffect, useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SheetManager } from "react-native-actions-sheet";
import { alertService } from "../utils/alertService";
import { useTranslation } from "../hooks/useTranslation";
import { Text } from "../components/ui/Text";
import { SafeArea } from "@/components/ui/SafeArea";
import Fab from "@/components/ui/Fab";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { CategoryCard } from "../components/categories/CategoryCard";
import { useCategoryStore } from "@/store/categoryStore";
import { Category } from "@/database/models/category";
import { ApiLoader } from "@/components/ui/ApiLoader";

export const CategoryManagerScreen = ({ navigation }: any) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { categories, isLoading, loadCategories, deleteCategory } =
    useCategoryStore();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "expense", title: t("transactions.expenses") },
    { key: "income", title: t("transactions.income") },
  ]);

  const handleAddCategory = () => {
    SheetManager.show("manage-category-sheet", {
      payload: { type: index === 0 ? "expense" : "income" },
    });
  };

  const handleEditCategory = (category: Category) => {
    SheetManager.show("manage-category-sheet", {
      payload: { category, type: index === 0 ? "expense" : "income" },
    });
  };

  const handleDeleteCategory = (category: Category) => {
    const isSystem = category.systemCategoryId;

    alertService.show(
      isSystem
        ? t("categoryManager.removeTitle")
        : t("categoryManager.deleteConfirmTitle"),
      isSystem
        ? t("categoryManager.removeMessage")
        : t("categoryManager.deleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: isSystem ? t("common.remove") : t("common.delete"),
          style: "destructive",
          onPress: () => deleteCategory(category.id),
        },
      ],
    );
  };

  useEffect(() => {
    const loadData = async () => {
      await loadCategories();
    };
    loadData();
  }, []);

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      onPress={() => handleEditCategory(item)}
      onAction={() => handleDeleteCategory(item)}
      actionIcon={
        item.systemCategoryId ? "remove-circle-outline" : "trash-outline"
      }
    />
  );

  const ExpenseRoute = () => (
    <FlatList
      data={categories.filter((c) => c.transactionTypeKey === "expense")}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("categoryManager.noCategories")}
          </Text>
        </View>
      }
    />
  );

  const IncomeRoute = () => (
    <FlatList
      data={categories.filter((c) => c.transactionTypeKey === "income")}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("categoryManager.noCategories")}
          </Text>
        </View>
      }
    />
  );

  const renderScene = SceneMap({
    expense: ExpenseRoute,
    income: IncomeRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.background }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.mutedForeground}
      labelStyle={{ fontWeight: "600" }}
    />
  );

  return (
    <SafeArea applyBottomInset style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      <Fab onPress={handleAddCategory} />
      <ApiLoader isLoading={isLoading} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.paddings.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.sm,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.margins.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  categoryTags: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  deleteButton: {
    padding: theme.paddings.sm,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: theme.margins.xl,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.md,
  },
}));
