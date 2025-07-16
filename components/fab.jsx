import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function StickyFAB() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: isOpen ? 0 : 1,
        duration: 250,
        easing: Easing.out(Easing.circle),
        useNativeDriver: false, // needed for opacity, bg
      }),
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 0 : 1,
        duration: 250,
        easing: Easing.out(Easing.circle),
        useNativeDriver: true, // required for rotation
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  // FAB icon rotation
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Background dim
  const backgroundOpacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Action button positions
  const action1Y = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const action2Y = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140],
  });

  const opacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const actions = [
    {
      label: 'Add Income',
      icon: require('../assets/add.png'), // replace with your own
      translateY: action2Y,
      onPress: () => {
        toggleMenu();
        router.push({ pathname: '/addTransaction', params: { defaultTab: 0 } });
      },
    },
    {
      label: 'Add Expense',
      icon: require('../assets/add.png'), // replace with your own
      translateY: action1Y,
      onPress: () => {
        toggleMenu();
        router.push({ pathname: '/addTransaction', params: { defaultTab: 1 } });
      },
    },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Dim Background */}
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'black',
              opacity: backgroundOpacity,
              zIndex: 5,
            },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={toggleMenu} />
        </Animated.View>
      )}

      {/* Action Buttons */}
      {actions.map((action, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            right: 25,
            bottom: 20,
            transform: [{ translateY: action.translateY }],
            opacity,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={action.onPress}
            style={{
              backgroundColor: '#000',
              borderRadius: 30,
              paddingVertical: 8,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View
              style={{
                backgroundColor: '#111',
                borderRadius: 20,
                padding: 5,
              }}
            >
              <Image
                source={action.icon}
                style={{ width: 30, height: 30,}}
              />
            </View>
            <Text style={{ color: '#fff', fontSize: 16 }}>{action.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Main FAB with Rotation */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 25,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ rotate: rotateInterpolate }],
          zIndex: 15,
        }}
      >
        <TouchableOpacity
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={toggleMenu}
        >
          <Image
            source={require('../assets/add.png')} // your white + icon
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
