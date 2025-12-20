import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Icon, IconType } from "../ui/Icon";
import { Transaction, Category } from "../../types";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type TransactionCardProps = {
  transaction: Transaction;
  category?: Category;
  onPress: () => void;
  showDate?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TransactionCard = ({
  transaction,
  category,
  onPress,
  showDate = false,
  containerStyle,
}: TransactionCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Card style={[styles.transactionCard, containerStyle]} onPress={onPress}>
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: category?.color || theme.colors.muted },
        ]}
      >
        <Icon
          type={(category?.iconFamily as IconType) || "Ionicons"}
          name={(category?.icon as any) || "help"}
          size={20}
          color="white"
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text weight="medium" numberOfLines={1}>
          {transaction.name}
        </Text>
        <View style={styles.transactionMeta}>
          <Badge variant="outline" style={styles.categoryBadge}>
            {transaction.category}
          </Badge>
          <Text variant="caption">
            {showDate ? transaction.date : transaction.time}
          </Text>
        </View>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          weight="semiBold"
          style={{
            color:
              transaction.type === "income"
                ? theme.colors.success
                : theme.colors.foreground,
          }}
        >
          {transaction.type === "income" ? "+" : ""}
          {transaction.amount.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create((theme: any) => ({
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.paddings.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.xs,
    marginTop: 4,
  },
  categoryBadge: {
    paddingVertical: 0,
    paddingHorizontal: 6,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
}));
