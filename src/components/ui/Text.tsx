import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useFonts } from '../../hooks/useFonts';
import { FontWeight } from '../../fonts/config';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
type TextAlign = 'left' | 'center' | 'right';

interface CustomTextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: FontWeight;
  align?: TextAlign;
}

const styles = StyleSheet.create(theme => ({
  h1: {
    fontSize: theme.fontSize.lg,
    // lineHeight: theme.fontSize.md * 1.2,
    // fontWeight: 'bold', // Handled by font family
    color: theme.colors.foreground,
  },
  h2: {
    fontSize: theme.fontSize.md,
    // lineHeight: theme.fontSize.md * 1.2,
    // fontWeight: 'bold', // Handled by font family
    color: theme.colors.foreground,
  },
  h3: {
    fontSize: theme.fontSize.sm,
    // lineHeight: theme.fontSize.sm * 1.2,
    // fontWeight: '600', // Handled by font family
    color: theme.colors.foreground,
  },
  body: {
    fontSize: theme.fontSize.md,
    // lineHeight: theme.fontSize.md * 1.5,
    color: theme.colors.foreground,
  },
  label: {
    fontSize: theme.fontSize.lg,
    // lineHeight: theme.fontSize.lg * 1.4,
    color: theme.colors.foreground,
  },
  caption: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.4,
    color: theme.colors.mutedForeground,
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
}));

export const Text = ({
  variant = 'body',
  weight = 'regular',
  align = 'left',
  style,
  ...props
}: CustomTextProps) => {
  const { getFont } = useFonts();

  // Get the correct font family
  const fontFamily = getFont(weight);

  // Flatten styles to check for conflicting fontWeight if needed, 
  // but primarily we want to override any fontWeight with our fontFamily logic
  // or just ensure fontFamily is set.

  // We explicitly remove fontWeight from the applied style to avoid RN trying to synthesize bold
  // which might look wrong with a custom font that is already bold.
  const { fontWeight, ...restStyle } = (StyleSheet.flatten(style) || {}) as TextStyle;

  return (
    <RNText
      style={[
        styles[variant],
        styles[align],
        { fontFamily }, // Apply the calculated font family
        restStyle // Apply rest of the styles, excluding fontWeight,
      ]}
      {...props}
    />
  );
};
