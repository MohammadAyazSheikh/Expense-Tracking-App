import React from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { useFinanceStore } from "../store";
import { Icon } from "../components/ui/Icon";

type TransactionDetailRouteProp = RouteProp<
  RootStackParamList,
  "TransactionDetail"
>;

const getCategoryEmoji = (categoryName: string): string => {
  const emojis: Record<string, string> = {
    Food: "🍔",
    Transport: "🚗",
    Bills: "📱",
    Income: "💰",
    Shopping: "🛍️",
    Health: "💊",
    Education: "📚",
    Entertainment: "🎬",
  };
  return emojis[categoryName] || "📝";
};

export const TransactionDetailScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<TransactionDetailRouteProp>();

  const { id, category } = route.params || {};
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const tags = useFinanceStore((state) => state.tags);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            {t("transactionDetail.notFound", "Transaction not found")}
          </Text>
          <Button
            title={t("common.goBack", "Go Back")}
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const isIncome = transaction.type === "income";
  const transactionTags = transaction.tags
    ? tags.filter((tag) => transaction.tags?.includes(tag.id))
    : [];

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isIncome
              ? theme.colors.success
              : theme.colors.primary,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("transactionDetail.title", "Transaction Details")}
          </Text>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.amountDisplay}>
          <Icon
            style={styles.emoji}
            type={category?.iconFamily as any}
            name={category?.icon}
          />
          <Text weight="black" style={styles.amount}>
            {isIncome ? "+" : ""}
            {transaction.amount < 0 ? "-" : ""}$
            {Math.abs(transaction.amount).toFixed(2)}
          </Text>
          <Text style={styles.transactionName}>{transaction.name}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Main Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={theme.colors.mutedForeground}
              />
              <Text variant="caption">
                {t("transactionDetail.category", "Category")}
              </Text>
            </View>
            <Badge variant="secondary">{transaction.category}</Badge>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.mutedForeground}
              />
              <Text variant="caption">
                {t("transactionDetail.date", "Date")}
              </Text>
            </View>
            <Text weight="medium">{formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.mutedForeground}
              />
              <Text variant="caption">
                {t("transactionDetail.time", "Time")}
              </Text>
            </View>
            <Text weight="medium">{transaction.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons
                name="card-outline"
                size={20}
                color={theme.colors.mutedForeground}
              />
              <Text variant="caption">
                {t("transactionDetail.payment", "Payment Method")}
              </Text>
            </View>
            <Text weight="medium">{transaction.payment}</Text>
          </View>

          {transaction.recurring && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons
                  name="repeat-outline"
                  size={20}
                  color={theme.colors.mutedForeground}
                />
                <Text variant="caption">
                  {t("transactionDetail.recurring", "Recurring")}
                </Text>
              </View>
              <Badge
                variant="outline"
                style={{ borderColor: theme.colors.primary }}
              >
                {t("transactionDetail.monthly", "Monthly")}
              </Badge>
            </View>
          )}
        </Card>

        {/* Tags */}
        {transactionTags.length > 0 && (
          <Card style={styles.tagsCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="pricetags-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text variant="caption">
                  {t("transactionDetail.tags", "Tags")}
                </Text>
              </View>
            </View>
            <View style={styles.tagsList}>
              {transactionTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{
                    borderColor: tag.color,
                    backgroundColor: tag.color + "15",
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </View>
          </Card>
        )}

        {/* Location */}
        {transaction.location && (
          <Card style={styles.locationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text variant="caption">
                  {t("transactionDetail.location", "Location")}
                </Text>
                <Text weight="medium">{transaction.location}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Note */}
        {transaction.note && (
          <Card style={styles.noteCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={theme.colors.accentForeground}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" style={{ marginBottom: 4 }}>
                  {t("transactionDetail.note", "Note")}
                </Text>
                <Text>{transaction.note}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={t("common.edit", "Edit")}
            icon={<Ionicons name="pencil-outline" size={18} />}
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => {
              // Navigate to edit
            }}
          />
          <Button
            title={t("common.delete", "Delete")}
            icon={
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.destructive}
              />
            }
            variant="outline"
            style={{
              flex: 1,
              borderColor: theme.colors.destructive,
            }}
            textStyle={{ color: theme.colors.destructive }}
            onPress={handleDelete}
          />
        </View>
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
    paddingBottom: theme.paddings.xl * 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.xl,
  },
  headerTitle: {
    color: "white",
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
  },
  amountDisplay: {
    alignItems: "center",
    gap: theme.margins.sm,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.margins.sm,
    color: theme.colors.accentForeground,
  },
  amount: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  transactionName: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: theme.fontSize.lg,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.xl,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  detailsCard: {
    padding: theme.paddings.lg,
    gap: theme.margins.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  tagsCard: {
    padding: theme.paddings.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
    marginBottom: theme.margins.sm,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.sm,
  },
  locationCard: {
    padding: theme.paddings.lg,
  },
  noteCard: {
    padding: theme.paddings.lg,
  },
  actions: {
    flexDirection: "row",
    gap: theme.margins.sm,
    marginTop: theme.margins.sm,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.margins.lg,
  },
  notFoundText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.lg,
  },
}));
