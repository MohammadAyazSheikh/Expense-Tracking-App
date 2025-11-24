import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { alertService } from '../../utils/AlertService';
import { Text } from './Text';

type AlertButton = {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
};

type AlertConfig = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: {
        cancelable?: boolean;
        onDismiss?: () => void;
    };
};

export const CustomAlert = () => {
    const { theme } = useUnistyles();
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<AlertConfig | null>(null);

    useEffect(() => {
        alertService.setListener((newConfig) => {
            if (newConfig) {
                setConfig(newConfig);
                setVisible(true);
            } else {
                setVisible(false);
                setConfig(null);
            }
        });

        return () => {
            alertService.setListener(() => { });
        };
    }, []);

    const handleClose = () => {
        if (config?.options?.cancelable) {
            setVisible(false);
            config.options.onDismiss?.();
        }
    };

    const handleButtonPress = (btn: AlertButton) => {
        setVisible(false);
        btn.onPress?.();
    };

    if (!config) return null;

    const buttons = config.buttons || [{ text: 'OK', onPress: () => { } }];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.alertContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>{config.title}</Text>
                                {config.message && <Text style={styles.message}>{config.message}</Text>}
                            </View>

                            <View style={styles.buttonContainer}>
                                {buttons.map((btn, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.button,
                                            index > 0 && config.buttons && config.buttons.length > 2 ? styles.buttonBorderTop : styles.buttonBorderLeft,
                                            // If vertical layout is needed (many buttons), we might need to adjust styles.
                                            // For now, assuming standard 1-2 buttons or vertical stack if > 2.
                                            buttons.length > 2 ? { width: '100%', borderLeftWidth: 0, borderTopWidth: 1 } : {}
                                        ]}
                                        onPress={() => handleButtonPress(btn)}
                                    >
                                        <Text style={[
                                            styles.buttonText,
                                            btn.style === 'destructive' && { color: theme.colors.destructive },
                                            btn.style === 'cancel' && { fontWeight: 'normal' },
                                        ]}>
                                            {btn.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create((theme) => ({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: 270,
        backgroundColor: theme.colors.card,
        borderRadius: 14,
        overflow: 'hidden',
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: theme.colors.foreground,
        textAlign: 'center',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: theme.colors.foreground,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.border,
        flexWrap: 'wrap',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonBorderLeft: {
        borderLeftWidth: 0.5,
        borderLeftColor: theme.colors.border,
    },
    buttonBorderTop: {
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.border,
    },
    buttonText: {
        fontSize: 17,
        color: theme.colors.primary, // Or system blue
        fontWeight: '600',
    },
}));
