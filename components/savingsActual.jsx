import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useFonts, Oxanium_800ExtraBold, Oxanium_400Regular } from '@expo-google-fonts/oxanium';

const BudgetBarChart = ({ data }) => {
    const chartWidth = Dimensions.get('screen').width / 2 - 20;
  const barHeight = 15;
  const barSpacing = 60;
  const topOffset = 20;

  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular,
    });


  const maxValue = Math.max(...data.map(item => Math.max(item.budget, item.actual)));

  const getStatus = (percent) => {
    if (percent <= 80) return { label: 'Safe', icon: '✅', color: '#1C2C21' };
    if (percent <= 100) return { label: 'Warning', icon: '⚠️', color: '#1C2C21' };
    return { label: 'Over', icon: '❌', color: '#1C2C21' };
  };

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={data.length * barSpacing}>
        {data.map((item, index) => {
          const y = topOffset + index * barSpacing;

          const budgetWidth = chartWidth;
const actualWidth = (item.actual / item.budget) * chartWidth;

          const percent = Math.round((item.actual / item.budget) * 100);
          const status = getStatus(percent);

          return (
            <React.Fragment key={index}>
              {/* Category Label */}
              <SvgText x={0} y={y - 5} fontSize="14" fill="#1C2C21" fontFamily='Oxanium_400Regular'>
                {item.label}
              </SvgText>

              {/* ₹Actual / ₹Budget */}
              <SvgText
                x={0}
                y={y + 10}
                fontSize="14"
                fill="#1C2C21"
              >
                ₹{item.actual} / ₹{item.budget}
              </SvgText>

              {/* % + Status */}
              <SvgText
                x={chartWidth - 10}
                y={y + 10}
                fontSize="14"
                fill={status.color}
                textAnchor="end"
              >
                {`${percent}% ${status.icon}`}
              </SvgText>

              {/* Grey Budget Bar */}
              <Rect
                x={0}
                y={y + 15}
                width={budgetWidth}
                height={barHeight}
                fill="#807F81"
                rx={4}
              />

              {/* Colored Actual Bar */}
              <Rect
                x={0}
                y={y + 15}
                width={actualWidth}
                height={barHeight}
                fill={item.color}
                rx={4}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export default BudgetBarChart;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C2C21',
    marginBottom: 8,
    fontFamily: 'Oxanium_400Regular',
  },
});
