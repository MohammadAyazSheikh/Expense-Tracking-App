import React from "react";
import { ViewProps, Pressable } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import Animated, { createAnimatedComponent } from "react-native-reanimated";
import {
  EnteringAnimation,
  ExitingAnimation,
  LayoutAnimation,
} from "../../utils/animation";

const AnimatedPressable = createAnimatedComponent(Pressable);

type CardVariants = UnistylesVariants<typeof styles>;

type CardProps = ViewProps &
  CardVariants & {
    onPress?: () => void;
    onLongPress?: () => void;
    enableLayoutAnimation?: boolean;
    enableEnterAnimation?: boolean;
  };

export const Card = ({
  children,
  variant = "primary",
  onPress,
  onLongPress,
  style,
  enableLayoutAnimation = false,
  enableEnterAnimation = false,
  ...props
}: CardProps) => {
  styles.useVariants({
    variant,
  });

  if (enableLayoutAnimation || enableEnterAnimation) {
    return (
      <AnimatedPressable
        layout={enableLayoutAnimation ? LayoutAnimation : undefined}
        entering={enableEnterAnimation ? EnteringAnimation : undefined}
        exiting={enableEnterAnimation ? ExitingAnimation : undefined}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.card, style]}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, style]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.paddings.lg,
    variants: {
      variant: {
        flat: {},
        primary: {
          ...theme.shadows.xs,
        },
        outlined: {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      },
    },
  },
}));
