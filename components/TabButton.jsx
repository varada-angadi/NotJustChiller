import React, { useEffect, useState, useMemo } from 'react';
import { LayoutChangeEvent, Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';

const TabButton = ({ button, selectedTab, setSelectedTab }) => {
  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  const [dimensions, setDimensions] = useState({ height: 50, width: 205 }); // default
  const buttonWidth = dimensions.width / button.length;
  const tabPositionX = useSharedValue(buttonWidth * selectedTab);
  const [hasMeasured, setHasMeasured] = useState(false);

  const onTabbarLayout = (e) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
    setHasMeasured(true);
  };

  useEffect(() => {
    tabPositionX.value = withTiming(buttonWidth * selectedTab);
  }, [buttonWidth, selectedTab]);

  const handlePress = (index) => {
    setSelectedTab(index);
  };

  const onTabPress = (index) => {
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePress)(index);
    });
  };

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTabbarLayout} style={{
        height: dimensions.height, width: dimensions.width, backgroundColor: '#8DA563',borderRadius: 25,padding: 5,marginHorizontal: 20,overflow: 'hidden',
        marginTop: 20,alignSelf: 'center',alignItems:'center',justifyContent:'center'}}>

      {/* Sliding Indicator */}
      <Animated.View style={[animatedSliderStyle,{position: 'absolute',top: 5, left: 5,backgroundColor: '#1C2C21',borderRadius: 25,height: dimensions.height - 10,width: buttonWidth - 10,zIndex: 0,},]}/>

      <View style={{ flexDirection: 'row', zIndex: 1 }}>

        {button.map((btn, index) => {const animatedTextStyle = useAnimatedStyle(() => 
        {const color = interpolateColor(
              tabPositionX.value,
              [
                buttonWidth * (index - 1),
                buttonWidth * index,
                buttonWidth * (index + 1),
              ],
              ['#1C2C21', '#ffffff', '#1C2C21']
            )
            return { color };
          });

          return (
            <Pressable key={index} onPress={() => onTabPress(index)}
              style={{width: buttonWidth,alignItems: 'center',justifyContent: 'center',height: dimensions.height,paddingVertical: 0,}}>
    
              <Animated.Text style={[{fontFamily:"Oxanium_400Regular",fontSize: 20,fontWeight: '600',paddingVertical: 0,textAlignVertical: 'center',
                lineHeight: dimensions.height,includeFontPadding: false, textAlign: 'center',},animatedTextStyle,]}>
                {btn.title}
              </Animated.Text>

            </Pressable>
          );
        })}

      </View>
    </View>
  );
};

export default TabButton;
