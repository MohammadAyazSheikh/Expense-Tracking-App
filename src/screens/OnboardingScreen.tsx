import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StyleSheet, useUnistyles, UnistylesRuntime } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: theme.paddings.md,
  },
  slide: {
    width: UnistylesRuntime.screen.width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.paddings.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margins.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.margins.md,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.mutedForeground,
    paddingHorizontal: theme.paddings.lg,
  },
  footer: {
    padding: theme.paddings.lg,
    gap: theme.margins.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.margins.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.muted,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
}));

const AnimatedDot = ({ isActive }: { isActive: boolean }) => {
  const width = useSharedValue(isActive ? 32 : 8);

  useEffect(() => {
    width.value = withTiming(isActive ? 32 : 8, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        isActive && styles.activeDot,
        animatedStyle,
      ]}
    />
  );
};

const AnimatedSlide = ({ item, theme, t }: { item: { id: string; icon: string; title: string; description: string; color: string }, theme: any, t: (key: any) => string }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <Feather
          name={item.icon as any}
          size={80}
          color={theme.colors[item.color as keyof typeof theme.colors] as string}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <Text variant="h2" style={styles.title}>{t(item.title)}</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <Text variant="body" style={styles.description}>{t(item.description)}</Text>
      </Animated.View>
    </View>
  );
};

export const OnboardingScreen = () => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = [
    {
      id: '1',
      icon: 'trending-up',
      title: 'onboarding.title1' as const,
      description: 'onboarding.description1' as const,
      color: "success"
    },
    {
      id: '2',
      icon: 'pie-chart',
      title: 'onboarding.title2' as const,
      description: 'onboarding.description2' as const,
      color: "accent"
    },
    {
      id: '3',
      icon: 'credit-card',
      title: 'onboarding.title3' as const,
      description: 'onboarding.description3' as const,
      color: "warning"
    },
    {
      id: '4',
      icon: 'zap',
      title: 'onboarding.title4' as const,
      description: 'onboarding.description4' as const,
      color: "primary"
    }
  ] as const;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / UnistylesRuntime.screen.width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
        <Button title={t('onboarding.skip')} variant="ghost" onPress={handleSkip} />
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimatedSlide item={item} theme={theme} t={t} />
        )}
      />

      <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <AnimatedDot key={index} isActive={index === currentIndex} />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          onPress={handleNext}
          size="lg"
        />
      </Animated.View>
    </ScreenWrapper>
  );
};
