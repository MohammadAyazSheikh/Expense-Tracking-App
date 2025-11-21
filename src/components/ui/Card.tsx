import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined';
  onPress?: () => void;
}

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.paddings.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}));

export const Card = ({ children, variant = 'default', onPress, style, ...props }: CardProps) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      style={[
        styles.card,
        variant === 'outlined' && styles.outlined,
        style
      ]}
      {...props}
    >
      {children}
    </Component>
  );
};
