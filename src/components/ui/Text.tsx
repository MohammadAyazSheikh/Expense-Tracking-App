import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { useFonts } from "../../hooks/useFonts";
import { FontWeight } from "../../fonts/config";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type TextVariants = UnistylesVariants<typeof styles>;

interface CustomTextProps extends RNTextProps, TextVariants {
  weight?: FontWeight;
}

export const Text = ({
  variant = "body",
  align = "left",
  weight = "regular",
  style,
  ...props
}: CustomTextProps) => {
  const { getFont } = useFonts();

  styles.useVariants({
    variant,
    align,
  });

  const fontFamily = getFont(weight);

  const { fontWeight, ...restStyle } = (StyleSheet.flatten(style) ||
    {}) as TextStyle;

  return <RNText style={[styles.text, { fontFamily }, restStyle]} {...props} />;
};

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.foreground,
    variants: {
      variant: {
        h1: {
          fontSize: theme.fontSize.lg,
          // lineHeight: theme.fontSize.md * 1.2,
          fontWeight: "bold",
        },
        h2: {
          fontSize: theme.fontSize.md,
          // lineHeight: theme.fontSize.md * 1.2,
          fontWeight: "bold",
        },
        h3: {
          fontSize: theme.fontSize.sm,
          // lineHeight: theme.fontSize.sm * 1.2,
          fontWeight: "600",
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
          // lineHeight: theme.fontSize.md * 1.4,
          color: theme.colors.mutedForeground,
        },
      },
      align: {
        left: { textAlign: "left" },
        center: { textAlign: "center" },
        right: { textAlign: "right" },
      },
    },
  },
}));
