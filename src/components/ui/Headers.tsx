import React from "react";
import { View, ViewStyle, TextStyle, Pressable } from "react-native";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  left?: React.ReactNode;
  children?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentContainerStyle?: ViewStyle;
  applySafeAreaPadding?: boolean;
};

export const Header = ({
  title,
  showBack,
  onBack,
  right,
  left,
  children,
  backgroundColor,
  style,
  titleStyle,
  contentContainerStyle,
  applySafeAreaPadding,
}: HeaderProps) => {
  const { theme } = useUnistyles();
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  // Determine if back button should be shown
  const shouldShowBack = showBack !== undefined ? showBack : !!onBack;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const bgColor = backgroundColor || theme.colors.primary;

  return (
    <LinearGradient
      colors={[theme.colors.primary, "hsl(230, 75%, 70%)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // start={{ x: 0.5, y: 0.5 }}
      // end={{ x: 0, y: 0 }}
      style={[
        styles.container,
        applySafeAreaPadding && { paddingTop: safeAreaInsets.top },
        { backgroundColor: bgColor },
        style,
      ]}
    >
      <StatusBar style="light" />
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          {left ? (
            left
          ) : (
            <>
              {shouldShowBack && (
                <Pressable
                  onPress={handleBack}
                  style={styles.backButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    type="Feather"
                    name="arrow-left"
                    size={24}
                    color="white"
                  />
                </Pressable>
              )}
              {title && (
                <Text variant="h2" style={[styles.title, titleStyle]}>
                  {title}
                </Text>
              )}
            </>
          )}
        </View>

        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>

      {/* Extended Content */}
      {children && (
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {children}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.paddings.lg,
    paddingVertical: theme.paddings.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  title: {
    color: "white",
  },
  contentContainer: {
    // Container for children (extended header content)
  },
}));
