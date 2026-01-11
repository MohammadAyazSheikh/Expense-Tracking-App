import React from "react";
import { View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon, IconType } from "../ui/Icon";
import { Button } from "../ui/Button";

export interface MenuItem {
  label: string;
  icon?: string;
  iconType?: IconType;
  onPress: () => void;
  variant?: "default" | "destructive";
}

export const MenuSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const payload = useSheetPayload("menu-sheet");
  const options: MenuItem[] = payload?.options || [];
  const title = payload?.title;

  const handlePress = (item: MenuItem) => {
    SheetManager.hide("menu-sheet");
    setTimeout(() => {
      item.onPress();
    }, 100);
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      gestureEnabled={true}
    >
      <View style={styles.content}>
        {title && (
          <Text weight="bold" style={styles.title}>
            {title}
          </Text>
        )}
        {options.map((item, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => handlePress(item)}
          >
            <View style={styles.iconContainer}>
              {item.icon && (
                <Icon
                  type={item.iconType || "Feather"}
                  name={item.icon as any}
                  size={20}
                  color={
                    item.variant === "destructive"
                      ? theme.colors.destructive
                      : theme.colors.foreground
                  }
                />
              )}
            </View>
            <Text
              style={[
                styles.menuLabel,
                item.variant === "destructive" && {
                  color: theme.colors.destructive,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
        <Button
          title="Cancel"
          onPress={() => SheetManager.hide("menu-sheet")}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: theme.paddings.xl,
  },
  content: {
    padding: theme.paddings.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.margins.lg,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.paddings.md,
    marginBottom: theme.margins.xs,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    marginRight: theme.margins.md,
  },
  menuLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
  },
}));
