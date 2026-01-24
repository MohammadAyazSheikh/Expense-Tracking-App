import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useFinanceStore } from "../store/financeStore";
import { alertService } from "../utils/alertService";
import { Category } from "../types";
import { useTranslation } from "../hooks/useTranslation";
import { Text } from "../components/ui/Text";
import { Icon, IconType } from "../components/ui/Icon";
import { SafeArea } from "@/components/ui/SafeArea";
import Fab from "@/components/ui/Fab";

export const CategoryManagerScreen = ({ navigation }: any) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { categories, deleteCategory } = useFinanceStore();

  const handleAddCategory = () => {
    SheetManager.show("category-sheet");
  };

  const handleEditCategory = (category: Category) => {
    SheetManager.show("category-sheet", {
      payload: { category },
    });
  };

  const handleDeleteCategory = (id: string) => {
    alertService.show(
      t("categoryManager.deleteConfirmTitle"),
      t("categoryManager.deleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleEditCategory(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        {/* Fallback to Ionicons if iconFamily is missing (legacy support) */}
        <Icon
          type={(item.iconFamily as IconType) || "Ionicons"}
          name={item.icon as any}
          size={24}
          color="white"
        />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteCategory(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={theme.colors.destructive}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeArea applyBottomInset style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("categoryManager.noCategories")}
            </Text>
          </View>
        }
      />
      <Fab onPress={handleAddCategory} />
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
