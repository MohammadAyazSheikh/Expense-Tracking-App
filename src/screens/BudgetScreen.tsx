import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Feather } from "@expo/vector-icons";
import { useFinanceStore } from "../store";
import { Icon } from "../components/ui/Icon";
import { Budget, Category } from "../types";
import { Header } from "../components/ui/Headers";

type budgetCardProps = {
  budget: Budget;
  category: Category;
};
const BudgetCard = ({ budget, category }: budgetCardProps) => {
  const { theme } = useUnistyles();
  const isOverLimit = budget.spent > budget.limit;
  const isNearLimit = budget.spent > budget.limit * 0.8;
  const percentage = (budget.spent / budget.limit) * 100;
  return (
    <Card key={budget.category} style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <View style={styles.budgetInfo}>
          <Icon
            name={category?.icon}
            type={category?.iconFamily as any}
            size={24}
            color={category?.color}
          />
          <View>
            <Text weight="semiBold">{budget.category}</Text>
            <Text variant="caption">
              ${budget.spent} of ${budget.limit}
            </Text>
          </View>
        </View>
        {isOverLimit && (
          <Badge
            variant="destructive"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Feather name="alert-circle" size={10} color="white" />
            <Text style={{ color: "white", fontSize: 10 }} weight="semiBold">
              Over
            </Text>
          </Badge>
        )}
        {isNearLimit && !isOverLimit && (
          <Badge
            variant="warning"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Feather name="alert-circle" size={12} color="white" />
            <Text style={{ color: "white", fontSize: 10 }} weight="semiBold">
              {"  Near Limit"}
            </Text>
          </Badge>
        )}
      </View>

      <ProgressBar value={percentage} max={100} color={budget.color} />

      <View style={styles.budgetStats}>
        <Text variant="caption">{percentage.toFixed(0)}% used</Text>
        <Text
          variant="caption"
          weight="semiBold"
          style={{
            color: isOverLimit
              ? theme.colors.destructive
              : theme.colors.success,
          }}
        >
          ${Math.abs(budget.limit - budget.spent)}{" "}
          {isOverLimit ? "over" : "left"}
        </Text>
      </View>
    </Card>
  );
};

export const BudgetScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const budgets = useFinanceStore((state) => state.budgets);
  const categories = useFinanceStore((state) => state.categories);

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overallProgress = (totalSpent / totalLimit) * 100;

  return (
    <ScreenWrapper style={styles.container} scrollable>
      {/* Header */}
      <Header
        onBack={() => navigation.goBack()}
        right={
          <Button
            title="New Budget"
            icon={<Feather name="plus" size={16} color="white" />}
            variant="secondary"
            size="sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            textStyle={{ color: "white" }}
            onPress={() => navigation.navigate("CreateBudget")}
          />
        }
      >
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text variant="caption" style={styles.summaryLabel}>
                Total Budget
              </Text>
              <Text style={styles.summaryValue} weight="bold">
                ${totalLimit.toLocaleString()}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text variant="caption" style={styles.summaryLabel}>
                Spent
              </Text>
              <Text
                style={[styles.summaryValue, { fontSize: 22 }]}
                weight="bold"
              >
                ${totalSpent.toLocaleString()}
              </Text>
            </View>
          </View>
          <ProgressBar
            value={overallProgress}
            max={100}
            color="white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", height: 8 }}
          />
          <Text variant="caption" style={styles.summaryRemaining}>
            ${(totalLimit - totalSpent).toLocaleString()} remaining this month
          </Text>
        </Card>
      </Header>

      <View style={styles.content}>
        {/* AI Insights */}
        <Card style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Feather name="zap" size={20} color={theme.colors.background} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="semiBold" style={{ marginBottom: 4 }}>
              SmartSense™ Suggestion
            </Text>
            <Text variant="caption">
              You're on track to save $200 this month! Consider reducing
              Shopping by $50 to increase savings.
            </Text>
          </View>
        </Card>

        {/* Budget Categories */}
        <View style={{ gap: theme.margins.md }}>
          <View style={styles.sectionHeader}>
            <Text variant="h2">Categories</Text>
            <Button
              title="View Trends"
              icon={
                <Feather
                  name="trending-up"
                  size={16}
                  color={theme.colors.primary}
                />
              }
              variant="ghost"
              size="sm"
              onPress={() => {}}
            />
          </View>

          {budgets.map((budget) => {
            const category = categories.find((c) => c.name === budget.category);
            return (
              <BudgetCard
                key={budget.category}
                budget={budget}
                category={category!}
              />
            );
          })}
        </View>

        {/* Monthly Goal */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIcon}>
              <Feather
                name="trending-up"
                size={24}
                color={theme.colors.background}
              />
            </View>
            <View>
              <Text weight="semiBold">Monthly Savings Goal</Text>
              <Text variant="caption">Save $500 this month</Text>
            </View>
          </View>
          <ProgressBar value={80} max={100} />
          <Text variant="caption" style={{ marginTop: 8 }}>
            $325 saved • $175 to go
          </Text>
        </Card>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: theme.paddings.lg,
    borderRadius: theme.radius.lg,
    marginVertical: theme.margins.lg,
    maxWidth: {
      md: 600,
    },
    alignSelf: {
      md: "center",
    },
    width: "100%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.margins.md,
  },
  summaryLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  summaryValue: {
    color: "white",
    fontSize: 28,
  },
  summaryRemaining: {
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: theme.margins.sm,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  insightCard: {
    flexDirection: "row",
    gap: theme.margins.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
    alignItems: "center",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.xs,
  },
  budgetCard: {
    padding: theme.paddings.lg,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.md,
  },
  budgetInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.margins.sm,
  },
  goalCard: {
    marginTop: theme.margins.md,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    marginBottom: theme.margins.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
}));
