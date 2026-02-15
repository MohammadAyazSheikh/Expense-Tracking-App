import React from "react";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../components/ui/Text";
import { DropDownButton } from "../components/ui/Button";
import { useTranslation } from "../hooks/useTranslation";
import { useAppSettingsStore } from "@/store";
import { SafeArea } from "@/components/ui/SafeArea";
import { SheetManager } from "react-native-actions-sheet";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/libs/database";
import { Currencies } from "@/database/models/currency";
import { Card } from "@/components/ui/Card";

const CurrencyPickerBase = ({ currencies }: { currencies: Currencies[] }) => {
  const { currency, updateCurrency } = useAppSettingsStore();

  const { t } = useTranslation();

  const handleSelectCurrency = async () => {
    const options = currencies.map((c) => ({
      value: c.id,
      id: c.id,
      name: c.name,
      code: c.code,
      label: c.name,
      originalItem: c,
    }));

    const result = await SheetManager.show("select-sheet", {
      payload: {
        selectedValue: currency?.id || "",
        options,
        title: t("wallets.currency"),
      },
    });

    if (result) {
      updateCurrency(result.originalItem);
    }
  };

  return (
    <DropDownButton
      label={t("wallets.currency")}
      selectedValue={currency?.code as string}
      onPress={handleSelectCurrency}
    />
  );
};

const enhanceCurrencyPicker = withObservables([], () => ({
  currencies: database.get<Currencies>("currencies").query().observe(),
}));

const CurrencyPicker = enhanceCurrencyPicker(CurrencyPickerBase);

export const AppSettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // App Settings Store
  const { language, changeLanguage } = useAppSettingsStore();

  return (
    <SafeArea applyBottomInset style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            {t("settings.preferences")}
          </Text>
          <Card style={styles.card}>
            {/* Currency Picker */}
            <CurrencyPicker />
            <View style={styles.divider} />
            {/* Language Picker */}
            <DropDownButton
              label={t("settings.language")}
              selectedValue={language === "en" ? "English" : "Arabic"}
              onPress={async () => {
                const result = await SheetManager.show("select-sheet", {
                  payload: {
                    selectedValue: language,
                    options: [
                      { label: "English", value: "en" },
                      { label: "Arabic", value: "ar" },
                    ],
                    title: t("settings.language"),
                  },
                });
                if (result) changeLanguage(result.value as "en" | "ar");
              }}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.lg,
  },
  section: {
    gap: theme.margins.sm,
  },
  sectionTitle: {
    marginBottom: theme.margins.xs,
  },
  card: {
    gap: theme.margins.md,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs,
  },
}));
