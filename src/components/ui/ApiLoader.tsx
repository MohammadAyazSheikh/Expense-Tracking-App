import React from "react";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Text } from "./Text";
import ModalWrapper from "./ModalWrapper";

interface ApiLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const ApiLoader = ({
  isLoading,
  message = "Loading...",
}: ApiLoaderProps) => {
  const { theme } = useUnistyles();

  return (
    <ModalWrapper
      visible={isLoading}
      showBackDrop={true}
      containerStyles={styles.container}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message && (
          <Text style={styles.message} variant="body" weight="medium">
            {message}
          </Text>
        )}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: theme.colors.card,
    padding: theme.paddings.xl,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    gap: theme.margins.md,
    minWidth: 150,
    shadowColor: theme.colors.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    textAlign: "center",
    color: theme.colors.foreground,
  },
}));
