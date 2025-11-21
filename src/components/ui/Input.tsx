import React, { useMemo } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: theme.margins.md,
    },
    label: {
      marginBottom: theme.margins.xs,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.paddings.md,
      color: theme.colors.foreground,
      backgroundColor: theme.colors.background,
      fontSize: theme.fontSize.md,
    },
    inputError: {
      borderColor: theme.colors.destructive,
    },
    errorText: {
      marginTop: theme.margins.xs,
      color: theme.colors.destructive,
    }
  }), [theme]);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : undefined,
          style
        ]}
        placeholderTextColor={theme.colors.mutedForeground}
        {...props}
      />
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};
