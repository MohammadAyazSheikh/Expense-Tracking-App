import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { useFinanceStore } from "../store/financeStore";
import { AddCategoryModal } from "../components/Category/AddCategoryModal";
import { alertService } from "../utils/AlertService";
import { Category } from "../types";
import { useTranslation } from "../hooks/useTranslation";
import { Text } from "../components/ui/Text";
import { Icon, IconType } from "../components/ui/Icon";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Button } from "../components/ui/Button";

export const CategoryManagerScreen = ({ navigation }: any) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { categories, addCategory, deleteCategory } = useFinanceStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddCategory = (categoryData: {
    name: string;
    icon: string;
    iconFamily: string;
    color: string;
    tags: string[];
  }) => {
    addCategory({
      ...categoryData,
      type: "expense", // Default to expense for now, can be extended
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
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
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
        {item.tags && item.tags.length > 0 && (
          <Text style={styles.categoryTags}>{item.tags.join(", ")}</Text>
        )}
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
    </View>
  );

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{t("categoryManager.title")}</Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

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
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddCategory}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.paddings.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  addButton: {
    padding: theme.paddings.sm,
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
