import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';

const styles = StyleSheet.create((theme) => ({
    container: {
        width: '90%',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        borderLeftWidth: 6,
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.paddings.md,
        shadowColor: theme.colors.foreground,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginTop: theme.margins.lg,
        variants: {
            type: {
                success: {
                    borderLeftColor: theme.colors.success,
                },
                error: {
                    borderLeftColor: theme.colors.destructive,
                },
                info: {
                    borderLeftColor: theme.colors.primary,
                },
                warning: {
                    borderLeftColor: theme.colors.warning,
                },
            }
        }
    },
    iconContainer: {
        marginRight: theme.margins.md,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: theme.fontSize.md,
        fontWeight: 'bold',
        color: theme.colors.foreground,
        marginBottom: 2,
    },
    message: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.mutedForeground,
    },
}));

const ToastItem = ({ type, text1, text2 }: { type: 'success' | 'error' | 'info' | 'warning', text1: string, text2?: string }) => {
    const { theme } = useUnistyles();

    styles.useVariants({
        type
    });

    const getIcon = () => {
        switch (type) {
            case 'success': return <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />;
            case 'error': return <Ionicons name="alert-circle" size={24} color={theme.colors.destructive} />;
            case 'info': return <Ionicons name="information-circle" size={24} color={theme.colors.primary} />;
            case 'warning': return <Ionicons name="warning" size={24} color={theme.colors.warning} />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {getIcon()}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{text1}</Text>
                {text2 && <Text style={styles.message}>{text2}</Text>}
            </View>
        </View>
    );
};

const ToastConfig = {
    success: (props: any) => <ToastItem type="success" {...props} />,
    error: (props: any) => <ToastItem type="error" {...props} />,
    info: (props: any) => <ToastItem type="info" {...props} />,
    warning: (props: any) => <ToastItem type="warning" {...props} />,
};

export default ToastConfig;
