import React from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { SafeArea } from "@/components/ui/SafeArea";

export const IndexScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeArea
      applyTopInset
      applyBottomInset
      scrollable
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Feather name="credit-card" size={48} color="white" />
        </View>
        <Text variant="h1" style={styles.title}>
          HisaabBee
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Smart expense tracking for everyone
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.featureCard}>
          <Feather name="trending-up" size={32} color="white" />
          <Text style={styles.featureText} weight="medium">
            Smart Analytics
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Feather name="pie-chart" size={32} color="white" />
          <Text style={styles.featureText} weight="medium">
            Budget Tracking
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Feather name="credit-card" size={32} color="white" />
          <Text style={styles.featureText} weight="medium">
            Multi-Wallet
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Feather name="zap" size={32} color="white" />
          <Text style={styles.featureText} weight="medium">
            AI Assistant
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate("Onboarding")}
          style={{ backgroundColor: "white" }}
          textStyle={{ color: theme.colors.primary }}
          size="lg"
        />
        <Button
          title="Sign In"
          variant="ghost"
          onPress={() => navigation.navigate("Auth")}
          style={styles.loginButton}
          textStyle={{ color: "white" }}
          size="lg"
        />
        <Text
          variant="caption"
          align="center"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          Start tracking your expenses with AI-powered insights
        </Text>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: theme.paddings.lg,
    gap: theme.margins.xl,
  },
  header: {
    alignItems: "center",
    gap: theme.margins.md,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: theme.radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.margins.md,
  },
  title: {
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.md,
    justifyContent: "center",
  },
  featureCard: {
    width: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    padding: theme.paddings.md,
    borderRadius: theme.radius.lg,
  },
  featureText: {
    color: "white",
    marginTop: theme.margins.sm,
    textAlign: "center",
  },
  footer: {
    gap: theme.margins.md,
    marginTop: theme.margins.lg,
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
}));
