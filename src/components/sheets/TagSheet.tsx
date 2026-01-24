import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store";
import { Tag } from "../../types";
import { alertService } from "../../utils/alertService";

export const TagSheet = (props: SheetProps<"tag-sheet">) => {
  const { sheetId, payload } = props;
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { addTag, updateTag } = useFinanceStore();

  const isEditing = !!payload?.tag;
  const initialTag = payload?.tag;

  const [name, setName] = useState(initialTag?.name || "");
  const [selectedColor, setSelectedColor] = useState(
    initialTag?.color || "hsl(255, 70%, 65%)",
  );

  const handleSave = () => {
    if (!name.trim()) {
      alertService.show(
        t("common.error"),
        t("tags.nameRequired", "Tag name is required"),
      );
      return;
    }

    const tagData: Omit<Tag, "id"> = {
      name: name.trim(),
      color: selectedColor,
    };

    if (isEditing && initialTag) {
      updateTag(initialTag.id, tagData);
    } else {
      addTag(tagData);
    }

    SheetManager.hide(sheetId);
  };

  const openColorPicker = async () => {
    const result = await SheetManager.show("color-picker-sheet", {
      payload: {
        selectedColor,
        title: t("tags.selectColor", "Select Color"),
      },
    });

    if (result) {
      setSelectedColor(result);
    }
  };

  return (
    <ActionSheet
      id={sheetId}
      gestureEnabled={true}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      containerStyle={styles.container}
    >
      <View>
        <View style={styles.header}>
          <Text variant="h3">
            {isEditing
              ? t("tags.editTag", "Edit Tag")
              : t("tags.addNew", "Add New Tag")}
          </Text>
          <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
            <Ionicons name="close" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View>
            <Text weight="medium" style={{ marginBottom: 8 }}>
              {t("tags.name", "Tag Name")}
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder={t("tags.namePlaceholder", "e.g., Business")}
              autoFocus={!isEditing}
            />
          </View>

          <View>
            <Text weight="medium">{t("tags.color", "Color")}</Text>
            <TouchableOpacity
              style={styles.colorPreviewContainer}
              onPress={openColorPicker}
            >
              <View
                style={[styles.colorCircle, { backgroundColor: selectedColor }]}
              />
              <Text>{t("tags.selectColor", "Select Color")}</Text>
              <View style={{ flex: 1 }} />
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        </View>

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

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    padding: theme.paddings.lg,
    paddingBottom: rt.insets.bottom + theme.paddings.lg,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.lg,
  },
  content: {
    gap: theme.margins.lg,
  },
  colorPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.paddings.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginTop: theme.margins.sm,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  footer: {
    marginTop: theme.margins.xl,
  },
}));
