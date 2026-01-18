import React from "react";
import { View, ScrollView, StatusBar, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { useKeyboardAnimatedOffsetStyle } from "../../hooks/keybaord";
import Animated from "react-native-reanimated";
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {},
}));

export const ScreenWrapper = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}: ScreenWrapperProps) => {
  const animatedStyle = useKeyboardAnimatedOffsetStyle();
  const Content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <AnimatedSafeAreaView
      style={[styles.container, animatedStyle]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          style={style}
        >
          {children}
        </ScrollView>
      ) : (
        Content
      )}
    </AnimatedSafeAreaView>
  );
};
