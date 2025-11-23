import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

const faqCategories = [
  {
    title: 'Getting Started',
    icon: 'book',
    questions: [
      'How do I add my first expense?',
      'Setting up multiple wallets',
      'Understanding budget categories'
    ]
  },
  {
    title: 'SmartSense™ AI',
    icon: 'help-circle',
    questions: [
      'How does AI predict spending?',
      'Understanding savings suggestions',
      'Enabling AI insights'
    ]
  },
  {
    title: 'Account & Security',
    icon: 'shield',
    questions: [
      'Changing my password',
      'Setting up 2FA',
      'Managing devices'
    ]
  }
];

const contactOptions = [
  {
    icon: 'message-circle',
    title: 'Live Chat',
    description: 'Chat with our support team',
    badge: 'Average response: 5 min',
    color: 'primary'
  },
  {
    icon: 'mail',
    title: 'Email Support',
    description: 'support@expensetrack.com',
    badge: 'Response within 24h',
    color: 'accent'
  },
  {
    icon: 'phone',
    title: 'Phone Support',
    description: '+1 (800) 123-4567',
    badge: 'Mon-Fri, 9AM-6PM EST',
    color: 'success'
  }
];

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

        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
          <Input
            placeholder="Search for help..."
            style={styles.searchInput}
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
            <Button
              title="Video Tutorials"
              icon={<Feather name="video" size={16} color={theme.colors.foreground} />}
              variant="outline"
              size="sm"
              onPress={() => { }}
              style={styles.quickActionButton}
            />
            <Button
              title="User Guide"
              icon={<Feather name="book" size={16} color={theme.colors.foreground} />}
              variant="outline"
              size="sm"
              onPress={() => { }}
              style={styles.quickActionButton}
            />
            <Button
              title="Community"
              icon={<Feather name="external-link" size={16} color={theme.colors.foreground} />}
              variant="outline"
              size="sm"
              onPress={() => { }}
              style={styles.quickActionButton}
            />
          </ScrollView>
        </Card>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <TouchableOpacity key={option.title}>
                <Card style={styles.contactCard}>
                  <View style={styles.contactCardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.colors.muted }]}>
                      <Feather name={option.icon as any} size={24} color={theme.colors[option.color as keyof typeof theme.colors] as string} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text weight="semiBold">{option.title}</Text>
                      <Text variant="caption" style={styles.contactDescription} numberOfLines={1}>
                        {option.description}
                      </Text>
                      <Badge variant="secondary" style={styles.contactBadge}>
                        {option.badge}
                      </Badge>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.colors.mutedForeground} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Frequently Asked</Text>
          <View style={styles.faqCategories}>
            {faqCategories.map((category) => (
              <Card key={category.title} style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <View style={styles.faqIconCircle}>
                    <Feather name={category.icon as any} size={20} color={theme.colors.primary} />
                  </View>
                  <Text variant="h3">{category.title}</Text>
                </View>
                <View style={styles.faqQuestions}>
                  {category.questions.map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.faqQuestion}
                    >
                      <Text style={styles.faqQuestionText}>{question}</Text>
                      <Feather name="chevron-right" size={16} color={theme.colors.mutedForeground} />
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* App Info */}
        <Card style={styles.appInfoCard}>
          <Text variant="caption" style={styles.appVersion}>ExpenseTrack v2.1.0</Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
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
  searchContainer: {
    position: 'relative',
    marginTop: theme.margins.sm,
  },
  searchIcon: {
    position: 'absolute',
    left: theme.paddings.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 0,
    paddingLeft: theme.paddings.xl + theme.paddings.md,
    color: 'white',
  },
  content: {
    padding: theme.paddings.md,
    marginTop: -theme.margins.lg,
    gap: theme.margins.md,
  },
  quickActionsCard: {
    padding: theme.paddings.md,
  },
  quickActions: {
    gap: theme.margins.sm,
    paddingVertical: theme.paddings.xs,
  },
  quickActionButton: {
    flexShrink: 0,
  },
  section: {
    gap: theme.margins.md,
  },
  sectionTitle: {
    paddingHorizontal: theme.paddings.xs,
    marginBottom: theme.margins.xs,
  },
  contactOptions: {
    gap: theme.margins.md,
  },
  contactCard: {
    padding: theme.paddings.md,
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactInfo: {
    flex: 1,
    gap: theme.margins.xs,
  },
  contactDescription: {
    color: theme.colors.mutedForeground,
  },
  contactBadge: {
    marginTop: theme.margins.xs,
  },
  faqCategories: {
    gap: theme.margins.md,
  },
  faqCard: {
    padding: theme.paddings.lg,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
    marginBottom: theme.margins.md,
  },
  faqIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestions: {
    gap: theme.margins.xs,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.paddings.md,
    borderRadius: theme.radius.md,
    backgroundColor: 'transparent',
  },
  faqQuestionText: {
    fontSize: theme.fontSize.sm,
    flex: 1,
    marginRight: theme.margins.sm,
  },
  appInfoCard: {
    padding: theme.paddings.lg,
    alignItems: 'center',
    marginTop: theme.margins.md,
  },
  appVersion: {
    color: theme.colors.mutedForeground,
    marginBottom: theme.margins.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margins.md,
  },
  legalLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
  },
  legalSeparator: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.sm,
  },
}));