import React, { useState, ComponentType } from "react";
import { View, useWindowDimensions } from "react-native";
import {
  TabView as RNTabView,
  TabBar,
  TabBarProps,
  Route,
  SceneMap,
} from "react-native-tab-view";
import { useUnistyles } from "react-native-unistyles";
import { Text } from "./Text";
import { Badge } from "./Badge";

export type TabRoute = Route & {
  badge?: boolean;
  badgeVariant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
};

export type TabViewProps_ = {
  routes: TabRoute[];
  screens: Record<string, ComponentType<unknown>>;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  renderTabBar?: (props: TabBarProps<TabRoute>) => React.ReactElement;
  tabBarStyle?: any;
  indicatorStyle?: any;
  activeColor?: string;
  inactiveColor?: string;
  lazy?: boolean;
  swipeEnabled?: boolean;
  [key: string]: any;
};

export const TabView = ({
  routes,
  renderScene,
  initialIndex = 0,
  onIndexChange: customOnIndexChange,
  renderTabBar: customRenderTabBar,
  showBadges = false,
  tabBarStyle,
  indicatorStyle,
  activeColor,
  inactiveColor,
  lazy = false,
  swipeEnabled = true,
  screens,
  ...otherProps
}: TabViewProps_) => {
  const layout = useWindowDimensions();
  const { theme } = useUnistyles();
  const [index, setIndex] = useState(initialIndex);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    customOnIndexChange?.(newIndex);
  };

  const defaultRenderTabBar = (props: TabBarProps<TabRoute>) => (
    <TabBar
      {...props}
      indicatorStyle={
        indicatorStyle || { backgroundColor: theme.colors.primary }
      }
      style={tabBarStyle || { backgroundColor: theme.colors.background }}
      activeColor={activeColor || theme.colors.primary}
      inactiveColor={inactiveColor || theme.colors.mutedForeground}
    />
  );

  return (
    <RNTabView
      navigationState={{ index, routes }}
      renderScene={SceneMap(screens)}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      renderTabBar={customRenderTabBar || defaultRenderTabBar}
      lazy={lazy}
      swipeEnabled={swipeEnabled}
      commonOptions={{
        label: ({ route, color }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Text style={{ color, fontWeight: "600" }}>{route.title}</Text>
            {route.badge && (
              <Badge dot size="xs" variant={route.badgeVariant || "primary"} />
            )}
          </View>
        ),
      }}
      {...otherProps}
    />
  );
};
