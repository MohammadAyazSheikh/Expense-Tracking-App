import React, { useState } from "react";
import { View, Pressable } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  useSheetPayload,
  FlatList,
} from "react-native-actions-sheet";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SelectItem } from "./SelectSheet";

export interface MultiSelectOption {
  label: string;
  value: string;
  avatar?: string;
  leftIcon?: React.ReactNode;
}

export const MultiSelectSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const payload = useSheetPayload("multi-select-sheet");
  const options: MultiSelectOption[] = payload?.options || [];
  const title = payload?.title || "Select Items";
  const initialSelectedValues: string[] = payload?.selectedValues || [];

  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(
    initialSelectedValues
  );

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleDone = () => {
    SheetManager.hide(props.sheetId, { payload: selectedValues });
  };

  const handleCancel = () => {
    SheetManager.hide(props.sheetId);
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
        <Pressable onPress={handleCancel}>
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

      <View style={styles.selectedCount}>
        <Text variant="caption" style={{ color: theme.colors.mutedForeground }}>
          {selectedValues.length} selected
        </Text>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={filteredOptions}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No options found</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const leftIcon = item.avatar ? (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
          ) : (
            item.leftIcon
          );

          return (
            <SelectItem
              title={item.label}
              leftIcon={leftIcon}
              selected={selectedValues.includes(item.value)}
              onPress={() => toggleSelection(item.value)}
              multiSelect={true}
            />
          );
        }}
        keyExtractor={(item) => item.value}
      />

      <View style={styles.footer}>
        <Button
          title={`Done (${selectedValues.length})`}
          onPress={handleDone}
          size="lg"
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    height: (rt.screen.height / 100) * 85,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
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
  selectedCount: {
    paddingHorizontal: theme.paddings.md,
    paddingBottom: theme.paddings.sm,
  },
  content: {
    paddingHorizontal: theme.paddings.md,
    paddingBottom: 20,
  },
  footer: {
    padding: theme.paddings.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.lg,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
  },
}));
