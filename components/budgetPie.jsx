import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Circle, Line, Text as SvgText } from 'react-native-svg';

const DonutChart = ({ data, radius = 60, strokeWidth = 20 }) => {
  const screenWidth = Dimensions.get('screen').width;
  const padding = 60; // extra padding for arrows + labels

  const center = radius + strokeWidth + padding / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;

  const arcs = data.map((item, index) => {
    const value = item.value;
    const angle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const midAngle = (startAngle + endAngle) / 2;

    // Arc coordinates
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // --- Label arrow position ---
    const labelRadius = radius + 30;
    const labelX = center + labelRadius * Math.cos(midAngle);
    const labelY = center + labelRadius * Math.sin(midAngle);

    // Arrow start (on arc edge)
    const arrowStartX = center + radius * Math.cos(midAngle);
    const arrowStartY = center + radius * Math.sin(midAngle);

    const textAnchor = labelX < center ? 'end' : 'start';

    startAngle = endAngle;

    return (
      <G key={index}>
        <Path d={pathData} fill={item.color} />

        {/* Arrow line */}
        <Line
          x1={arrowStartX}
          y1={arrowStartY}
          x2={labelX}
          y2={labelY}
          stroke={item.color}
          strokeWidth={2}
        />

        {/* Label text */}
        <SvgText
          x={labelX}
          y={labelY}
          fontSize="15"
          fill="#1C2C21"
          textAnchor={textAnchor}
          alignmentBaseline="middle"
        >
          {item.label}
        </SvgText>
      </G>
    );
  });

  const svgSize = center * 2;

  return (

    <View style={styles.container}>
      <Svg width={svgSize} height={svgSize}>
        <G>
          {arcs}

          {/* Donut hole */}
          <Circle
            cx={center}
            cy={center}
            r={radius - strokeWidth}
            fill="#ffffff"
          />
        </G>
      </Svg>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});
