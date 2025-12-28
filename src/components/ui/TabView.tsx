import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import {
  TabView as RNTabView,
  TabBar,
  TabBarProps,
  SceneRendererProps,
  //   TabViewProps,
  //   TabBarItemProps,
  //   TabBarIndicatorProps,
  Route,
  SceneMap,
} from "react-native-tab-view";
import { useUnistyles } from "react-native-unistyles";
import { Text } from "./Text";
import { Badge } from "./Badge";

export type TabRoute = Route & {
  title: string;
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

export type TabViewProps = {
  /**
   * Array of routes for tabs
   */
  routes: TabRoute[];
  /**
   * Scene map or renderer
   */
  renderScene:
    | ((
        props: SceneRendererProps & {
          route: TabRoute;
        }
      ) => React.ReactNode)
    | ReturnType<typeof SceneMap>;
  /**
   * Initial tab index
   */
  initialIndex?: number;
  /**
   * On index change callback
   */
  onIndexChange?: (index: number) => void;
  /**
   * Custom tab bar renderer
   */
  renderTabBar?: (props: TabBarProps<TabRoute>) => React.ReactElement;
  /**
   * Tab bar style
   */
  tabBarStyle?: any;
  /**
   * Indicator style
   */
  indicatorStyle?: any;
  /**
   * Active tab color
   */
  activeColor?: string;
  /**
   * Inactive tab color
   */
  inactiveColor?: string;
  /**
   * Lazy load tabs
   */
  lazy?: boolean;
  /**
   * Enable swipe gestures
   */
  swipeEnabled?: boolean;
  /**
   * Any other TabView props
   */
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
  ...otherProps
}: TabViewProps) => {
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
      renderScene={renderScene as any}
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
