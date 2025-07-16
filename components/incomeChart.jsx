import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText, Rect, G } from 'react-native-svg';

export default function IncomeLineChart({ incomeData }) {

  const [selectedPoint, setSelectedPoint] = useState(null);
  const width = 350;
  const height = 260;
  const padding = 60;
  const maxAmount = Math.max(...incomeData.map(d => d.amount));
  const ySteps = 4;
  const points = incomeData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (incomeData.length - 1);
    const y = height - padding - (d.amount / maxAmount) * (height - 2 * padding);
    return { ...d, x, y };
  });
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((maxAmount * (ySteps - i)) / ySteps)
  );

  return (

    <View style={{ alignItems: 'center',}}>
      <Svg width={width} height={height}>
        {yLabels.map((val, i) => {const y = padding + (i * (height - 2 * padding)) / ySteps;

          return (
            <G key={`y-${i}`}>
              <Line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#ccc" strokeWidth={0.5} />
              <SvgText x={padding - 20} y={y + 4} fontSize="14" fill="#555" textAnchor="end">
                {`\u20B9\u00A0${val}`}
              </SvgText>
            </G>
          );
        })}

        {/* X-Axis */}
        {points.map((p, i) => (
          <SvgText key={`x-${i}`} x={p.x} y={height - padding + 20} fontSize="14" fill="#555"textAnchor="middle">
            {p.date}
          </SvgText>
        ))}

        {/* Line Path */}
        <Path d={path} stroke="#8DA563" strokeWidth={2.5} fill="none" />

        {/* Interactive Circles */}
        {points.map((p, i) => (
          <G key={i}>
            <Circle cx={p.x} cy={p.y} r={15} fill="transparent" onPressIn={() => { setSelectedPoint(p); }}/>

            <Circle cx={p.x} cy={p.y} r={5} fill="#8DA563"
            />
          </G>
        ))}

        {/* Tooltip */}
        {selectedPoint && (
          <G>
            <Rect
              x={selectedPoint.x - 40} y={selectedPoint.y - 55} width={80} height={40} rx={8} ry={8} fill="#1C2C21" opacity={0.95}/>
            <SvgText x={selectedPoint.x} y={selectedPoint.y - 35} fontSize="14" fill="#fff" textAnchor="middle">
              {`\u20B9\u00A0${selectedPoint.amount}`}
            </SvgText>

            <SvgText x={selectedPoint.x} y={selectedPoint.y - 20} fontSize="12" fill="#ccc" textAnchor="middle">
              {selectedPoint.date}
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
}
