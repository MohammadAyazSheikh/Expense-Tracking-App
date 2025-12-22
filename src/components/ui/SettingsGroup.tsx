import React from "react";
import { View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "./Text";
import { Card } from "./Card";

interface SettingsGroupProps {
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
}

export const SettingsGroup = ({
  title,
  children,
  containerStyle,
  cardStyle,
}: SettingsGroupProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <Text variant="caption" weight="semiBold" style={styles.title}>
          {title.toUpperCase()}
        </Text>
      )}
      <Card style={[styles.card, cardStyle]}>{children}</Card>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.margins.lg,
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
