import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFinanceStore } from "../store";

export const GroupsScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const groups = useFinanceStore((state) => state.groups);
  const [searchQuery, setSearchQuery] = useState("");

  const totalYouOwe = groups.reduce((sum, g) => sum + g.youOwe, 0);
  const totalYouAreOwed = groups.reduce((sum, g) => sum + g.youAreOwed, 0);
  const netBalance = totalYouAreOwed - totalYouOwe;

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + "CC"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Button
              title=""
              icon={<Feather name="arrow-left" size={24} color="white" />}
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 0, width: 40 }}
            />
            <Text variant="h2" style={styles.headerTitle}>
              Split Bills
            </Text>
          </View>
          <Button
            title="New Group"
            icon={<Feather name="plus" size={16} color="white" />}
            variant="secondary"
            size="sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            textStyle={{ color: "white" }}
            onPress={() => navigation.navigate("CreateGroup")}
          />
        </View>

        {/* Balance Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={styles.summaryLabel}>
                You Owe
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: theme.colors.destructive },
                ]}
                weight="bold"
              >
                ${totalYouOwe.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryItem, styles.summaryItemCenter]}>
              <Text variant="caption" style={styles.summaryLabel}>
                Net Balance
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      netBalance >= 0
                        ? theme.colors.success
                        : theme.colors.destructive,
                  },
                ]}
                weight="bold"
              >
                {netBalance >= 0 ? "+" : ""}${netBalance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="caption" style={styles.summaryLabel}>
                You're Owed
              </Text>
              <Text
                style={[styles.summaryValue, { color: theme.colors.success }]}
                weight="bold"
              >
                ${totalYouAreOwed.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={18}
            color={theme.colors.mutedForeground}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Card
            style={styles.actionCard}
            onPress={() => navigation.navigate("SettleUp", {})}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.colors.success + "15" },
              ]}
            >
              <Feather
                name="dollar-sign"
                size={20}
                color={theme.colors.success}
              />
            </View>
            <View>
              <Text weight="semiBold" style={{ fontSize: 13 }}>
                Settle Up
              </Text>
              <Text variant="caption" style={{ fontSize: 10 }}>
                Clear balances
              </Text>
            </View>
          </Card>
          <Card
            style={styles.actionCard}
            onPress={() => navigation.navigate("Friends")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: theme.colors.primary + "15" },
              ]}
            >
              <Feather name="users" size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text weight="semiBold" style={{ fontSize: 13 }}>
                Friends
              </Text>
              <Text variant="caption" style={{ fontSize: 10 }}>
                Manage contacts
              </Text>
            </View>
          </Card>
        </View>

        {/* Groups List */}
        <Text variant="h3" style={styles.sectionTitle}>
          Your Groups
        </Text>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Card
              key={group.id}
              style={styles.groupCard}
              onPress={() =>
                navigation.navigate("GroupDetail", { id: group.id })
              }
            >
              <View style={styles.groupCardHeader}>
                <View style={styles.groupAvatar}>
                  <Text style={{ fontSize: 24 }}>{group.avatar}</Text>
                </View>
                <View style={styles.groupInfo}>
                  <View style={styles.groupTitleRow}>
                    <Text weight="bold" style={{ fontSize: 16 }}>
                      {group.name}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={theme.colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.groupMeta}>
                    <Feather
                      name="users"
                      size={12}
                      color={theme.colors.mutedForeground}
                    />
                    <Text variant="caption" style={styles.metaText}>
                      {group.members.length} members
                    </Text>
                    <Text variant="caption" style={styles.metaDivider}>
                      •
                    </Text>
                    <Text variant="caption" style={styles.metaText}>
                      {group.lastActivity}
                    </Text>
                  </View>
                  <View style={styles.groupBadges}>
                    {group.youOwe > 0 && (
                      <Badge variant="destructive">
                        <Text
                          style={{ color: "white", fontSize: 10 }}
                          weight="bold"
                        >
                          You owe ${group.youOwe.toFixed(2)}
                        </Text>
                      </Badge>
                    )}
                    {group.youAreOwed > 0 && (
                      <Badge variant="success">
                        <Text
                          style={{ color: "white", fontSize: 10 }}
                          weight="bold"
                        >
                          You're owed ${group.youAreOwed.toFixed(2)}
                        </Text>
                      </Badge>
                    )}
                    {group.youOwe === 0 && group.youAreOwed === 0 && (
                      <Badge variant="secondary">
                        <Text variant="caption" style={{ fontSize: 10 }}>
                          All settled up
                        </Text>
                      </Badge>
                    )}
                  </View>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather
              name="users"
              size={48}
              color={theme.colors.mutedForeground}
              style={{ marginBottom: 16 }}
            />
            <Text weight="bold">No groups found</Text>
            <Text
              variant="caption"
              style={{ textAlign: "center", marginTop: 8 }}
            >
              Create a new group to start splitting expenses with friends.
            </Text>
            <Button
              title="Create Group"
              icon={<Feather name="plus" size={18} color="white" />}
              onPress={() => navigation.navigate("CreateGroup")}
              style={{ marginTop: 24 }}
            />
          </View>
        )}
      </View>
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
    marginBottom: theme.margins.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  headerTitle: {
    color: "white",
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.paddings.md,
    borderRadius: theme.radius.lg,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.paddings.md,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: theme.margins.sm,
  },
  searchInput: {
    height: 44,
    flex: 1,
    color: theme.colors.foreground,
  },
  quickActions: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: theme.paddings.sm,
    gap: theme.margins.sm,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginTop: theme.margins.sm,
    marginBottom: theme.margins.xs,
  },
  groupCard: {
    padding: theme.paddings.md,
  },
  groupCardHeader: {
    flexDirection: "row",
    gap: theme.margins.md,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  metaText: {
    color: theme.colors.mutedForeground,
    fontSize: 11,
  },
  metaDivider: {
    color: theme.colors.mutedForeground,
    marginHorizontal: 2,
  },
  groupBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.paddings.xl,
  },
}));
