import React from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "@/store";
import { SafeArea } from "@/components/ui/SafeArea";

export const AppSettingsScreen = () => {
  const { user } = useAuthStore();

  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeArea applyBottomInset style={styles.container} scrollable>
      <View style={styles.content}>
        {/* Preferences */}
        <Card>
          <Text variant="h3" style={styles.sectionTitle}>
            Preferences
          </Text>
          <View style={styles.formGroup}>
            <Input label="Default Currency" defaultValue="USD ($)" />
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
