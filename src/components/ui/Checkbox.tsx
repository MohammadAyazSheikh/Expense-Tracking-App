import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Feather } from "@expo/vector-icons";

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  iconStyle?: StyleProp<TextStyle>;
  size?: "sm" | "md" | "lg";
};
const Checkbox = ({
  checked,
  onPress,
  style,
  icon,
  iconStyle,
  size = "md",
}: CheckboxProps) => {
  styles.useVariants({ size });
  return (
    <Pressable
      onPress={onPress}
      style={[styles.checkbox, checked && styles.checkboxActive, style]}
    >
      {icon ||
        (checked && (
          <Feather
            style={[styles.icon, iconStyle]}
            name="check"
            color="white"
          />
        ))}
    </Pressable>
  );
};

export default Checkbox;

const styles = StyleSheet.create((theme) => ({
  checkbox: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
          borderRadius: 8,
        },
        md: {
          width: 22,
          height: 22,
          borderRadius: 11,
        },
        lg: {
          width: 28,
          height: 28,
          borderRadius: 14,
        },
      },
    },
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  createButton: {
    marginTop: theme.margins.lg,
  },

  icon: {
    variants: {
      size: {
        sm: {
          fontSize: 10,
        },
        md: {
          fontSize: 14,
        },
        lg: {
          fontSize: 18,
        },
      },
    },
  },
}));
