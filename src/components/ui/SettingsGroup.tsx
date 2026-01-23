import React from "react";
import { View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "./Text";
import { Card } from "./Card";
import Animated from "react-native-reanimated";
import { LayoutAnimation } from "../../utils/animation";

interface SettingsGroupProps {
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

export const SettingsGroup = ({
  title,
  children,
  containerStyle,
  cardStyle,
  rightElement,
}: SettingsGroupProps) => {
  return (
    <Animated.View
      layout={LayoutAnimation}
      style={[styles.container, containerStyle]}
    >
      {title && (
        <View style={styles.titleContainer}>
          <Text variant="caption" weight="semiBold" style={styles.title}>
            {title.toUpperCase()}
          </Text>
          {rightElement}
        </View>
      )}
      <Card style={[styles.card, cardStyle]}>{children}</Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.margins.lg,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.xs,
    marginLeft: theme.margins.xs,
  },
  card: {
    padding: 0,
    overflow: "hidden",
  },
}));
