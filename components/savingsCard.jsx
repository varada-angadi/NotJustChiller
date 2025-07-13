import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function SavingsCard({ saved, goal }) {
  const percent = Math.min(saved / goal, 1);
  const displayPercent = Math.round(percent * 100);
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent);

  function getSavingsMessage(percent) {
  if (percent <= 25) return 'Every rupee counts';
  if (percent <= 50) return 'Halfway there! Keep saving';
  if (percent <= 75) return "You're crushing it ";
  if (percent < 100) return 'So close! Don’t stop now ';
  return 'Goal achieved!!! Time to flex ';
}


  return (
    <View className="flex-row justify-between items-center" style={{ maxWidth: width * 0.55 }}>

        <View>
            <Text style={{fontSize:25, fontFamily:"Oxanium_400Regular",fontWeight: 'bold', textAlign:"center"}}>Saving for: Trip to Goa</Text>
          <Text style={{fontSize: 18,fontFamily: 'Oxanium_400Regular',color: '#1C2C21',textAlign:"center",marginTop:5}}>{`₹${saved} / ₹${goal}`}</Text>
          <Text style={{fontSize: 18,fontFamily: 'Oxanium_400Regular',color: '#1C2C21',textAlign:"center",marginTop:5}}>{getSavingsMessage(displayPercent)}
          </Text>
        </View>

        <View style={{ width: size, height: size, position: 'relative', marginLeft:30}}>
          <Svg width={size} height={size}>
            <Circle
              stroke="#ccc"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke="#8DA563"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>

          {/* Center Percentage */}
          <View style={styles.centerText}>
            <Text style={styles.percentText}>{displayPercent}%</Text>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({

  centerText: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  percentText: {
    fontSize: 20,
    color: '#1C2C21',
    fontFamily: 'Oxanium_800ExtraBold',
  },
});
