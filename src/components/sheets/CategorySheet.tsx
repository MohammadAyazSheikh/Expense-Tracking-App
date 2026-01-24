import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  ScrollView,
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Icon } from "../ui/Icon";
import { CATEGORY_GROUPS, CATEGORY_ICONS } from "../../utils/categoryIcons";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import { alertService } from "../../utils/alertService";

export const CategorySheet = (props: SheetProps<"category-sheet">) => {
  const { sheetId, payload } = props;
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { addCategory, updateCategory } = useFinanceStore();

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
      name: name.trim(),
      icon: iconConfig.name,
      iconFamily: iconConfig.type,
      color: selectedColor,
      type: "expense", // Default to expense
    };

    if (isEditing && initialCategory) {
      updateCategory(initialCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    SheetManager.hide(sheetId);
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
    <ActionSheet
      id={sheetId}
      gestureEnabled={true}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      containerStyle={styles.container}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text variant="h3">
            {isEditing
              ? t("categoryManager.editCategory")
              : t("categoryManager.newCategory")}
          </Text>
          <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
            <Ionicons name="close" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Preview */}
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

          {/* Name Input */}
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

          {/* Icon Selection */}
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
    </ActionSheet>
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
  styles.useVariants({
    selected: isSelected,
  });

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

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    padding: theme.paddings.lg,
    paddingBottom: rt.insets.bottom + theme.paddings.lg,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
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
}));
