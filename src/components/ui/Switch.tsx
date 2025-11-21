import React, { useEffect } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export const Switch = ({
  value,
  onValueChange,
  trackColor,
  thumbColor = 'white',
  style
}: SwitchProps) => {
  const { theme } = useUnistyles();
  const translateX = useSharedValue(value ? 20 : 0);

  useEffect(() => {
    translateX.value = withTiming(value ? 20 : 0, {
      duration: 200,
    });
  }, [value]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = () => {
    onValueChange(!value);
  };

  const bgColor = value
    ? (trackColor?.true || theme.colors.primary)
    : (trackColor?.false || theme.colors.muted);

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: bgColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          { backgroundColor: thumbColor },
          animatedThumbStyle,
        ]}
      />
    </Pressable>
  );
};
