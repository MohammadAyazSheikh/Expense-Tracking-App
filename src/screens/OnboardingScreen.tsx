import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
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

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'trending-up',
    title: "Track Every Expense",
    description: "Effortlessly monitor your daily spending across all categories with intuitive tracking",
    color: "success"
  },
  {
    id: '2',
    icon: 'pie-chart',
    title: "Smart Budgeting",
    description: "Set intelligent budgets and get real-time alerts when you're close to limits",
    color: "accent"
  },
  {
    id: '3',
    icon: 'credit-card',
    title: "Manage Multiple Wallets",
    description: "Handle cash, cards, and digital wallets all in one place with easy transfers",
    color: "warning"
  },
  {
    id: '4',
    icon: 'zap',
    title: "AI-Powered Insights",
    description: "Meet SmartSense™ - your personal AI financial assistant that helps you save smarter",
    color: "primary"
  }
] as const;

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
    width,
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

const AnimatedSlide = ({ item, theme }: { item: typeof slides[number], theme: any }) => {
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
        <Text variant="h2" style={styles.title}>{item.title}</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <Text variant="body" style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

export const OnboardingScreen = () => {
  const { theme } = useUnistyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
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
        <Button title="Skip" variant="ghost" onPress={handleSkip} />
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
          <AnimatedSlide item={item} theme={theme} />
        )}
      />

      <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <AnimatedDot key={index} isActive={index === currentIndex} />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          size="lg"
        />
      </Animated.View>
    </ScreenWrapper>
  );
};
