import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';




const MonthlyTrendChart = ({ data }) => {
    const screenWidth = Dimensions.get('screen').width;
  const chartWidth = screenWidth - 40;
  const chartHeight = 220;
  const barWidth = 18;
  const barSpacing = 55;
  const paddingLeft = 50;
  const paddingBottom = 30;
  const chartContentHeight = chartHeight - paddingBottom;
  const budgetColor = '#264730';
  const actualColor = '#FFD400';

  const maxValue = Math.max(...data.map(item => Math.max(item.budget, item.actual)));
  const step = 1000; // adjust based on range
  const ySteps = Math.ceil(maxValue / step);
  const [selected, setSelected] = useState(null);


const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 80;
const PADDING = 10;
const tooltipX = useSharedValue(0);
const tooltipY = useSharedValue(0);
const tooltipVisible = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: tooltipX.value },
    { translateY: tooltipY.value }
  ],
  opacity: withTiming(tooltipVisible.value, { duration: 150 }),
}));


  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
  <View style={styles.legendItem}>
    <View style={[styles.colorBox, { backgroundColor: '#A3D977' }]} />
    <Text style={styles.legendText}>Budget</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.colorBox, { backgroundColor: '#FF8C8C' }]} />
    <Text style={styles.legendText}>Actual</Text>
  </View>
</View>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Y Axis Labels and Grid Lines */}
        {[...Array(ySteps + 1)].map((_, i) => {
          const y = chartContentHeight - (i * (chartContentHeight - 20)) / ySteps;
          return (
            <React.Fragment key={`y-${i}`}>
              <SvgText
                x={5}
                y={y + 4}
                fontSize="14"
                fill="#444"
              >
                ₹{i * step}
              </SvgText>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#E0E0E0"
                strokeWidth={1}
              />
            </React.Fragment>
          );
        })}

        {/* Bars and Month Labels */}
        {data.map((item, index) => {
          const budgetHeight = (item.budget / maxValue) * (chartContentHeight - 20);
          const actualHeight = (item.actual / maxValue) * (chartContentHeight - 20);
          const xBase = paddingLeft + index * barSpacing * 1.5;
          const yBase = chartContentHeight;

          return (
            <React.Fragment key={index}>
              {/* Budget Bar */}
              <Rect
                x={xBase}
                y={yBase - budgetHeight}
                width={barWidth}
                height={budgetHeight}
                fill={budgetColor}
                rx={3}
                onPress={() => {
  setSelected(item);

  // Base coordinates near the bar
  const rawX = xBase + barWidth / 2;
  const y = yBase - Math.max(budgetHeight, actualHeight) - TOOLTIP_HEIGHT;

  // Clamp X to stay within screen
  const clampedX = Math.min(
    Math.max(rawX - TOOLTIP_WIDTH / 2, PADDING),
    screenWidth - TOOLTIP_WIDTH - PADDING
  );

  tooltipX.value = clampedX;
  tooltipY.value = y > 0 ? y : 10; // prevent going off top
  tooltipVisible.value = 1;
}}

              />
              {/* Actual Bar */}
              <Rect
                x={xBase + barWidth + 5}
                y={yBase - actualHeight}
                width={barWidth}
                height={actualHeight}
                fill={actualColor}
                rx={3}
                onPress={() => {
  setSelected(item);

  // Base coordinates near the bar
  const rawX = xBase + barWidth / 2;
  const y = yBase - Math.max(budgetHeight, actualHeight) - TOOLTIP_HEIGHT;

  // Clamp X to stay within screen
  const clampedX = Math.min(
    Math.max(rawX - TOOLTIP_WIDTH / 2, PADDING),
    screenWidth - TOOLTIP_WIDTH - PADDING
  );

  tooltipX.value = clampedX;
  tooltipY.value = y > 0 ? y : 10; // prevent going off top
  tooltipVisible.value = 1;
}}

              />
              {/* Month Label */}
              <SvgText
                x={xBase + barWidth / 2 + 10}
                y={chartHeight - 5}
                paddingBottom ='30'
                fontSize="14"
                fill="#1C2C21"
                textAnchor="middle"
              >
                {item.month}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {selected && (
  <Animated.View style={[styles.tooltip, animatedStyle]}>
    <Text style={styles.tooltipText}>📅 {selected.month}</Text>
    <Text style={styles.tooltipText}>💰 ₹{selected.budget}</Text>
    <Text style={styles.tooltipText}>💸 ₹{selected.actual}</Text>
    <Text style={styles.tooltipText}>
      {selected.actual > selected.budget
        ? 'Over Budget'
        : selected.actual === selected.budget
        ? 'On Budget'
        : 'Under Budget'}
    </Text>
  </Animated.View>
)}

    </View>
  );
};

export default MonthlyTrendChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  legendContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
  gap: 15,
},
tooltip: {
  position: 'absolute',
  backgroundColor: '#FFFFFF',
  padding: 10,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  zIndex: 10,
},
tooltipText: {
  fontSize: 12,
  fontFamily: 'Oxanium_400Regular',
  color: '#1C2C21',
  marginVertical: 1,
},
legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
},
colorBox: {
  width: 12,
  height: 12,
  borderRadius: 2,
  marginRight: 6,
},
legendText: {
  fontSize: 12,
  color: '#1C2C21',
  fontFamily: 'Oxanium_400Regular',
},
});
