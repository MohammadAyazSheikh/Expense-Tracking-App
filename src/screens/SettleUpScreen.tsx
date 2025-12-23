import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";
import Toast from "react-native-toast-message";

export const SettleUpScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "SettleUp">>();
  const { groupId } = route.params;

  const groups = useFinanceStore((state) => state.groups);
  const selectedGroup = groupId ? groups.find((g) => g.id === groupId) : null;
  const updateGroup = useFinanceStore((state) => state.updateGroup);

  const [activeTab, setActiveTab] = useState<"you-owe" | "owed-to-you">(
    "you-owe"
  );
  const [selectedSettlement, setSelectedSettlement] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Mock settlements for demonstration
  const settlements = [
    {
      id: "1",
      from: "You",
      to: "Sarah",
      amount: 45.5,
      groupName: "Apartment Roommates",
    },
    {
      id: "2",
      from: "You",
      to: "Emma",
      amount: 85.0,
      groupName: "Trip to Bali",
    },
    {
      id: "3",
      from: "David",
      to: "You",
      amount: 22.3,
      groupName: "Office Lunch",
    },
  ].filter(
    (s) => !groupId || (selectedGroup && s.groupName === selectedGroup.name)
  );

  const youOwe = settlements.filter((s) => s.from === "You");
  const owedToYou = settlements.filter((s) => s.to === "You");

  const totalYouOwe = youOwe.reduce((sum, s) => sum + s.amount, 0);
  const totalOwedToYou = owedToYou.reduce((sum, s) => sum + s.amount, 0);

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: "dollar-sign" },
    { id: "card", name: "Card", icon: "credit-card" },
    { id: "upi", name: "UPI/Bank", icon: "smartphone" },
  ];

  const handleSettle = (id: string, from: string, amount: number) => {
    Toast.show({
      type: "success",
      text1: "Settled!",
      text2: `Successfully recorded payment of $${amount.toFixed(2)}.`,
    });

    // If it's the user settling their own debt
    if (from === "You" && selectedGroup) {
      updateGroup(selectedGroup.id, {
        youOwe: Math.max(0, selectedGroup.youOwe - amount),
        lastActivity: "Just settled up",
      });
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + "CC"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>
            Settle Up
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance Summary Cards */}
        <View style={styles.summaryGridSmall}>
          <Card style={styles.summaryItemSmall}>
            <Text variant="caption" style={styles.summaryLabel}>
              You Owe
            </Text>
            <Text
              style={[
                styles.summaryValueSmall,
                { color: theme.colors.destructive },
              ]}
              weight="bold"
            >
              ${totalYouOwe.toFixed(2)}
            </Text>
          </Card>
          <Card style={styles.summaryItemSmall}>
            <Text variant="caption" style={styles.summaryLabel}>
              Owed to You
            </Text>
            <Text
              style={[
                styles.summaryValueSmall,
                { color: theme.colors.success },
              ]}
              weight="bold"
            >
              ${totalOwedToYou.toFixed(2)}
            </Text>
          </Card>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("you-owe")}
          style={[styles.tab, activeTab === "you-owe" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "you-owe" && styles.activeTabText,
            ]}
          >
            You Owe ({youOwe.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("owed-to-you")}
          style={[styles.tab, activeTab === "owed-to-you" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "owed-to-you" && styles.activeTabText,
            ]}
          >
            Owed to You ({owedToYou.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ gap: theme.margins.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.margins.md }}>
          {(activeTab === "you-owe" ? youOwe : owedToYou).length > 0 ? (
            (activeTab === "you-owe" ? youOwe : owedToYou).map((s) => (
              <Card
                key={s.id}
                style={[
                  styles.settlementCard,
                  selectedSettlement === s.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedSettlement(s.id)}
              >
                <View style={styles.settlementInfo}>
                  <View
                    style={[
                      styles.avatarLarge,
                      {
                        backgroundColor:
                          activeTab === "you-owe"
                            ? theme.colors.destructive + "15"
                            : theme.colors.success + "15",
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 20 }}>
                      {(activeTab === "you-owe" ? s.to : s.from).charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text weight="bold">
                      {activeTab === "you-owe" ? s.to : s.from}
                    </Text>
                    <Text variant="caption">{s.groupName}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      weight="bold"
                      style={{
                        fontSize: 18,
                        color:
                          activeTab === "you-owe"
                            ? theme.colors.destructive
                            : theme.colors.success,
                      }}
                    >
                      ${s.amount.toFixed(2)}
                    </Text>
                    <Text variant="caption">
                      {activeTab === "you-owe" ? "You owe" : "Owes you"}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather
                name={activeTab === "you-owe" ? "check-circle" : "dollar-sign"}
                size={48}
                color={
                  activeTab === "you-owe"
                    ? theme.colors.success
                    : theme.colors.mutedForeground
                }
                style={{ marginBottom: 16 }}
              />
              <Text weight="bold">
                {activeTab === "you-owe" ? "All settled up!" : "Nothing here"}
              </Text>
              <Text
                variant="caption"
                style={{ textAlign: "center", marginTop: 8 }}
              >
                {activeTab === "you-owe"
                  ? "You don't owe anyone money right now."
                  : "No one owes you money right now."}
              </Text>
            </View>
          )}
        </View>

        {/* Settlement Form */}
        {selectedSettlement && (
          <Card style={styles.formCard}>
            <Text weight="bold" style={{ marginBottom: 16 }}>
              Record Payment
            </Text>

            <View style={styles.settlementVisual}>
              <View style={styles.visualAvatar}>
                <Text weight="medium">
                  {activeTab === "you-owe"
                    ? "Y"
                    : settlements
                        .find((s) => s.id === selectedSettlement)
                        ?.from.charAt(0)}
                </Text>
                <Text variant="caption" style={{ marginTop: 4 }}>
                  {activeTab === "you-owe"
                    ? "You"
                    : settlements.find((s) => s.id === selectedSettlement)
                        ?.from}
                </Text>
              </View>
              <Feather
                name="arrow-right"
                size={24}
                color={theme.colors.mutedForeground}
              />
              <View style={styles.visualAvatar}>
                <Text weight="medium">
                  {activeTab === "you-owe"
                    ? settlements
                        .find((s) => s.id === selectedSettlement)
                        ?.to.charAt(0)
                    : "Y"}
                </Text>
                <Text variant="caption" style={{ marginTop: 4 }}>
                  {activeTab === "you-owe"
                    ? settlements.find((s) => s.id === selectedSettlement)?.to
                    : "You"}
                </Text>
              </View>
            </View>

            <Text variant="caption" style={{ marginBottom: 8 }}>
              Payment Method
            </Text>
            <View style={styles.methodGrid}>
              {paymentMethods.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.methodItem,
                    paymentMethod === m.id && styles.activeMethod,
                  ]}
                  onPress={() => setPaymentMethod(m.id)}
                >
                  <Feather
                    name={m.icon as any}
                    size={20}
                    color={
                      paymentMethod === m.id ? "white" : theme.colors.foreground
                    }
                  />
                  <Text
                    variant="caption"
                    style={{
                      marginTop: 4,
                      color:
                        paymentMethod === m.id
                          ? "white"
                          : theme.colors.foreground,
                    }}
                  >
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Confirm Settlement"
              onPress={() => {
                handleSettle(
                  selectedSettlement,
                  activeTab === "you-owe" ? "You" : "Other",
                  settlements.find((s) => s.id === selectedSettlement)
                    ?.amount || 0
                );
                setSelectedSettlement(null);
              }}
              style={{ marginTop: 16, height: 48 }}
            />
          </Card>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.md,
  },
  summaryGridSmall: {
    flexDirection: "row",
    gap: theme.margins.md,
    marginTop: theme.margins.md,
  },
  summaryItemSmall: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  summaryValueSmall: {
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.paddings.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "white",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
    fontSize: 13,
  },
  activeTabText: {
    color: "white",
  },
  settlementCard: {
    padding: theme.paddings.md,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  settlementInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    padding: theme.paddings.lg,
    marginTop: theme.margins.md,
  },
  settlementVisual: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 24,
  },
  visualAvatar: {
    alignItems: "center",
  },
  methodGrid: {
    flexDirection: "row",
    gap: theme.margins.sm,
  },
  methodItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeMethod: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.paddings.xl,
  },
}));
