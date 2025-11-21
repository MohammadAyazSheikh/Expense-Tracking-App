import React, { useMemo } from 'react';
import { View, ScrollView, StatusBar, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const ScreenWrapper = ({ 
  children, 
  scrollable = false, 
  style,
  contentContainerStyle 
}: ScreenWrapperProps) => {
  const { theme } = useUnistyles();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.paddings.md,
    }
  }), [theme]);

  const Content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      {scrollable ? (
        <ScrollView 
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        Content
      )}
    </SafeAreaView>
  );
};
