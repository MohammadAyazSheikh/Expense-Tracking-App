import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'normal' | 'bold' | '500' | '600';
  align?: 'left' | 'center' | 'right';
}

export const Text = ({ 
  variant = 'body', 
  color, 
  weight, 
  align, 
  style, 
  ...props 
}: TextProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
    text: {
      color: theme.colors.foreground,
    },
    h1: {
      fontSize: theme.fontSize.xxxl,
      fontWeight: 'bold',
      marginBottom: theme.margins.sm,
    },
    h2: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
      marginBottom: theme.margins.sm,
    },
    h3: {
      fontSize: theme.fontSize.xl,
      fontWeight: '600',
      marginBottom: theme.margins.xs,
    },
    body: {
      fontSize: theme.fontSize.md,
      lineHeight: 24,
    },
    caption: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.mutedForeground,
    },
    label: {
      fontSize: theme.fontSize.sm,
      fontWeight: '500',
      color: theme.colors.foreground,
    }
  }), [theme]);

  return (
    <RNText
      style={[
        styles.text,
        styles[variant],
        color ? { color } : undefined,
        weight ? { fontWeight: weight } : undefined,
        align ? { textAlign: align } : undefined,
        style
      ]}
      {...props}
    />
  );
};
