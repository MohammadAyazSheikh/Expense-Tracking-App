import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../store';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../ui/Text';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters: FilterState;
}

export interface FilterState {
    type: 'all' | 'income' | 'expense';
    categories: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initialFilters }) => {
    const { theme } = useUnistyles();
    const { t } = useTranslation();
    const { categories } = useFinanceStore();
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    const handleTypeSelect = (type: FilterState['type']) => {
        setFilters(prev => ({ ...prev, type }));
    };

    const handleCategoryToggle = (categoryId: string) => {
        setFilters(prev => {
            const isSelected = prev.categories.includes(categoryId);
            if (isSelected) {
                return { ...prev, categories: prev.categories.filter(id => id !== categoryId) };
            } else {
                return { ...prev, categories: [...prev.categories, categoryId] };
            }
        });
    };

    const handleReset = () => {
        setFilters({ type: 'all', categories: [] });
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelButton}>{t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{t('filter.title')}</Text>
                    <TouchableOpacity onPress={handleReset}>
                        <Text style={styles.resetButton}>{t('common.reset')}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>{t('filter.transactionType')}</Text>
                    <View style={styles.typeContainer}>
                        {(['all', 'income', 'expense'] as const).map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeButton,
                                    filters.type === type && styles.typeButtonActive
                                ]}
                                onPress={() => handleTypeSelect(type)}
                            >
                                <Text style={[
                                    styles.typeText,
                                    filters.type === type && styles.typeTextActive
                                ]}>
                                    {t(`transactions.${type === 'expense' ? 'expenses' : type}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>{t('categoryManager.title')}</Text>
                    <View style={styles.categoriesContainer}>
                        {categories.map(category => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    filters.categories.includes(category.id) && styles.categoryButtonActive
                                ]}
                                onPress={() => handleCategoryToggle(category.id)}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                                    <Ionicons name={category.icon as any} size={16} color="white" />
                                </View>
                                <Text style={[
                                    styles.categoryText,
                                    filters.categories.includes(category.id) && styles.categoryTextActive
                                ]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>{t('filter.applyFilters')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
        color: theme.colors.mutedForeground,
        fontSize: theme.fontSize.md,
    },
    resetButton: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.md,
    },
    content: {
        padding: theme.paddings.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        color: theme.colors.foreground,
        marginTop: theme.margins.lg,
        marginBottom: theme.margins.md,
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.md,
        padding: 4,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: theme.radius.sm,
    },
    typeButtonActive: {
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    typeText: {
        color: theme.colors.mutedForeground,
        fontWeight: '500',
    },
    typeTextActive: {
        color: theme.colors.foreground,
        fontWeight: '600',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: 6,
    },
    categoryButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '15',
    },
    categoryIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: theme.colors.foreground,
        fontSize: theme.fontSize.sm,
    },
    categoryTextActive: {
        color: theme.colors.primary,
        fontWeight: '500',
    },
    footer: {
        padding: theme.paddings.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    applyButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.paddings.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
    },
    applyButtonText: {
        color: theme.colors.primaryForeground,
        fontWeight: 'bold',
        fontSize: theme.fontSize.md,
    },
}));
