import React from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const COLORS = [
  "hsl(0, 75%, 60%)", // Red
  "hsl(10, 80%, 65%)", // Coral
  "hsl(25, 85%, 60%)", // Orange
  "hsl(35, 90%, 60%)", // Amber
  "hsl(45, 90%, 50%)", // Yellow
  "hsl(145, 70%, 55%)", // Green
  "hsl(160, 70%, 60%)", // Teal
  "hsl(190, 80%, 55%)", // Cyan
  "hsl(200, 70%, 60%)", // Sky
  "hsl(220, 75%, 55%)", // Blue
  "hsl(255, 70%, 65%)", // Purple
  "hsl(280, 65%, 60%)", // Violet
  "hsl(320, 70%, 60%)", // Pink
  "hsl(340, 70%, 60%)", // Rose
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onChange(color)}
          style={[
            styles.colorButton,
            { backgroundColor: color },
            value === color && styles.selectedColor,
          ]}
        >
          {value === color && <View style={styles.checkmark} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.margins.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: theme.colors.foreground,
    borderWidth: 3,
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
}));

export default ColorPicker;
