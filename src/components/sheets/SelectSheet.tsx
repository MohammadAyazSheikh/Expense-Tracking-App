import React, { useState } from "react";
import { View, Pressable } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
  useSheetPayload,
  ScrollView,
} from "react-native-actions-sheet";
import { LegendList } from "@legendapp/list";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/Input";
import Checkbox from "../ui/Checkbox";

export interface SelectorOption {
  label: string;
  value: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ItemProps = {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
};

// Item Component
export const SelectItem = ({
  title,
  leftIcon,
  rightIcon,
  selected,
  onPress,
  multiSelect,
}: ItemProps) => {
  const { theme } = useUnistyles();
  return (
    <Pressable
      style={[styles.item, selected && styles.selected]}
      onPress={onPress}
    >
      <View style={[styles.itemLeft]}>
        {leftIcon}
        <Text weight={selected ? "bold" : "regular"} style={[styles.itemName]}>
          {title}
        </Text>
        {<View style={styles.itemRight}>{rightIcon}</View>}
      </View>
      {multiSelect ? (
        <Checkbox checked={selected} />
      ) : (
        selected && (
          <Icon
            type="Feather"
            name="check"
            size={20}
            color={theme.colors.primary}
          />
        )
      )}
    </Pressable>
  );
};

export const SelectSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const payload = useSheetPayload("select-sheet");
  const options: SelectorOption[] = payload?.options || [];
  const title = payload?.title || "Select";
  const selectedValue = payload?.selectedValue;

  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
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
        <Pressable
          onPress={() =>
            SheetManager.hide("select-sheet", { payload: selectedValue })
          }
        >
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
      <LegendList
        contentContainerStyle={styles.content}
        data={filteredOptions}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No options found</Text>
        }
        renderScrollComponent={(props) => <ScrollView {...props} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <SelectItem
            title={item.label}
            selected={selectedValue === item.value}
            onPress={() => handleSelect(item.value)}
            leftIcon={item.leftIcon}
            rightIcon={item.rightIcon}
          />
        )}
      />
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
  content: {
    paddingHorizontal: theme.paddings.md,
    paddingBottom: 40,
  },

  emptyText: {
    textAlign: "center",
    color: theme.colors.mutedForeground,
    marginTop: theme.margins.lg,
  },
  // Item Component Styles
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  selected: {
    // backgroundColor: theme.colors.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemRight: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: theme.paddings.md,
  },
  itemName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
  },
}));
