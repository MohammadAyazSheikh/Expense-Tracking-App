import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../store';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout
} from 'react-native-reanimated';


export const AuthScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { login, register, isLoading, error } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (activeTab === 'login') {
        await login(data.email, data.password);
      } else {
        await register(data.email, data.password, data.name);
      }
      navigation.replace('MainTab', { screen: 'Dashboard' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenWrapper style={styles.container} scrollable>
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
        <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.logoContainer}>
          <Feather name="credit-card" size={32} color="white" />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(400).duration(600)}>
          <Text variant="h2">HisaabBee</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(500).duration(600)}>
          <Text variant="caption">Manage your finances smartly</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600)}>
        <Card>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text weight={activeTab === 'login' ? '600' : 'normal'}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
              onPress={() => setActiveTab('signup')}
            >
              <Text weight={activeTab === 'signup' ? '600' : 'normal'}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <Animated.View layout={Layout.springify()} style={styles.form}>
            {error && (
              <Animated.View entering={FadeIn.duration(300)}>
                <Text style={{ color: theme.colors.destructive, textAlign: 'center' }}>{error}</Text>
              </Animated.View>
            )}

            {activeTab === 'signup' && (
              <Animated.View entering={FadeInDown.duration(400)} exiting={FadeInDown.duration(200)}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message as string}
                    />
                  )}
                />
              </Animated.View>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message as string}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message as string}
                />
              )}
            />

            {activeTab === 'login' && (
              <Button
                title="Forgot password?"
                variant="ghost"
                size="sm"
                onPress={() => { }}
                style={{ alignSelf: 'flex-end', paddingHorizontal: 0 }}
              />
            )}

            <Button
              title={activeTab === 'login' ? "Login" : "Sign Up"}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
            />
          </Animated.View>

          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text variant="caption">Or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialGrid}>
              <Button
                title="Google"
                variant="outline"
                style={styles.socialButton}
                onPress={() => { }}
              />
              <Button
                title="Apple"
                variant="outline"
                style={styles.socialButton}
                onPress={() => { }}
              />
            </View>
          </View>
        </Card>
      </Animated.View>

      <View style={styles.footer}>
        <Text variant="caption" align="center">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </ScreenWrapper >
  );
};


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.margins.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margins.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.muted,
    padding: 4,
    borderRadius: theme.radius.md,
    marginBottom: theme.margins.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.paddings.sm,
    alignItems: 'center',
    borderRadius: theme.radius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  form: {
    gap: theme.margins.md,
  },
  socialSection: {
    marginTop: theme.margins.xl,
    gap: theme.margins.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: theme.margins.md,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    marginTop: theme.margins.lg,
    alignItems: 'center',
  }
}));
