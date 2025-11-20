import { StatusBar } from "expo-status-bar";
import { Animated, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function App() {
  return (
    <View style={styles.container}>
      <Animated.Text>
        Open up App.tsx to start working on your app!
      </Animated.Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
