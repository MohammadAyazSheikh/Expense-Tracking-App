import React from "react";
import { View, Pressable } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";

import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useFinanceStore } from "../../store";
import { Icon } from "../ui/Icon";

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be greater than 0"
    ),
  paymentMethod: z.string(),
});

type FormValues = z.infer<typeof schema>;

const paymentMethods = [
  { id: "cash", name: "Cash", icon: "dollar-sign" },
  { id: "card", name: "Card", icon: "credit-card" },
  { id: "upi", name: "UPI/Bank", icon: "smartphone" },
];

export const RecordPaymentSheet = (
  props: SheetProps<"record-payment-sheet">
) => {
  const { theme } = useUnistyles();
  const { settlement, onConfirm } = props.payload || {};
  const { wallets } = useFinanceStore();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: settlement?.amount?.toString() || "",
      paymentMethod: "cash",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const onSubmit = (data: FormValues) => {
    if (onConfirm) {
      onConfirm(parseFloat(data.amount), data.paymentMethod);
    }
    SheetManager.hide(props.sheetId);
  };

  if (!settlement) return null;

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: theme.colors.background,
      }}
      gestureEnabled
      indicatorStyle={{ backgroundColor: theme.colors.border }}
    >
      <View style={styles.container}>
        <Text variant="h3" style={{ textAlign: "center", marginBottom: 24 }}>
          Record Payment
        </Text>

        {/* Visual From -> To */}
        <View style={styles.settlementVisual}>
          <View style={styles.visualAvatar}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.colors.primary + "15" },
              ]}
            >
              <Text weight="bold" style={styles.avatarText}>
                {settlement.from.charAt(0)}
              </Text>
            </View>
            <Text variant="caption" style={{ marginTop: 4 }}>
              {settlement.from}
            </Text>
          </View>
          <Feather
            name="arrow-right"
            size={24}
            color={theme.colors.mutedForeground}
          />
          <View style={styles.visualAvatar}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.colors.success + "15" },
              ]}
            >
              <Text weight="bold" style={styles.avatarText}>
                {settlement.to.charAt(0)}
              </Text>
            </View>
            <Text variant="caption" style={{ marginTop: 4 }}>
              {settlement.to}
            </Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={{ marginBottom: 20 }}>
          <Text weight="medium" style={{ marginBottom: 8 }}>
            Amount
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="0.00"
                keyboardType="decimal-pad"
                leftIcon={
                  <Feather
                    name="dollar-sign"
                    size={16}
                    color={theme.colors.mutedForeground}
                  />
                }
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.amount?.message}
              />
            )}
          />
        </View>

        {/* Payment Methods */}
        <View style={{ marginBottom: 24 }}>
          <Text weight="medium" style={{ marginBottom: 8 }}>
            Payment Method
          </Text>
          <View style={styles.methodGrid}>
            {wallets.map((w) => (
              <Pressable
                key={w.id}
                style={[
                  styles.methodItem,
                  selectedPaymentMethod === w.id && styles.activeMethod,
                ]}
                onPress={() => setValue("paymentMethod", w.id)}
              >
                <Icon
                  type="MaterialCommunityIcons"
                  name={w.icon as any}
                  size={28}
                  color={w.color}
                />
                <Text
                  variant="caption"
                  style={{
                    marginTop: 4,
                    color: w.color,
                  }}
                >
                  {w.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Button
          title="Confirm Settlement"
          onPress={handleSubmit(onSubmit)}
          icon={<Feather name="check" size={20} color="white" />}
          style={{ height: 50 }}
        />
        <View style={{ height: 20 }} />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.paddings.xl,
    paddingBottom: 40,
  },
  settlementVisual: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 32,
  },
  visualAvatar: {
    alignItems: "center",
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.background,
  },
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: theme.margins.md,
  },
  methodItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    width: "48%",
    borderColor: theme.colors.border,
  },
  activeMethod: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
}));
