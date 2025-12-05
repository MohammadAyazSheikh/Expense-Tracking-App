import React, { useState } from "react";
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
import ColorPicker from "../components/ui/ColorPicker";

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
  const addTag = useFinanceStore((state) => state.addTag);
  const updateTag = useFinanceStore((state) => state.updateTag);
  const deleteTag = useFinanceStore((state) => state.deleteTag);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState<Omit<Tag, "id">>({
    name: "",
    color: "hsl(255, 70%, 65%)",
  });

  const handleSaveNew = () => {
    if (newTag.name.trim()) {
      addTag(newTag);
      setNewTag({ name: "", color: "hsl(255, 70%, 65%)" });
      setIsAddingNew(false);
    }
  };

  const handleSaveEdit = () => {
    if (editingTag) {
      updateTag(editingTag.id, editingTag);
      setEditingTag(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteTag(id);
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
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Ionicons name="arrow-back" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>
            {t("tags.title", "Tags")}
          </Text>
          <Button
            title={t("tags.add", "Add")}
            icon={<Ionicons name="add" size={20} color="white" />}
            variant="ghost"
            onPress={() => {
              setIsAddingNew(true);
              setEditingTag(null);
            }}
            style={{ paddingHorizontal: 8 }}
          />
        </View>
        <Text style={styles.headerDescription}>
          {t("tags.description", "Create tags to organize your transactions")}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Add/Edit Form */}
        {(isAddingNew || editingTag) && (
          <Card style={styles.formCard}>
            <Text weight="semiBold" style={styles.formTitle}>
              {editingTag
                ? t("tags.editTag", "Edit Tag")
                : t("tags.addNew", "Add New Tag")}
            </Text>
            <View style={styles.formContent}>
              <View>
                <Text weight="medium" style={styles.label}>
                  {t("tags.name", "Tag Name")}
                </Text>
                <Input
                  placeholder={t("tags.namePlaceholder", "e.g., Business")}
                  value={editingTag?.name || newTag.name}
                  onChangeText={(text) =>
                    editingTag
                      ? setEditingTag({ ...editingTag, name: text })
                      : setNewTag({ ...newTag, name: text })
                  }
                />
              </View>
              <View>
                <Text weight="medium" style={styles.label}>
                  {t("tags.color", "Color")}
                </Text>
                <ColorPicker
                  value={editingTag?.color || newTag.color}
                  onChange={(color) =>
                    editingTag
                      ? setEditingTag({ ...editingTag, color })
                      : setNewTag({ ...newTag, color })
                  }
                />
              </View>
              <View style={styles.formActions}>
                <Button
                  title={t("tags.save", "Save")}
                  icon={
                    <Ionicons name="save-outline" size={18} color="white" />
                  }
                  onPress={editingTag ? handleSaveEdit : handleSaveNew}
                  style={{ flex: 1 }}
                />
                <Button
                  title={t("tags.cancel", "Cancel")}
                  icon={<Ionicons name="close-outline" size={18} />}
                  variant="outline"
                  onPress={() => {
                    setIsAddingNew(false);
                    setEditingTag(null);
                    setNewTag({ name: "", color: "hsl(255, 70%, 65%)" });
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </Card>
        )}

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
                onPress={() => setIsAddingNew(true)}
                style={{ marginTop: 16 }}
              />
            </Card>
          ) : (
            <View style={styles.tagsGrid}>
              {tags.map((tag) => (
                <Card key={tag.id} style={styles.tagCard}>
                  <View style={styles.tagContent}>
                    <View style={styles.tagInfo}>
                      <View
                        style={[styles.tagDot, { backgroundColor: tag.color }]}
                      />
                      <Text weight="medium" numberOfLines={1}>
                        {tag.name}
                      </Text>
                    </View>
                    <View style={styles.tagActions}>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingTag(tag);
                          setIsAddingNew(false);
                        }}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={16}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(tag.id)}
                        style={styles.actionButton}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={theme.colors.destructive}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
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
                (t) => t.name.toLowerCase() === suggestion.toLowerCase()
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
              "Tags help you filter and analyze expenses across different categories. Use them to track project-specific spending or personal goals."
            )}
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
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    marginBottom: theme.margins.sm,
  },
  headerTitle: {
    color: "white",
    flex: 1,
  },
  headerDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: theme.fontSize.sm,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
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
  },
  infoText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
}));
