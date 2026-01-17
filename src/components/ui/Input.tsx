import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "./Text";
import { useFonts } from "../../hooks/useFonts";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const Input = ({
  label,
  error,
  style,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...props
}: InputProps) => {
  const { fonts } = useFonts();
  const { theme } = useUnistyles();
  const [isFocused, setIsFocused] = useState(false);

  styles.useVariants({
    focused: isFocused,
    error: !!error,
  });

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} weight="medium">
          {label}
        </Text>
      )}
      <View style={[styles.inputWrapper, style]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, { fontFamily: fonts.regular }, inputStyle]}
          placeholderTextColor={theme.colors.mutedForeground}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.margins.sm,
  },
  label: {
    marginBottom: theme.margins.xs,
    color: theme.colors.foreground,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    // backgroundColor: theme.colors.background,
    height: 50,
    variants: {
      focused: {
        true: {
          borderColor: theme.colors.ring,
        },
      },
      error: {
        true: {
          borderColor: theme.colors.destructive,
        },
      },
    },
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.paddings.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    height: "100%",
  },
  leftIcon: {
    paddingLeft: theme.paddings.md,
    paddingRight: theme.paddings.xs,
  },
  rightIcon: {
    paddingRight: theme.paddings.md,
    paddingLeft: theme.paddings.xs,
  },
  error: {
    marginTop: theme.margins.xs,
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
  },
}));
