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
        variants: {
            variant: {
                default: {},
                destructive: {
                    color: theme.colors.destructive
                },
                cancel: {
                    fontWeight: 'normal'
                }
            }
        }
    },
}));

const AlertButtonComponent = ({
    btn,
    index,
    totalButtons,
    onPress
}: {
    btn: AlertButton,
    index: number,
    totalButtons: number,
    onPress: () => void
}) => {
    styles.useVariants({
        variant: btn.style || 'default'
    });

    const isVertical = totalButtons > 2;
    const hasBorderTop = index > 0 && isVertical;
    const hasBorderLeft = index > 0 && !isVertical;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                hasBorderTop && styles.buttonBorderTop,
                hasBorderLeft && styles.buttonBorderLeft,
                isVertical ? { width: '100%', borderLeftWidth: 0, borderTopWidth: index === 0 ? 0 : 0.5 } : {}
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>
                {btn.text}
            </Text>
        </TouchableOpacity>
    );
};

export const CustomAlert = () => {
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
                                    <AlertButtonComponent
                                        key={index}
                                        btn={btn}
                                        index={index}
                                        totalButtons={buttons.length}
                                        onPress={() => handleButtonPress(btn)}
                                    />
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
