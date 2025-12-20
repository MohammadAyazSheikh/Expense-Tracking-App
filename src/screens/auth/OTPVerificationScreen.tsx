import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/types";
import { useAuthStore } from "../../store";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";

type ScreenRouteProp = RouteProp<RootStackParamList, "OTPVerification">;

const CELL_COUNT = 6;

export const OTPVerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { email, type } = route.params;
  const { verifyOTP, sendOTP, isLoading, error, clearError } = useAuthStore();

  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(30);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (value.length !== CELL_COUNT) return;
    try {
      clearError();
      const isValid = await verifyOTP(email, value, type);
      if (isValid) {
        if (type === "signup") {
        } else {
          navigation.navigate("ResetPassword", { email, code: value });
        }
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      clearError();
      await sendOTP(email, type);
      setTimer(30);
    } catch (err) {
      console.error("Resend failed", err);
    }
  };
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Button
          title=""
          variant="ghost"
          icon={
            <Feather name="arrow-left" size={24} color={styles.icon.color} />
          }
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="h2">Verification</Text>
      </View>

      <View style={styles.content}>
        <Text variant="body" style={styles.subtitle}>
          Enter the verification code sent to{"\n"}
          <Text weight="bold">{email}</Text>
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.cellText} weight="bold">
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        {error && (
          <Text style={styles.errorText} align="center">
            {error}
          </Text>
        )}

        <View style={styles.resendContainer}>
          <Text variant="caption">Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text
              variant="caption"
              weight="bold"
              style={{
                color:
                  timer > 0
                    ? styles.disabledText.color
                    : styles.activeText.color,
              }}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend"}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={isLoading}
          style={styles.verifyButton}
          disabled={value.length !== CELL_COUNT}
        />
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
    padding: theme.paddings.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
  },
  backButton: {
    width: 40,
    paddingHorizontal: 0,
  },
  icon: {
    color: theme.colors.foreground,
  },
  content: {
    padding: theme.paddings.lg,
    alignItems: "stretch",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: theme.margins.xl,
    color: theme.colors.mutedForeground,
  },
  codeFieldRoot: {
    marginTop: theme.margins.lg,
    width: "100%",
    gap: theme.margins.sm,
    justifyContent: "center",
  },
  cell: {
    width: 45,
    height: 50,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  cellText: {
    fontSize: 20,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.margins.xl,
  },
  verifyButton: {
    marginTop: theme.margins.sm,
  },
  errorText: {
    color: theme.colors.destructive,
    marginTop: theme.margins.md,
  },
  disabledText: {
    color: theme.colors.mutedForeground,
  },
  activeText: {
    color: theme.colors.primary,
  },
}));
