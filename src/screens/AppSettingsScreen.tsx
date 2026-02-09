import React, { useEffect } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button, DropDownButton } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Feather } from "@expo/vector-icons";
import { useAppSettingsStore, useCurrencyStore } from "@/store";
import { SafeArea } from "@/components/ui/SafeArea";
import { SheetManager } from "react-native-actions-sheet";
import { Currencies } from "@/database/models/currency";
import { database } from "@/libs/database";
import { Q } from "@nozbe/watermelondb";

export const AppSettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { currencies, loadCurrencies } = useCurrencyStore();
  const { updateCurrency, currency } = useAppSettingsStore();

  const currencyOptions = currencies.map(
    (currency) => ({
      label: `${currency.name}`,
      value: currency.id.toString(),
      rightIcon: <Text style={{ flex: 1 }}>{`${currency.code}`}</Text>,
    }),
    [currencies],
  );

  const handleSelectCurrency = async () => {
    const result = await SheetManager.show("select-sheet", {
      payload: {
        options: currencyOptions,
        title: "Select Currency",
        selectedValue: currency.id,
      },
    });
    if (result) {
      try {
        const [currency] = await database
          .get<Currencies>("currencies")
          .query(Q.where("id", result))
          .fetch();

        if (currency) {
          updateCurrency(currency);
        }
        console.warn("currency not found in local db");
      } catch (e) {
        console.error("Error setting currency:", e);
      }
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);
  return (
    <SafeArea applyBottomInset style={styles.container} scrollable>
      <View style={styles.content}>
        {/* Preferences */}
        <Card>
          <Text variant="h3" style={styles.sectionTitle}>
            Preferences
          </Text>
          <View style={styles.formGroup}>
            <DropDownButton
              label="Default Currency"
              selectedValue={`${currency.name} (${currency.code})`}
              onPress={handleSelectCurrency}
            />
            <Input label="Language" defaultValue="English" />
            <Input label="Timezone" defaultValue="America/New_York (EST)" />
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            icon={<Feather name="save" size={20} color="white" />}
            size="lg"
            onPress={() => {}}
          />
          <Button
            title="Export Profile Data"
            variant="outline"
            size="lg"
            onPress={() => {}}
          />
        </View>
      </View>
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
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  sectionTitle: {
    marginBottom: theme.margins.md,
  },
  formGroup: {
    gap: theme.margins.md,
  },
  actions: {
    gap: theme.margins.md,
    marginTop: theme.margins.md,
    marginBottom: theme.margins.xl,
  },
}));
