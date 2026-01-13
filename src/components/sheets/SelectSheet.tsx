import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/Input";

export interface SelectorOption {
  label: string;
  value: string;
  icon?: string;
}

export const SelectSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const payload = useSheetPayload("select-sheet");
  const options: SelectorOption[] = payload?.options || [];
  const title = payload?.title || "Select";
  const selectedValue = payload?.selectedValue;

  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    SheetManager.hide("select-sheet", { payload: value });
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      gestureEnabled={true}
      keyboardHandlerEnabled={true}
    >
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>
          {title}
        </Text>
        <Pressable onPress={() => SheetManager.hide("select-sheet")}>
          <Icon
            type="Feather"
            name="x"
            size={24}
            color={theme.colors.mutedForeground}
          />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          leftIcon={
            <Icon
              type="Feather"
              name="search"
              size={18}
              color={theme.colors.mutedForeground}
            />
          }
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredOptions.length === 0 ? (
          <Text style={styles.emptyText}>No options found</Text>
        ) : (
          filteredOptions.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.optionItem,
                selectedValue === item.value && styles.selectedOption,
              ]}
              onPress={() => handleSelect(item.value)}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selectedValue === item.value && styles.selectedLabel,
                ]}
              >
                {item.label}
              </Text>
              {selectedValue === item.value && (
                <Icon
                  type="Feather"
                  name="check"
                  size={20}
                  color={theme.colors.primary}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    height: (rt.screen.height / 100) * 80,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
  },
  searchContainer: {
    padding: theme.paddings.md,
  },
  content: {
    paddingHorizontal: theme.paddings.md,
    paddingBottom: 40,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.paddings.md,
    paddingHorizontal: theme.paddings.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + "10",
    borderBottomWidth: 0,
  },
  optionLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
  },
  selectedLabel: {
    color: theme.colors.background,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.lg,
  },
}));
