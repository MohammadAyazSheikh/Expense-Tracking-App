import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { alertService } from '../../utils/AlertService';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../ui/Text';

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (category: { name: string; icon: string; color: string; tags: string[] }) => void;
}

const ICONS = [
    'fast-food', 'cart', 'car', 'home', 'medkit', 'school', 'airplane', 'game-controller',
    'shirt', 'gift', 'paw', 'bicycle', 'bus', 'cafe', 'card', 'cash',
    'construct', 'desktop', 'fitness', 'flower', 'hammer', 'heart', 'key', 'library',
    'map', 'musical-notes', 'phone-portrait', 'pizza', 'pricetag', 'restaurant', 'rocket', 'wallet'
];

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#E67E22', '#2ECC71', '#1ABC9C', '#F1C40F', '#E74C3C', '#34495E', '#95A5A6', '#7F8C8D'
];

const styles = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.paddings.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: theme.fontSize.lg,
        fontWeight: 'bold',
        color: theme.colors.foreground,
    },
    cancelButton: {
        color: theme.colors.destructive,
        fontSize: theme.fontSize.md,
    },
    saveButton: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
    },
    content: {
        padding: theme.paddings.md,
        paddingBottom: 50,
    },
    previewContainer: {
        alignItems: 'center',
        marginVertical: theme.margins.lg,
    },
    iconPreview: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: theme.colors.foreground,
        marginTop: theme.margins.lg,
        marginBottom: theme.margins.sm,
    },
    input: {
        backgroundColor: theme.colors.input,
        padding: theme.paddings.md,
        borderRadius: theme.radius.md,
        color: theme.colors.foreground,
        fontSize: theme.fontSize.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    gridItem: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        variants: {
            selected: {
                true: {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.input,
                }
            }
        }
    },
    colorItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        variants: {
            selected: {
                true: {
                    borderWidth: 3,
                    borderColor: theme.colors.background,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }
            }
        }
    },
    tagInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    tagInput: {
        flex: 1,
        backgroundColor: theme.colors.input,
        padding: theme.paddings.md,
        borderRadius: theme.radius.md,
        color: theme.colors.foreground,
        fontSize: theme.fontSize.md,
    },
    addTagButton: {
        padding: theme.paddings.sm,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: theme.margins.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.paddings.sm,
        paddingVertical: 4,
        borderRadius: theme.radius.full,
        gap: 4,
    },
    tagText: {
        color: theme.colors.primaryForeground,
        fontSize: theme.fontSize.sm,
    },
}));

const IconItem = ({ icon, isSelected, onPress }: { icon: string, isSelected: boolean, onPress: () => void }) => {
    const { theme } = useUnistyles();
    styles.useVariants({
        selected: isSelected
    });

    return (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={onPress}
        >
            <Ionicons name={icon as any} size={24} color={isSelected ? theme.colors.primary : theme.colors.foreground} />
        </TouchableOpacity>
    );
};

const ColorItem = ({ color, isSelected, onPress }: { color: string, isSelected: boolean, onPress: () => void }) => {
    styles.useVariants({
        selected: isSelected
    });

    return (
        <TouchableOpacity
            style={[styles.colorItem, { backgroundColor: color }]}
            onPress={onPress}
        />
    );
};

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onClose, onSave }) => {
    const { theme } = useUnistyles();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = () => {
        if (!name.trim()) {
            alertService.show(t('common.error'), t('addExpense.descriptionRequired'));
            return;
        }
        onSave({
            name: name.trim(),
            icon: selectedIcon,
            color: selectedColor,
            tags
        });
        setName('');
        setTags([]);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelButton}>{t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{t('categoryManager.newCategory')}</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveButton}>{t('common.save')}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.previewContainer}>
                        <View style={[styles.iconPreview, { backgroundColor: selectedColor }]}>
                            <Ionicons name={selectedIcon as any} size={40} color="white" />
                        </View>
                    </View>

                    <Text style={styles.label}>{t('categoryManager.categoryName')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Groceries"
                        placeholderTextColor={theme.colors.mutedForeground}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>{t('categoryManager.selectIcon')}</Text>
                    <View style={styles.grid}>
                        {ICONS.map(icon => (
                            <IconItem
                                key={icon}
                                icon={icon}
                                isSelected={selectedIcon === icon}
                                onPress={() => setSelectedIcon(icon)}
                            />
                        ))}
                    </View>

                    <Text style={styles.label}>{t('categoryManager.selectColor')}</Text>
                    <View style={styles.grid}>
                        {COLORS.map(color => (
                            <ColorItem
                                key={color}
                                color={color}
                                isSelected={selectedColor === color}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>

                    <Text style={styles.label}>{t('categoryManager.tags')}</Text>
                    <View style={styles.tagInputContainer}>
                        <TextInput
                            style={styles.tagInput}
                            placeholder={t('categoryManager.addTag')}
                            placeholderTextColor={theme.colors.mutedForeground}
                            value={currentTag}
                            onChangeText={setCurrentTag}
                            onSubmitEditing={handleAddTag}
                        />
                        <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
                            <Ionicons name="add" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagsContainer}>
                        {tags.map(tag => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                                    <Ionicons name="close-circle" size={16} color={theme.colors.primaryForeground} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};
