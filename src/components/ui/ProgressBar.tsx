import React from "react";
import { View, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "./Text";
import Animated from "react-native-reanimated";
import { LayoutAnimation } from "../../utils/Animation";
interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  color?: string;
  style?: ViewStyle;
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.margins.xs,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.full,
    overflow: "hidden",
  },
}));

export const ProgressBar = ({
  value,
  max,
  showLabel = false,
  color,
  style,
}: ProgressBarProps) => {
  const { theme } = useUnistyles();
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text variant="caption" weight="semiBold">
            {value.toFixed(0)}
          </Text>
          <Text variant="caption">{max.toFixed(0)}</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          layout={LayoutAnimation}
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color || theme.colors.primary,
            borderRadius: theme.radius.full,
          }}
        />
      </View>
    </View>
  );
};
