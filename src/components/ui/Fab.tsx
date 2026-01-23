import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { EnteringAnimation } from "../../utils/animation";
import { Pressable, TextStyle, ViewStyle } from "react-native";

type fabProps = {
  onPress: () => void;
  styles?: ViewStyle;
  icon?: React.ReactNode;
  iconStyle?: TextStyle;
};

const PressableAnim = Animated.createAnimatedComponent(Pressable);

const Fab = ({ onPress, icon, iconStyle, styles: styles_ }: fabProps) => {
  return (
    <PressableAnim
      onPress={onPress}
      entering={EnteringAnimation}
      style={[styles.fabContainer, styles_]}
    >
      {icon || <Ionicons name="add" style={[styles.iconStyle, iconStyle]} />}
    </PressableAnim>
  );
};

export default Fab;
const styles = StyleSheet.create((theme, rt) => ({
  fabContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: theme.colors.primary,
    right: theme.paddings.lg,
    bottom: theme.paddings.lg,
    aspectRatio: 1,
    width: (rt.screen.width / 100) * 15,
    borderRadius: theme.radius.full,
    ...theme.shadows.md,
  },
  iconStyle: {
    color: theme.colors.primaryForeground,
    fontSize: theme.fontSize.md * 1.5,
  },
}));
