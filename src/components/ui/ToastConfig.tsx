import React from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Feather } from "@expo/vector-icons";
import { Text } from "./Text";

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "90%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.md,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginTop: theme.margins.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.margins.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  message: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
}));

const ToastItem = ({
  type,
  text1,
  text2,
}: {
  type: "success" | "error" | "info" | "warning";
  text1: string;
  text2?: string;
}) => {
  const { theme } = useUnistyles();

  const getIconData = () => {
    switch (type) {
      case "success":
        return {
          name: "check-circle" as const,
          color: theme.colors.success,
          bg: theme.colors.success + "15",
        };
      case "error":
        return {
          name: "alert-circle" as const,
          color: theme.colors.destructive,
          bg: theme.colors.destructive + "15",
        };
      case "info":
        return {
          name: "info" as const,
          color: theme.colors.primary,
          bg: theme.colors.primary + "15",
        };
      case "warning":
        return {
          name: "alert-triangle" as const,
          color: theme.colors.warning,
          bg: theme.colors.warning + "15",
        };
    }
  };

  const iconData = getIconData();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
        <Feather name={iconData.name} size={22} color={iconData.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  );
};

const ToastConfig = {
  success: (props: any) => <ToastItem type="success" {...props} />,
  error: (props: any) => <ToastItem type="error" {...props} />,
  info: (props: any) => <ToastItem type="info" {...props} />,
  warning: (props: any) => <ToastItem type="warning" {...props} />,
};

export default ToastConfig;
