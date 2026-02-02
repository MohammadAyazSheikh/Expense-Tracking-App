import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  AlertButton,
  AlertConfig,
  alertService,
} from "../../utils/alertService";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "./Text";
import Animated from "react-native-reanimated";
import { EnteringAnimation } from "@/utils/animation";

type AlertButtonProps = {
  btn: AlertButton;
  index: number;
  totalButtons: number;
  onPress: () => void;
};

const AlertButtonComponent = ({
  btn,
  index,
  totalButtons,
  onPress,
}: AlertButtonProps) => {
  styles.useVariants({
    variant: btn.style,
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
        isVertical
          ? {
              width: "100%",
              borderLeftWidth: 0,
              borderTopWidth: index === 0 ? 0 : 0.5,
            }
          : {},
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{btn.text}</Text>
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
      alertService.setListener(() => {});
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
    // Add a delay to allow the modal to close properly before triggering the action
    // This prevents issues where the action might trigger another modal (like a loader)
    // causing conflicts or UI freezes.
    setTimeout(() => {
      btn.onPress?.();
    }, 500);
  };

  if (!config) return null;

  const buttons = config?.buttons || [{ text: "OK", onPress: () => {} }];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <Animated.View
            entering={EnteringAnimation}
            style={styles.alertContainer}
          >
            <View style={styles.contentContainer}>
              <Text weight="semiBold" style={styles.title}>
                {config?.title}
              </Text>
              {config?.message && (
                <Text style={styles.message}>{config.message}</Text>
              )}
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
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: 270,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  contentContainer: {
    padding: theme.paddings.md,
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.foreground,
    textAlign: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: "600",
    variants: {
      variant: {
        default: {
          color: theme.colors.primary,
        },
        destructive: {
          color: theme.colors.destructive,
        },
        cancel: {
          color: theme.colors.mutedForeground,
        },
      },
    },
  },
}));
