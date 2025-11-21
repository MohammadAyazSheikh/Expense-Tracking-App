import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Text } from './Text';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  style?: ViewStyle;
}

export const Badge = ({ children, variant = 'default', style }: BadgeProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
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
      backgroundColor: theme.colors.accent, // Using accent for info
    },
    text: {
      fontSize: 10,
      fontWeight: '600',
      color: variant === 'outline' ? theme.colors.foreground : 'white',
    }
  }), [theme, variant]);

  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};
