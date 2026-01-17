import React from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Feather } from "@expo/vector-icons";
import { Input, InputProps } from "./Input";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

interface SearchBarProps extends InputProps {
  badgeNumber?: number;
  onPressFilter?: () => void;
  elevated?: boolean;
}

export const SearchBar = (props: SearchBarProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({ elevated: props.elevated });
  return (
    <Input
      placeholder="Search..."
      style={styles.container}
      leftIcon={
        <Feather name="search" size={20} color={theme.colors.mutedForeground} />
      }
      rightIcon={
        props?.onPressFilter ? (
          <Pressable style={styles.filterButton} onPress={props.onPressFilter}>
            <Feather name="sliders" size={20} color="white" />
            {props?.badgeNumber && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{props.badgeNumber}</Text>
              </View>
            )}
          </Pressable>
        ) : null
      }
      {...props}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    variants: {
      elevated: {
        true: {
          ...theme.shadows.sm,
          borderWidth: 0,
          backgroundColor: theme.colors.card,
        },
      },
    },
  },
  filterButton: {
    padding: theme.paddings.xs,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.paddings.xs,
  },
  filterBadgeText: {
    color: "white",
    fontSize: theme.fontSize.xxs,
    fontWeight: "bold",
  },
}));
