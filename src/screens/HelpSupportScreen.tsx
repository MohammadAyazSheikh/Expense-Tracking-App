import React from 'react';
import { View, } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

export const HelpSupportScreen = () => {

  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();



  return (
    <ScreenWrapper style={styles.container} scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Button
            title=""
            icon={<Feather name="arrow-left" size={24} color="white" />}
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 0, width: 40 }}
          />
          <Text variant="h2" style={styles.headerTitle}>Help & Support</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text variant="h3">Contact Us</Text>
          <View style={styles.contactItem}>
            <Feather name="mail" size={20} color={theme.colors.primary} />
            <Text>support@hisaabbee.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Feather name="phone" size={20} color={theme.colors.primary} />
            <Text>+1 (800) 123-4567</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="h3">FAQ</Text>
          <Button
            title="How to add an expense?"
            variant="ghost"
            style={{ alignItems: 'flex-start', paddingHorizontal: 0 }}
            onPress={() => { }}
          />
          <Button
            title="How to connect a bank account?"
            variant="ghost"
            style={{ alignItems: 'flex-start', paddingHorizontal: 0 }}
            onPress={() => { }}
          />
          <Button
            title="Is my data secure?"
            variant="ghost"
            style={{ alignItems: 'flex-start', paddingHorizontal: 0 }}
            onPress={() => { }}
          />
        </Card>
      </View>
    </ScreenWrapper>
  );
};


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.paddings.lg,
    paddingBottom: theme.paddings.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    marginBottom: theme.margins.lg,
  },
  headerTitle: {
    color: 'white',
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  card: {
    gap: theme.margins.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
  }
}));