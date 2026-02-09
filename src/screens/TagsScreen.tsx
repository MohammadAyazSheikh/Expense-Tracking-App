import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { LegendList } from "@legendapp/list";
import { Tag } from "../types";
import Fab from "@/components/ui/Fab";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { SheetManager } from "react-native-actions-sheet";
import { alertService } from "@/utils/alertService";
import { SafeArea } from "@/components/ui/SafeArea";
import { useTagStore } from "@/store";

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
type TagItemProps = {
  data: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string, name: string) => void;
};

export const TagItem = ({ data, onEdit, onDelete }: TagItemProps) => {
  const { theme } = useUnistyles();
  return (
    <Card key={data.id} style={styles.tagCard}>
      <TouchableOpacity style={styles.tagContent} onPress={() => onEdit(data)}>
        <View style={styles.tagInfo}>
          <View style={[styles.tagDot, { backgroundColor: data.color }]} />
          <Text weight="medium" numberOfLines={1}>
            {data.name}
          </Text>
        </View>
        <View style={styles.tagActions}>
          <TouchableOpacity
            onPress={() => onDelete(data.id, data.name)}
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
  );
};

export const TagsScreen = () => {
  const { t } = useTranslation();
  const { tags, deleteTag, addTag, loadTags } = useTagStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleAddTag = () => {
    SheetManager.show("tag-sheet");
  };

  const handleEditTag = (tag: Tag) => {
    SheetManager.show("tag-sheet", {
      payload: { tag },
    });
  };

  const handleDelete = (id: string, name: string) => {
    alertService.show({
      title: t("tags.deleteConfirmTitle"),
      message: t("tags.deleteConfirmMessage"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteTag(id),
        },
      ],
    });
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

  useEffect(() => {
    loadTags();
  }, []);

  const renderItem = ({ item }: { item: Tag }) => {
    return (
      <TagItem data={item} onEdit={handleEditTag} onDelete={handleDelete} />
    );
  };
  return (
    <SafeArea applyBottomInset style={styles.container}>
      <LegendList
        numColumns={2}
        columnWrapperStyle={styles?.columnWrapperStyle}
        recycleItems
        data={tags}
        estimatedItemSize={50}
        keyExtractor={(item: Tag) => item.id}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text weight="semiBold" style={styles.sectionTitle}>
              {t("tags.yourTags", "Your Tags")}
            </Text>
            <Badge variant="secondary">
              {tags.length} {t("tags.total", "Total")}
            </Badge>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
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
        }
      />
      <Fab onPress={handleAddTag} />
    </SafeArea>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  columnWrapperStyle: {
    gap: theme.margins.sm,
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
    marginBottom: theme.margins.md,
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
    flex: 1,
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
  footer: {
    marginTop: theme.margins.md,
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
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    marginTop: theme.margins.sm,
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
