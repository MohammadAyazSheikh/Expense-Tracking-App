import React, { useCallback, useMemo, useState } from "react";
import { LegendList } from "@legendapp/list";
import { View, TouchableOpacity, Pressable } from "react-native";
import ActionSheet, {
  ScrollView,
  SheetProps,
  SheetManager,
  useSheetPayload,
  RouteScreenProps,
  Route,
} from "react-native-actions-sheet";
import { FlashList } from "@shopify/flash-list";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Icon } from "../ui/Icon";
import { Ionicons } from "@expo/vector-icons";
import { alertService } from "../../utils/alertService";
import { CategoryCard } from "../categories/CategoryCard";
import { useCategoryStore, useAuthStore } from "@/store";
import { useTranslation } from "../../hooks/useTranslation";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import {
  CATEGORY_GROUPS,
  CATEGORY_ICONS,
  CategoryGroup,
} from "../../utils/categoryIcons";
import { Category, SystemCategory } from "@/database/models/category";
import { ApiLoader } from "../ui/ApiLoader";
import { transactionTypes } from "@/data/dbConstantData";

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
  console.log(selectedIconKey);
  const handleSave = () => {
    if (!name.trim()) {
      alertService.show({
        title: t("common.error"),
        message: t("categoryManager.nameRequired"),
      });
      return;
    }

    const iconConfig = CATEGORY_ICONS[selectedIconKey];

    const categoryData: any = {
      userId: user?.id!,
      name: name.trim(),
      icon: iconConfig.name as string,
      iconFamily: iconConfig.type as string,
      color: selectedColor,
      transactionTypeId:
        payload?.type === "expense"
          ? transactionTypes[0].id
          : transactionTypes[1].id,
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

  const renderItem = useCallback(
    ({ item }: { item: CategoryGroup }) => (
      <View key={item.title}>
        <Text style={{ marginVertical: 8, fontSize: 12 }}>{item.title}</Text>
        <View style={styles.grid}>
          {item.data.map((iconKey: string, index: number) => (
            <IconItem
              key={index}
              iconKey={iconKey}
              isSelected={selectedIconKey === iconKey}
              onPress={() => setSelectedIconKey(iconKey)}
            />
          ))}
        </View>
      </View>
    ),
    [selectedIconKey],
  );

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
      <LegendList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        recycleItems
        data={CATEGORY_GROUPS}
        estimatedItemSize={50}
        extraData={selectedIconKey}
        keyExtractor={(item: CategoryGroup) => item.title}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListHeaderComponent={
          <CategoryFormHeader
            isEditing={isEditing}
            router={router}
            type={payload.type!}
            selectedColor={selectedColor}
            selectedIconConfig={selectedIconConfig}
            openColorPicker={openColorPicker}
            name={name}
            setName={setName}
          />
        }
      />
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

const CategoryFormHeader = ({
  isEditing,
  router,
  type,
  selectedColor,
  selectedIconConfig,
  openColorPicker,
  name,
  setName,
}: {
  isEditing: boolean;
  router: any;
  type: "expense" | "income";
  category?: Category;
  selectedColor: string;
  selectedIconConfig: any;
  openColorPicker: () => void;
  name: string;
  setName: (text: string) => void;
}) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  return (
    <View>
      {!isEditing && (
        <TouchableOpacity
          style={styles.pickSystemButton}
          onPress={() =>
            router.navigate("system-category-picker", {
              payload: { type },
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
              Pick from standard {type} categories
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
        <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
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
    </View>
  );
};

const SystemPicker = ({
  router,
}: RouteScreenProps<"manage-category-sheet", "system-category-picker">) => {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const payload = useSheetPayload("manage-category-sheet");
  const transactionTypeId =
    payload?.type === "expense"
      ? transactionTypes[0].id
      : transactionTypes[1].id;
  const {
    systemCategories: systemCat = [],
    addCategory,
    isLoading,
  } = useCategoryStore();

  const systemCategories = useMemo(
    () =>
      systemCat.filter((cat) => cat.transactionTypeId === transactionTypeId),
    [systemCat, transactionTypeId],
  );

  // Prefer params from navigation (local override), fallback to sheet payload
  const categoryType = payload?.type || "expense";

  const handleAddSystemCategory = async (cat: SystemCategory) => {
    await addCategory({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      iconFamily: cat.iconFamily,
      systemCategoryId: cat.serverId,
      transactionTypeId,
    });
    SheetManager.hide("manage-category-sheet");
    // alertService.show({
    //   title: "Do you want to add this category?",
    //   buttons: [
    //     { text: t("common.cancel"), style: "cancel" },
    //     {
    //       text: t("common.yes"),
    //       style: "destructive",
    //       onPress: async () => {
    //         await addCategory({
    //           name: cat.name,
    //           icon: cat.icon,
    //           color: cat.color,
    //           iconFamily: cat.iconFamily,
    //           systemCategoryId: cat.serverId,
    //           transactionTypeId,
    //         });
    //         SheetManager.hide("category-sheet");
    //       },
    //     },
    //   ],
    // });
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
    <Pressable
      style={[
        styles.iconItem,
        isSelected && { borderColor: theme.colors.primary },
      ]}
      onPress={onPress}
    >
      <Icon
        type={iconConfig.type as any}
        name={iconConfig.name}
        size={24}
        color={isSelected ? theme.colors.primary : theme.colors.mutedForeground}
      />
    </Pressable>
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
      useBottomSafeAreaPadding
      id={sheetId}
      routes={routes}
      initialRoute="add-update-category"
      enableRouterBackNavigation
      gestureEnabled={false}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      containerStyle={{ height: "90%" }}
    />
  );
};

const MIN = 50;
const G = 10;

const styles = StyleSheet.create((theme, rt) => {
  const W = rt.screen.width - theme.margins.lg * 2;
  const columns = Math.floor(W / (MIN + G));
  const itemSize = (W - G * (columns - 1)) / columns;
  return {
    container: {
      padding: theme.paddings.lg,
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
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    iconItem: {
      width: itemSize,
      height: itemSize,
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
  };
});
