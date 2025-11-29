import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';
import { useFonts } from '../../hooks/useFonts';
import { FontWeight } from '../../fonts/config';

const styles = StyleSheet.create(theme => ({
  text: {
    color: theme.colors.foreground,
    variants: {
      variant: {
        h1: {
          fontSize: theme.fontSize.lg,
          // lineHeight: theme.fontSize.md * 1.2,
          // fontWeight: 'bold', // Handled by font family
        },
        h2: {
          fontSize: theme.fontSize.md,
          // lineHeight: theme.fontSize.md * 1.2,
          // fontWeight: 'bold', // Handled by font family
        },
        h3: {
          fontSize: theme.fontSize.sm,
          // lineHeight: theme.fontSize.sm * 1.2,
          // fontWeight: '600', // Handled by font family
        },
        body: {
          fontSize: theme.fontSize.md,
          // lineHeight: theme.fontSize.md * 1.5,
        },
        label: {
          fontSize: theme.fontSize.lg,
          // lineHeight: theme.fontSize.lg * 1.4,
        },
        caption: {
          fontSize: theme.fontSize.md,
          lineHeight: theme.fontSize.md * 1.4,
          color: theme.colors.mutedForeground,
        }
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      }
    }
  }
}));

type TextVariants = UnistylesVariants<typeof styles>;

interface CustomTextProps extends RNTextProps, TextVariants {
  weight?: FontWeight;
}

export const Text = ({
  variant = 'body',
  align = 'left',
  weight = 'regular',
  style,
  ...props
}: CustomTextProps) => {
  const { getFont } = useFonts();

  styles.useVariants({
    variant,
    align
  });

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
        styles.text,
        { fontFamily }, // Apply the calculated font family
        restStyle // Apply rest of the styles, excluding fontWeight,
      ]}
      {...props}
    />
  );
};
