import React, { useMemo } from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined';
  onPress?: () => void;
}

export const Card = ({ variant = 'default', style, children, onPress, ...props }: CardProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.paddings.lg,
      shadowColor: theme.colors.foreground,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowOpacity: 0,
      elevation: 0,
    }
  }), [theme]);

  const cardStyle = [
    styles.card, 
    variant === 'outlined' && styles.outlined,
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7} {...props as any}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};
