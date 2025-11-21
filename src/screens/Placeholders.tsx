import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.foreground,
    fontSize: theme.fontSize.lg,
  }
}));

const PlaceholderScreen = ({ name }: { name: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen</Text>
    </View>
  );
};


export const NotFoundScreen = () => <PlaceholderScreen name="Not Found" />;
