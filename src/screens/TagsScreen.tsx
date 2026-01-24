import React, { useLayoutEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { useFinanceStore } from "../store";
import { Tag } from "../types";
import { SheetManager } from "react-native-actions-sheet";
import { alertService } from "../utils/alertService";
import { SafeArea } from "@/components/ui/SafeArea";
import { Header } from "@/components/ui/Headers";
import Fab from "@/components/ui/Fab";

const SUGGESTED_TAGS = [
  "Travel",
  "Office",
  "Home",
  "Weekend",
  "Monthly",
  "Annual",
  "Online",
  "Cash",
];

export const TagsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const tags = useFinanceStore((state) => state.tags);
  const deleteTag = useFinanceStore((state) => state.deleteTag);
  const addTag = useFinanceStore((state) => state.addTag);

  const handleAddTag = () => {
    SheetManager.show("tag-sheet");
  };

  const handleEditTag = (tag: Tag) => {
    SheetManager.show("tag-sheet", {
      payload: { tag },
    });
  };

  const handleDelete = (id: string, name: string) => {
    alertService.show(
      t("tags.deleteConfirmTitle"),
      t("tags.deleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteTag(id),
        },
      ],
    );
  };

  const handleAddSuggested = (name: string) => {
    const colors = [
      "hsl(0, 75%, 60%)",
      "hsl(210, 80%, 55%)",
      "hsl(145, 70%, 50%)",
      "hsl(35, 85%, 55%)",
      "hsl(280, 70%, 60%)",
      "hsl(340, 70%, 60%)",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    addTag({ name, color: randomColor });
  };

  return (
    <SafeArea applyBottomInset style={styles.container}>
      <SafeArea scrollable>
        <View style={styles.content}>
          {/* Tags List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text weight="semiBold" style={styles.sectionTitle}>
                {t("tags.yourTags", "Your Tags")}
              </Text>
              <Badge variant="secondary">
                {tags.length} {t("tags.total", "Total")}
              </Badge>
            </View>

            {tags.length === 0 ? (
              <Card style={styles.emptyState}>
                <Ionicons
                  name="pricetag-outline"
                  size={48}
                  color={theme.colors.mutedForeground}
                />
                <Text style={styles.emptyText}>
                  {t("tags.noTags", "No tags created yet")}
                </Text>
                <Button
                  title={t("tags.createFirst", "Create Your First Tag")}
                  icon={<Ionicons name="add" size={18} color="white" />}
                  onPress={handleAddTag}
                  style={{ marginTop: 16 }}
                />
              </Card>
            ) : (
              <View style={styles.tagsGrid}>
                {tags.map((tag) => (
                  <Card key={tag.id} style={styles.tagCard}>
                    <TouchableOpacity
                      style={styles.tagContent}
                      onPress={() => handleEditTag(tag)}
                    >
                      <View style={styles.tagInfo}>
                        <View
                          style={[
                            styles.tagDot,
                            { backgroundColor: tag.color },
                          ]}
                        />
                        <Text weight="medium" numberOfLines={1}>
                          {tag.name}
                        </Text>
                      </View>
                      <View style={styles.tagActions}>
                        <TouchableOpacity
                          onPress={() => handleDelete(tag.id, tag.name)}
                          style={styles.actionButton}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color={theme.colors.destructive}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            )}
          </View>

          {/* Suggested Tags */}
          <Card style={styles.suggestedCard}>
            <Text weight="semiBold" style={styles.suggestedTitle}>
              {t("tags.suggested", "Suggested Tags")}
            </Text>
            <View style={styles.suggestedTags}>
              {SUGGESTED_TAGS.map((suggestion) => {
                const exists = tags.some(
                  (t) => t.name.toLowerCase() === suggestion.toLowerCase(),
                );
                return (
                  <Button
                    key={suggestion}
                    title={suggestion}
                    icon={<Ionicons name="add" size={14} />}
                    variant="outline"
                    size="sm"
                    disabled={exists}
                    onPress={() => handleAddSuggested(suggestion)}
                    style={styles.suggestedButton}
                  />
                );
              })}
            </View>
          </Card>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <Text weight="semiBold" style={styles.infoTitle}>
              💡 {t("tags.tip", "Tip")}
            </Text>
            <Text style={styles.infoText}>
              {t(
                "tags.tipDescription",
                "Tags help you filter and analyze expenses across different categories. Use them to track project-specific spending or personal goals.",
              )}
            </Text>
          </Card>
        </View>
      </SafeArea>
      <Fab onPress={handleAddTag} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: theme.fontSize.sm,
    paddingVertical: theme.paddings.md,
  },
  content: {
    padding: theme.paddings.md,
    paddingBottom: theme.paddings.xl,
    gap: theme.margins.md,
    maxWidth: {
      md: 800,
    },
    alignSelf: "center",
    width: "100%",
  },
  formCard: {
    padding: theme.paddings.lg,
  },
  formTitle: {
    fontSize: theme.fontSize.lg,
    marginBottom: theme.margins.md,
  },
  formContent: {
    gap: theme.margins.md,
  },
  label: {
    marginBottom: theme.margins.xs,
    fontSize: theme.fontSize.sm,
  },
  formActions: {
    flexDirection: "row",
    gap: theme.margins.sm,
    marginTop: theme.margins.sm,
  },
  section: {
    gap: theme.margins.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.margins.xs,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
  },
  emptyState: {
    padding: theme.paddings.xl,
    alignItems: "center",
    gap: theme.margins.sm,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.sm,
  },
  tagCard: {
    width: "48%",
    padding: theme.paddings.md,
  },
  tagContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.margins.sm,
  },
  tagInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.sm,
    flex: 1,
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagActions: {
    flexDirection: "row",
    gap: theme.margins.xs,
  },
  actionButton: {
    padding: theme.paddings.xs,
  },
  suggestedCard: {
    padding: theme.paddings.lg,
  },
  suggestedTitle: {
    fontSize: theme.fontSize.md,
    marginBottom: theme.margins.md,
  },
  suggestedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.sm,
  },
  suggestedButton: {
    paddingHorizontal: theme.paddings.sm,
  },
  infoCard: {
    padding: theme.paddings.lg,
    backgroundColor: theme.colors.primary + "10",
    borderColor: theme.colors.primary + "20",
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    marginBottom: theme.margins.sm,
    color: theme.colors.muted,
  },
  infoText: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
}));
