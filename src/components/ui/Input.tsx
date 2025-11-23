import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const styles = StyleSheet.create(theme => ({
  container: {
    marginBottom: theme.margins.sm,
  },
  label: {
    marginBottom: theme.margins.xs,
    color: theme.colors.foreground,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.paddings.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  error: {
    marginTop: theme.margins.xs,
    color: theme.colors.destructive,
    fontSize: theme.fontSize.sm,
  },
}));

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label} weight="medium">{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={theme.colors.mutedForeground}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
