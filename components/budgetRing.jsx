// components/SemiCircleChart.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SemiCircleChart = ({ total, spent }) => {
  const radius = 120;
  const strokeWidth = 25;
  const centerX = radius + strokeWidth;
  const centerY = radius + strokeWidth;
  const progress = Math.min(spent / total, 1); // Cap at 100%
  const sweepAngle = 180 * progress;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, r, startAngle);
    const end = polarToCartesian(x, y, r, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 1, end.x, end.y
    ].join(' ');
  };

  const backgroundArc = describeArc(centerX, centerY, radius, 180, 0); // Left to right
  const progressArc = describeArc(centerX, centerY, radius, 180, 180 + sweepAngle); // Same path

  return (

    <View style={{marginVertical: 20,}}>
        <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 24,color: '#1C2C21',paddingLeft: 5,}}>
                        Expense/Budget
                    </Text>
    
    <View style={styles.container}>
      <Svg width={centerX * 2} height={centerY}>
        {/* Background semi-circle */}
        <Path
          d={backgroundArc}
          stroke="#8DA563"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Foreground progress arc */}
        <Path
          d={progressArc}
          stroke="#1C2C21"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Overlayed text */}
      <View style={styles.textBox}>
        <Text style={styles.amountText}>₹{spent} / ₹{total}</Text>
      </View>
      <Text style={styles.captionText}>
          {Math.round(progress * 100)}% of the budget consumed..{'\n'}
          Survive 18 days with ₹{total - spent}
        </Text>
    </View>
    </View>
  );
};

export default SemiCircleChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

  },
  textBox: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 25,
    color: '#8DA563',
    fontFamily: 'Oxanium_400Regular',
  },
  captionText: {
    marginTop: '2%',
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Oxanium_400Regular',
  },
});
