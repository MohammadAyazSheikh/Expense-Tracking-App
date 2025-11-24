import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';

const ToastConfig = {
    success: (props: any) => {
        const { theme } = useUnistyles();
        return (
            <View style={[styles.container, { borderLeftColor: theme.colors.success }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.text1}</Text>
                    {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
                </View>
            </View>
        );
    },
    error: (props: any) => {
        const { theme } = useUnistyles();
        return (
            <View style={[styles.container, { borderLeftColor: theme.colors.destructive }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="alert-circle" size={24} color={theme.colors.destructive} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.text1}</Text>
                    {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
                </View>
            </View>
        );
    },
    info: (props: any) => {
        const { theme } = useUnistyles();
        return (
            <View style={[styles.container, { borderLeftColor: theme.colors.primary }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.text1}</Text>
                    {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
                </View>
            </View>
        );
    },
    warning: (props: any) => {
        const { theme } = useUnistyles();
        return (
            <View style={[styles.container, { borderLeftColor: theme.colors.warning }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="warning" size={24} color={theme.colors.warning} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.text1}</Text>
                    {props.text2 && <Text style={styles.message}>{props.text2}</Text>}
                </View>
            </View>
        );
    },
};

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

export default ToastConfig;
