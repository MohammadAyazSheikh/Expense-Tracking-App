import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface ProgressBarProps {
  value: number; // 0 to 100
  style?: ViewStyle;
  color?: string;
}

export const ProgressBar = ({ value, style, color }: ProgressBarProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      height: 8,
      backgroundColor: theme.colors.muted,
      borderRadius: 4,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: color || theme.colors.primary,
      borderRadius: 4,
    }
  }), [theme, color]);

  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.fill, { width: `${clampedValue}%` }]} />
    </View>
  );
};
