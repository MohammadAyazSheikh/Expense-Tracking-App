import React from "react";
import { View, StatusBar, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

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
  const Content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.container]} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      {scrollable ? (
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          style={style}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        Content
      )}
    </SafeAreaView>
  );
};
