import React, { } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

export const ProfileScreen = () => {



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
          <Text variant="h2" style={styles.headerTitle}>Profile Settings</Text>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Personal Information */}
        <Card>
          <Text variant="h3" style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.formGroup}>
            <Input
              label="Full Name"
              defaultValue="Alex Johnson"
            />
            <Input
              label="Email Address"
              defaultValue="alex.johnson@email.com"
              keyboardType="email-address"
            />
            <Input
              label="Phone Number"
              defaultValue="+1 234 567 8900"
              keyboardType="phone-pad"
            />
            <Input
              label="Date of Birth"
              defaultValue="1990-01-15"
            />
          </View>
        </Card>

        {/* Preferences */}
        <Card>
          <Text variant="h3" style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.formGroup}>
            <Input
              label="Default Currency"
              defaultValue="USD ($)"
            />
            <Input
              label="Language"
              defaultValue="English"
            />
            <Input
              label="Timezone"
              defaultValue="America/New_York (EST)"
            />
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            icon={<Feather name="save" size={20} color="white" />}
            size="lg"
            onPress={() => { }}
          />
          <Button
            title="Export Profile Data"
            variant="outline"
            size="lg"
            onPress={() => { }}
          />
        </View>
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
    paddingBottom: theme.paddings.xl * 1.5,
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
  avatarContainer: {
    alignItems: 'center',
    marginTop: -theme.margins.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  sectionTitle: {
    marginBottom: theme.margins.md,
  },
  formGroup: {
    gap: theme.margins.md,
  },
  actions: {
    gap: theme.margins.md,
    marginTop: theme.margins.md,
    marginBottom: theme.margins.xl,
  }
}));