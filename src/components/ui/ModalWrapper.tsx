import React from "react";
import {
  Modal,
  View,
  ModalProps,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type modalProps = {
  children: React.ReactNode;
  showBackDrop?: boolean;
  backDropStyles?: ViewStyle;
  containerStyles?: ViewStyle;
  onBackdropPress?: () => void;
} & ModalProps;

const ModalWrapper = ({
  children,
  showBackDrop = true,
  backDropStyles = {},
  containerStyles,
  onBackdropPress,
  ...rest
}: modalProps) => {
  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      {/* backdrop */}
      {showBackDrop && (
        <TouchableOpacity
          disabled={!onBackdropPress}
          activeOpacity={0.9}
          onPress={onBackdropPress}
          style={[
            {
              backgroundColor: "rgba(0,0,0,0.8)",
              ...StyleSheet.absoluteFillObject,
            },
            backDropStyles,
          ]}
        ></TouchableOpacity>
      )}
      <View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          containerStyles,
        ]}
      >
        {/* children */}
        {children}
      </View>
    </Modal>
  );
};

export default ModalWrapper;
