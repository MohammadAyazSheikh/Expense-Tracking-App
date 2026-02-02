import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/Text";
import { Icon, IconType } from "../ui/Icon";
import { Category } from "@/database/models/category";
import { Card } from "../ui/Card";

interface CategoryRowProps {
  category: Category;
  onPress?: () => void;
  onAction?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  showSystemLabel?: boolean;
  style?: ViewStyle;
}

export const CategoryCard = ({
  category,
  onPress,
  onAction,
  actionIcon,
  showSystemLabel = true,
  style,
}: CategoryRowProps) => {
  const { theme } = useUnistyles();
  return (
    <Card style={[styles.categoryItem, style]} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: category.color! }]}
      >
        <Icon
          type={(category.iconFamily as IconType) || "Ionicons"}
          name={category.icon as any}
          size={24}
          color="white"
        />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category.name}
        </Text>
        {category.systemCategoryId && showSystemLabel && (
          <Text
            style={{
              fontSize: 10,
              color: theme.colors.mutedForeground,
              marginTop: 2,
            }}
          >
            System
          </Text>
        )}
      </View>
      {onAction && actionIcon && (
        <TouchableOpacity onPress={onAction} style={styles.actionButton}>
          <Ionicons
            name={actionIcon}
            size={20}
            color={theme.colors.destructive}
          />
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create((theme) => ({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.md,
    marginBottom: theme.margins.sm,
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
  actionButton: {
    padding: theme.paddings.sm,
  },
}));
