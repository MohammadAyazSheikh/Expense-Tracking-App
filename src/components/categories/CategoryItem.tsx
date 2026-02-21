import { IconType } from "@/components/ui/Icon";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";
import { LayoutAnimation } from "@/utils/animation";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

const PressAbleAnimated = Animated.createAnimatedComponent(Pressable);

export const CategoryItem = ({
  item,
  isSelected,
  onPress,
  isTag = false,
}: {
  item: {
    name: string;
    color: string;
    icon?: string;
    iconFamily?: IconType;
  };
  isSelected: boolean;
  onPress: () => void;
  isTag?: boolean;
}) => {
  const { theme } = useUnistyles();

  return (
    <PressAbleAnimated
      layout={LayoutAnimation}
      style={[
        styles.selectionItem,
        isTag && styles.tagItem,
        isSelected && styles.selectionItemSelected,
        isTag && isSelected && styles.tagItemSelected,
      ]}
      onPress={onPress}
    >
      {!isTag ? (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color || theme.colors.primary },
          ]}
        >
          <Icon
            type={item.iconFamily || "Ionicons"}
            name={item.icon || "help-circle"}
            size={20}
            color="white"
          />
        </View>
      ) : (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isSelected ? "white" : item.color,
          }}
        />
      )}
      <Text
        variant="caption"
        weight="medium"
        style={[isTag ? { fontSize: 14 } : undefined]}
      >
        {item.name}
      </Text>
    </PressAbleAnimated>
  );
};

const styles = StyleSheet.create((theme) => ({
  selectionItem: {
    width: {
      xs: "30%",
      sm: "23%",
      md: "18%",
    },
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    gap: 4,
  },
  tagItem: {
    width: "auto",
    aspectRatio: undefined,
    height: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    borderRadius: 20,
  },
  selectionItemSelected: {
    borderColor: theme.colors.primary,
  },
  tagItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
}));
