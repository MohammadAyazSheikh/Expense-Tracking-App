import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export const Switch = ({ value, onValueChange, style }: SwitchProps) => {
  const { theme } = useUnistyles();
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: value ? theme.colors.primary : theme.colors.muted },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
};

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
