import React from 'react';
import { View, } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

export const SecurityScreen = () => {


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
          <Text variant="h2" style={styles.headerTitle}>Security</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Card>
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text weight="500">Biometric Login</Text>
              <Text variant="caption">Use FaceID or TouchID to log in</Text>
            </View>
            <Switch value={true} onValueChange={() => { }} />
          </View>
          <View style={styles.separator} />
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text weight="500">Two-Factor Authentication</Text>
              <Text variant="caption">Add an extra layer of security</Text>
            </View>
            <Switch value={false} onValueChange={() => { }} />
          </View>
        </Card>

        <Button
          title="Change Password"
          variant="outline"
          size="lg"
          onPress={() => { }}
        />
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.paddings.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: theme.margins.md,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.margins.xs,
  }
}));
