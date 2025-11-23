import React from 'react';
import { View, ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './Text';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  style?: ViewStyle;
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.paddings.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  info: {
    backgroundColor: theme.colors.accent,
  },
}));

export const Badge = ({ children, variant = 'default', style }: BadgeProps) => {
  const { theme } = useUnistyles();

  const textColor = variant === 'outline' ? theme.colors.foreground : 'white';

  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text weight="semiBold" style={{ fontSize: 10, color: textColor }}>{children}</Text>
    </View>
  );
};
