// components/AnimatedPaginationDots.jsx
import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { usePathname } from 'expo-router';

export default function PaginationDots() {
  const pathname = usePathname();
  const routes = [
  "/onboarding/startup",
  "/onboarding/currency",
  "/onboarding/balance",
  "/onboarding/month",
  "/onboarding/allocation"
];

  const currentIndex = routes.findIndex((route) => pathname.startsWith(route));

  return (
    <View className="flex-row justify-center items-center mt-8">
      {routes.map((_, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            width: withTiming(currentIndex === i ? 16 : 8, { duration: 200 }),
            height: 8,
            backgroundColor: withTiming(currentIndex === i ? 'white' : 'rgba(255,255,255,0.3)', { duration: 200 }),
            borderRadius: 4,
            marginHorizontal: 4,
          };
        });

        return <Animated.View key={i} style={animatedStyle} />;
      })}
    </View>
  );
}
