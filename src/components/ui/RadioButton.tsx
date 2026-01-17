import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";

type RadioButtonProps = {
  selected: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  iconStyle?: StyleProp<TextStyle>;
  checkedColor?: string;
  uncheckedColor?: string;
  size?: "sm" | "md" | "lg";
};
const RadioButton = ({
  selected,
  onPress,
  containerStyle,
  icon,
  iconStyle,
  checkedColor,
  uncheckedColor,
  size = "md",
}: RadioButtonProps) => {
  styles.useVariants({ size, selected });
  return (
    <Pressable onPress={onPress} style={[styles.checkbox, containerStyle]}>
      {icon || (
        <Ionicons
          style={[
            styles.icon,
            iconStyle,
            checkedColor && { color: checkedColor },
            uncheckedColor && { color: uncheckedColor },
          ]}
          name={selected ? "radio-button-on" : "radio-button-off"}
        />
      )}
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create((theme) => ({
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    variants: {
      selected: {
        true: {
          color: theme.colors.primary,
        },
        false: {
          color: theme.colors.mutedForeground,
        },
      },
      size: {
        sm: {
          fontSize: 16,
        },
        md: {
          fontSize: 22,
        },
        lg: {
          fontSize: 28,
        },
      },
    },
  },
}));
