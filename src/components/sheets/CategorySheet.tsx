import React, { useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  ScrollView,
  SheetProps,
  SheetManager,
  useSheetPayload,
  RouteScreenProps,
  Route,
} from "react-native-actions-sheet";

import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Icon } from "../ui/Icon";
import { Ionicons } from "@expo/vector-icons";
import { alertService } from "../../utils/alertService";
import { CategoryCard } from "../categories/CategoryCard";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "../../store";
import { useTranslation } from "../../hooks/useTranslation";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CATEGORY_GROUPS, CATEGORY_ICONS } from "../../utils/categoryIcons";
import { SystemCategory } from "@/database/models/category";
import { ApiLoader } from "../ui/ApiLoader";

const ManageCategory = ({
  router,
}: RouteScreenProps<"manage-category-sheet", "add-update-category">) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const { user } = useAuthStore();
  const { addCategory, updateCategory } = useCategoryStore();
  const payload = useSheetPayload("manage-category-sheet");

  const isEditing = !!payload?.category;

  const initialCategory = payload?.category;

  const [name, setName] = useState(initialCategory?.name || "");

  const [selectedIconKey, setSelectedIconKey] = useState(
    initialCategory
      ? Object.keys(CATEGORY_ICONS).find(
          (key) => CATEGORY_ICONS[key].name === initialCategory.icon,
        ) || CATEGORY_GROUPS[0].data[0]
      : CATEGORY_GROUPS[0].data[0],
  );
  const [selectedColor, setSelectedColor] = useState(
    initialCategory?.color || "#FF6B6B",
  );

  const handleSave = () => {
    if (!name.trim()) {
      alertService.show(t("common.error"), t("categoryManager.nameRequired"));
      return;
    }

    const iconConfig = CATEGORY_ICONS[selectedIconKey];

    const categoryData: any = {
      userId: user?.id!,
      name: name.trim(),
      icon: iconConfig.name as string,
      iconFamily: iconConfig.type as string,
      color: selectedColor,
      transactionTypeKey: payload?.type === "income" ? "income" : "expense",
      systemCategoryId: null,
    };

    if (isEditing && initialCategory) {
      updateCategory(initialCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    SheetManager.hide("manage-category-sheet");
  };

  const openColorPicker = async () => {
    const result = await SheetManager.show("color-picker-sheet", {
      payload: {
        selectedColor,
        title: t("categoryManager.selectColor"),
      },
    });

    if (result) {
      setSelectedColor(result);
    }
  };

  const selectedIconConfig = CATEGORY_ICONS[selectedIconKey];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3">
          {isEditing
            ? t("categoryManager.editCategory", {
                type: payload?.type?.toLocaleUpperCase(),
              })
            : t("categoryManager.newCategory", {
                type: payload?.type?.toLocaleUpperCase(),
              })}
        </Text>
        <TouchableOpacity
          onPress={() => SheetManager.hide("manage-category-sheet")}
        >
          <Ionicons name="close" size={24} color={theme.colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
      >
        {!isEditing && (
          <TouchableOpacity
            style={styles.pickSystemButton}
            onPress={() =>
              router.navigate("system-category-picker", {
                payload: { type: payload?.type },
              })
            }
          >
            <View style={styles.pickSystemIcon}>
              <Ionicons
                name="grid-outline"
                size={20}
                color={theme.colors.muted}
              />
            </View>
            <View style={styles.pickSystemContent}>
              <Text weight="semiBold">
                {t("categoryManager.suggestedCategories")}
              </Text>
              <Text style={{ color: theme.colors.mutedForeground }}>
                Pick from standard {payload?.type} categories
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.mutedForeground}
            />
          </TouchableOpacity>
        )}

        <View style={styles.previewContainer}>
          <View
            style={[styles.previewIcon, { backgroundColor: selectedColor }]}
          >
            {selectedIconConfig && (
              <Icon
                type={selectedIconConfig.type as any}
                name={selectedIconConfig.name as any}
                size={40}
                color="white"
              />
            )}
          </View>
          <TouchableOpacity onPress={openColorPicker}>
            <Text style={{ color: theme.colors.primary }}>
              {t("categoryManager.changeColor")}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text weight="medium" style={{ marginBottom: 8 }}>
            {t("categoryManager.categoryName")}
          </Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={t("categoryManager.namePlaceholder")}
          />
        </View>

        <Text weight="semiBold" style={styles.sectionTitle}>
          {t("categoryManager.selectIcon")}
        </Text>

        {CATEGORY_GROUPS.map((group) => (
          <View key={group.title}>
            <Text style={{ marginVertical: 8, fontSize: 12 }}>
              {group.title}
            </Text>
            <View style={styles.grid}>
              {group.data.map((iconKey) => (
                <IconItem
                  key={iconKey}
                  iconKey={iconKey}
                  isSelected={selectedIconKey === iconKey}
                  onPress={() => setSelectedIconKey(iconKey)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isEditing ? t("common.update") : t("common.save")}
          onPress={handleSave}
          size="lg"
        />
      </View>
    </View>
  );
};

const SystemPicker = ({
  router,
}: RouteScreenProps<"manage-category-sheet", "system-category-picker">) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const payload = useSheetPayload("manage-category-sheet");
  const {
    systemCategories: systemCat = [],
    addCategory,
    isLoading,
  } = useCategoryStore();

  const systemCategories = useMemo(
    () => systemCat.filter((cat) => cat.transactionTypeKey === payload?.type),
    [systemCat, payload?.type],
  );

  // Prefer params from navigation (local override), fallback to sheet payload
  const categoryType = payload?.type || "expense";

  const handleAddSystemCategory = (cat: SystemCategory) => {
    alertService.show("Do you want to add this category?", "", [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.yes"),
        style: "destructive",
        onPress: async () => {
          await addCategory({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            iconFamily: cat.iconFamily,
            systemCategoryId: cat.serverId,
            transactionTypeKey: categoryType,
          });
          SheetManager.hide("category-sheet");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </TouchableOpacity>
        <Text variant="h3">{t("categoryManager.suggestedCategories")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {systemCategories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.colors.mutedForeground }}>
              No more system categories available for {categoryType}.
            </Text>
          </View>
        ) : (
          systemCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat as any}
              onAction={() => handleAddSystemCategory(cat)}
              actionIcon="add-circle"
              style={{ paddingRight: 8 }}
            />
          ))
        )}
      </ScrollView>
      <ApiLoader isLoading={isLoading} />
    </View>
  );
};

const IconItem = ({
  iconKey,
  isSelected,
  onPress,
}: {
  iconKey: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const { theme } = useUnistyles();

  const iconConfig = CATEGORY_ICONS[iconKey];
  if (!iconConfig) return null;

  return (
    <TouchableOpacity style={styles.iconItem} onPress={onPress}>
      <Icon
        type={iconConfig.type as any}
        name={iconConfig.name}
        size={24}
        color={isSelected ? theme.colors.primary : theme.colors.foreground}
      />
    </TouchableOpacity>
  );
};

const routes: Route[] = [
  {
    name: "add-update-category",
    component: ManageCategory,
  },
  {
    name: "system-category-picker",
    component: SystemPicker,
  },
];

export const CategorySheet = (props: SheetProps<"manage-category-sheet">) => {
  const { sheetId } = props;
  const { theme } = useUnistyles();

  return (
    <ActionSheet
      id={sheetId}
      routes={routes}
      initialRoute="add-update-category"
      enableRouterBackNavigation={true}
      gestureEnabled={true}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      containerStyle={{ height: "90%" }}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    padding: theme.paddings.lg,
    paddingBottom: rt.insets.bottom + theme.paddings.lg,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.lg,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: theme.margins.lg,
    marginBottom: theme.margins.sm,
    color: theme.colors.mutedForeground,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: theme.margins.md,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.margins.sm,
  },
  footer: {
    gap: theme.margins.md,
    marginTop: theme.margins.lg,
  },
  pickSystemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickSystemContent: {
    flex: 1,
    paddingHorizontal: theme.paddings.md,
  },
  pickSystemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginRight: theme.margins.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.paddings.xl,
  },

  iconItem: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    variants: {
      selected: {
        true: {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primary + "10",
        },
      },
    },
  },
}));
