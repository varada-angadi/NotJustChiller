import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export default function IncomeLineChart({ incomeData }) {
  const width = 300;
  const height = 200;
  const padding = 20;

  // Get max amount for scaling
  const maxAmount = Math.max(...incomeData.map(d => d.amount));

  // Map data to points
  const points = incomeData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (incomeData.length - 1);
    const y = height - padding - (d.amount / maxAmount) * (height - 2 * padding);
    return { x, y };
  });

  // Create path string
  const path = points.reduce((acc, point, i) => {
    return i === 0
      ? `M ${point.x} ${point.y}`
      : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={width} height={height}>
        <Path d={path} stroke="#8DA563" strokeWidth={2} fill="none" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#8DA563" />
        ))}
      </Svg>
    </View>
  );
}
