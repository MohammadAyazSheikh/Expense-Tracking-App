import React from "react";
import { View, TouchableOpacity } from "react-native";
import ActionSheet, {
  ScrollView,
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E67E22",
  "#2ECC71",
  "#1ABC9C",
  "#F1C40F",
  "#E74C3C",
  "#34495E",
  "#95A5A6",
  "#7F8C8D",
  "hsl(210, 80%, 55%)",
  "hsl(280, 70%, 60%)",
  "hsl(0, 75%, 60%)",
  "hsl(145, 70%, 50%)",
  "hsl(35, 85%, 55%)",
  "hsl(220, 70%, 55%)",
  "hsl(340, 70%, 60%)",
  "hsl(160, 70%, 50%)",
];

export const ColorPickerSheet = (props: SheetProps<"color-picker-sheet">) => {
  const { sheetId, payload } = props;
  const { theme } = useUnistyles();

  const handleSelect = (color: string) => {
    SheetManager.hide(sheetId, {
      payload: color,
    });
    if (payload?.onSelect) {
      payload.onSelect(color);
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
        <Text weight="bold" variant="h2" style={styles.title}>
          {payload?.title || "Select Color"}
        </Text>

        <ScrollView contentContainerStyle={styles.grid}>
          {COLORS.map((color) => (
            <ColorItem
              key={color}
              color={color}
              isSelected={payload?.selectedColor === color}
              onPress={() => handleSelect(color)}
            />
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => SheetManager.hide(sheetId)}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const ColorItem = ({
  color,
  isSelected,
  onPress,
}: {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  styles.useVariants({
    selected: isSelected,
  });

  return (
    <TouchableOpacity
      style={[styles.colorItem, { backgroundColor: color }]}
      onPress={onPress}
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
  },
  title: {
    marginBottom: theme.margins.lg,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    variants: {
      selected: {
        true: {
          borderWidth: 3,
          borderColor: theme.colors.background,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      },
    },
  },
  actions: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginTop: theme.margins.xl,
  },
}));
