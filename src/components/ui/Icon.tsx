import React from "react";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  Zocial,
  SimpleLineIcons,
  Foundation,
  EvilIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

export const IconSets = {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  Zocial,
  SimpleLineIcons,
  Foundation,
  EvilIcons,
  FontAwesome5,
  FontAwesome6,
};

export type IconType = keyof typeof IconSets;

// Helper type to extract the name prop from a specific icon component
export type IconName<T extends IconType> = React.ComponentProps<
  (typeof IconSets)[T]
>["name"];

export interface BaseIconProps<T extends IconType> {
  type: T;
  name: IconName<T>;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}

export const Icon = <T extends IconType>({
  type,
  name,
  color,
  size,
  style,
  ...props
}: BaseIconProps<T>) => {
  const IconComponent = IconSets[type];

  if (!IconComponent) {
    return null;
  }

  return (
    // @ts-ignore - TypeScript has trouble verifying that the specific name matches the specific component in this generic context
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};
