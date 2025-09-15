// ExpenseLineChart.jsx
import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useFinance } from '../context/balanceContext';

export default function ExpenseLineChart({ 
  expenseData, 
  selectedYear, 
  selectedMonth, 
  chartTitle 
}) {

  const { currency } = useFinance();
  const symbol = currency?.split(" ")[1] || "";
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handlePointPress = (point) => {
    if (selectedPoint?.x === point.x) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint(point);
      setTimeout(() => setSelectedPoint(null), 3000); // auto-close tooltip
    }
  };

  const width = 350;
  const height = 280;
  const padding = 60;

  const maxAmount = useMemo(() => 
    expenseData.length > 0 ? Math.max(...expenseData.map(d => d.amount)) : 0, 
    [expenseData]
  );

  const ySteps = 5;

  const points = useMemo(() => {
    if (expenseData.length === 0) return [];
    return expenseData.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / Math.max(1, expenseData.length - 1);
      const y = maxAmount === 0 ? height - padding : 
                height - padding - (d.amount / maxAmount) * (height - 2 * padding);
      return { ...d, x, y };
    });
  }, [expenseData, maxAmount]);

  const path = useMemo(() => 
    points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' '),
    [points]
  );

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${path} L ${lastPoint.x} ${height - padding} L ${firstPoint.x} ${height - padding} Z`;
  }, [path, points]);

  const yLabels = useMemo(() => 
    Array.from({ length: ySteps + 1 }, (_, i) =>
      Math.round((maxAmount * (ySteps - i)) / ySteps)
    ), [maxAmount, ySteps]
  );

  // Expense color scheme (different from income)
  const colors = useMemo(() => {
    const colorSchemes = {
      'Last 6M': {
        line: '#E74C3C',
        gradient1: '#E74C3C',
        gradient2: 'rgba(231, 76, 60, 0.1)',
        points: '#E74C3C'
      },
      'Entire Year': {
        line: '#F39C12',
        gradient1: '#F39C12',
        gradient2: 'rgba(243, 156, 18, 0.1)',
        points: '#F39C12'
      },
      'All Time': {
        line: '#C0392B',
        gradient1: '#C0392B',
        gradient2: 'rgba(192, 57, 43, 0.1)',
        points: '#C0392B'
      }
    };

    return colorSchemes[selectedMonth] || {
      line: '#8DA563',
      gradient1: '#8DA563',
      gradient2: 'rgba(141, 165, 99, 0.1)',
      points: '#8DA563'
    };
  }, [selectedMonth]);

  const formatTooltipValue = (point) => {
    const getDateLabel = () => {
      switch (selectedMonth) {
        case 'All Time':
          return point.date;
        case 'Entire Year':
        case 'Last 6M':
          return `${point.date} ${selectedYear}`;
        default:
          return `${selectedMonth} ${selectedYear} - ${point.date}`;
      }
    };
    return {
      amount: `${symbol}${point.amount.toLocaleString()}`,
      period: getDateLabel()
    };
  };

  const formatYAxisValue = (value) => {
    if (value === 0) return `${symbol}0`;
    if (value >= 100000) return `${symbol}${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
    return `${symbol}${value}`;
  };

  const statistics = useMemo(() => {
    if (expenseData.length === 0) return { highest: 0, average: 0, lowest: 0 };
    const amounts = expenseData.map(d => d.amount);
    return {
      highest: Math.max(...amounts),
      average: Math.round(amounts.reduce((sum, a) => sum + a, 0) / amounts.length),
      lowest: Math.min(...amounts)
    };
  }, [expenseData]);

  if (expenseData.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 40 }}>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'Oxanium_400Regular', 
          color: '#666',
          textAlign: 'center'
        }}>
          No expense data available for the selected period
        </Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Chart Title */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontFamily: 'Oxanium_400Regular', fontWeight: '600', color: '#333', textAlign: 'center' }}>
          {chartTitle}
        </Text>
        <Text style={{ fontSize: 16, fontFamily: 'Oxanium_400Regular', color: '#666', textAlign: 'center', marginVertical: 8 }}>
          {selectedMonth === 'All Time' ? 'All Years' : `${selectedYear} Financial Overview`}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: 'Oxanium_400Regular', color: '#000', textAlign: 'center' }}>
          Tap points for details
        </Text>
      </View>

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.gradient1} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.gradient2} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Y-Axis */}
        {yLabels.map((val, i) => {
          const y = padding + (i * (height - 2 * padding)) / ySteps;
          return (
            <G key={`y-${i}`}>
              <Line x1={padding} y1={y} x2={width - padding} y2={y}
                stroke={i === ySteps ? "#ccc" : "#f0f0f0"}
                strokeWidth={i === ySteps ? 1 : 0.8}
                strokeDasharray={i === ySteps ? "0" : "2,2"} />
              <SvgText x={padding - 10} y={y + 4} fontSize="16" fill="#666" textAnchor="end" fontFamily="Oxanium_400Regular">
                {formatYAxisValue(val)}
              </SvgText>
            </G>
          );
        })}

        {/* X-Axis */}
        {points.map((p, i) => (
          <SvgText key={`x-${i}`} x={p.x} y={height - padding + 20} fontSize="14" fill="#666" textAnchor="middle" fontFamily="Oxanium_400Regular">
            {p.date}
          </SvgText>
        ))}

        {/* Area + Line */}
        {areaPath && <Path d={areaPath} fill="url(#areaGradient)" />}
        {path && <Path d={path} stroke={colors.line} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Points */}
        {points.map((p, i) => (
          <G key={i}>
            <Circle cx={p.x} cy={p.y} r={20} fill="transparent" onPressIn={() => handlePointPress(p)} />
            <Circle cx={p.x} cy={p.y} r={6} fill={colors.points} stroke="white" strokeWidth={2} />
            {selectedPoint && selectedPoint.x === p.x && (
              <>
                <Circle cx={p.x} cy={p.y} r={10} fill="none" stroke={colors.points} strokeWidth={2} opacity={0.3} />
                <Circle cx={p.x} cy={p.y} r={8} fill={colors.points} stroke="white" strokeWidth={3} />
              </>
            )}
          </G>
        ))}
      </Svg>

      {/* Stats */}
      <View style={{ marginTop: 5, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 12, width: '95%', borderLeftWidth: 4, borderLeftColor: colors.line }}>
        <Text style={{ fontSize: 18, fontFamily: 'Oxanium_400Regular', color: '#666', fontWeight: '500', marginBottom: 8 }}>Expense Stats</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View><Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>Highest</Text>
            <Text style={{ fontSize: 16, color: '#d32f2f', fontWeight: '600' }}>{symbol}{statistics.highest.toLocaleString()}</Text></View>
          <View><Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>Average</Text>
            <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: '600' }}>{symbol}{statistics.average.toLocaleString()}</Text></View>
          <View><Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>Lowest</Text>
            <Text style={{ fontSize: 16, color: '#2e7d32', fontWeight: '600' }}>{symbol}{statistics.lowest.toLocaleString()}</Text></View>
        </View>
      </View>
    </View>
  );
}
