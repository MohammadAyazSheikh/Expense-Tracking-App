import React, { useMemo } from "react";
import { View, StatusBar, ViewStyle } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import {
  KeyboardAwareScrollView,
  KeyboardAvoidingViewProps,
} from "react-native-keyboard-controller";

interface SafeAreaProps {
  scrollProps?: KeyboardAvoidingViewProps;
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  applyVerticalInsets?: boolean;
  applyHorizontalInsets?: boolean;
  applyBottomInset?: boolean;
  applyTopInset?: boolean;
  applyLeftInset?: boolean;
  applyRightInset?: boolean;
}

export const SafeArea = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  scrollProps,
  applyBottomInset,
  applyTopInset,
  applyLeftInset,
  applyRightInset,
  applyVerticalInsets,
  applyHorizontalInsets,
}: SafeAreaProps) => {
  const { top, bottom, left, right } = useSafeAreaInsets();

  const padding = useMemo(() => {
    return {
      top: applyTopInset || applyVerticalInsets ? top : 0,
      bottom: applyBottomInset || applyVerticalInsets ? bottom : 0,
      left: applyLeftInset || applyHorizontalInsets ? left : 0,
      right: applyRightInset || applyHorizontalInsets ? right : 0,
    };
  }, [
    applyBottomInset,
    applyTopInset,
    applyLeftInset,
    applyRightInset,
    top,
    bottom,
    left,
    right,
  ]);

  if (scrollable) {
    return (
      <KeyboardAwareScrollView
        style={[styles.container, padding, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }

  return <View style={[styles.container, padding]}>{children}</View>;
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {},
}));
