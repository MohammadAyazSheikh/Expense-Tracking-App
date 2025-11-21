import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
type TextWeight = 'normal' | '500' | '600' | '700';
type TextAlign = 'left' | 'center' | 'right';

interface CustomTextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
}

const styles = StyleSheet.create(theme => ({
  h1: {
    fontSize: theme.fontSize.h1,
    lineHeight: theme.fontSize.h1 * 1.2,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  h2: {
    fontSize: theme.fontSize.h2,
    lineHeight: theme.fontSize.h2 * 1.2,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  h3: {
    fontSize: theme.fontSize.h3,
    lineHeight: theme.fontSize.h3 * 1.2,
    fontWeight: '600',
    color: theme.colors.foreground,
  },
  body: {
    fontSize: theme.fontSize.body,
    lineHeight: theme.fontSize.body * 1.5,
    color: theme.colors.foreground,
  },
  label: {
    fontSize: theme.fontSize.label,
    lineHeight: theme.fontSize.label * 1.4,
    color: theme.colors.foreground,
  },
  caption: {
    fontSize: theme.fontSize.caption,
    lineHeight: theme.fontSize.caption * 1.4,
    color: theme.colors.mutedForeground,
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
}));

export const Text = ({
  variant = 'body',
  weight = 'normal',
  align = 'left',
  style,
  ...props
}: CustomTextProps) => {
  return (
    <RNText
      style={[
        styles[variant],
        { fontWeight: weight },
        styles[align],
        style
      ]}
      {...props}
    />
  );
};
