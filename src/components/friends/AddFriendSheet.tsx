import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import Toast from "react-native-toast-message";
import { useFinanceStore } from "../../store";
import { Input } from "../ui/Input";

const FRIEND_AVATARS = [
  "👨",
  "👩",
  "🧔",
  "👩‍🦰",
  "👨‍🦱",
  "👩‍🦳",
  "👱‍♂️",
  "👱‍♀️",
  "👲",
  "👳‍♂️",
];

export const AddFriendSheet = (props: SheetProps) => {
  const { theme } = useUnistyles();
  const addFriend = useFinanceStore((state) => state.addFriend);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (!name) {
      Toast.show({
        type: "error",
        text1: "Required Field",
        text2: "Please enter a name.",
      });
      return;
    }

    addFriend({
      name,
      email,
      phone,
      avatar: FRIEND_AVATARS[Math.floor(Math.random() * FRIEND_AVATARS.length)],
    });

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `${name} added as friend!`,
    });

    SheetManager.hide(props.sheetId);
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: theme.colors.border }}
      gestureEnabled={true}
    >
      <View style={styles.header}>
        <Text weight="bold" style={styles.title}>
          Add New Friend
        </Text>
      </View>

      <View style={styles.content}>
        <Input
          label="Full Name"
          placeholder="Friend's name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={theme.colors.mutedForeground}
        />

        <Input
          label="Email"
          placeholder="friend@example.com"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.colors.mutedForeground}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Phone"
          placeholder="+1 234 567 8901"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={theme.colors.mutedForeground}
          keyboardType="phone-pad"
        />

        <Button
          title="Add Friend"
          onPress={handleSave}
          icon={
            <Icon type="Feather" name="user-plus" size={18} color="white" />
          }
          style={{ marginTop: theme.margins.md }}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: theme.paddings.xl,
    backgroundColor: theme.colors.card,
  },
  header: {
    padding: theme.paddings.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSize.lg,
  },
  content: {
    padding: theme.paddings.md,
    gap: theme.margins.md,
  },
}));
