import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useFinance } from '../context/balanceContext';

export default function IncomeLineChart({ 
  incomeData, 
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
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setSelectedPoint(null);
    }, 3000);
  }
};

  const width = 350;
  const height = 280;
  const padding = 60;

  // Calculate chart metrics
  const maxAmount = useMemo(() => 
    incomeData.length > 0 ? Math.max(...incomeData.map(d => d.amount)) : 0, 
    [incomeData]
  );

  const minAmount = useMemo(() => 
    incomeData.length > 0 ? Math.min(...incomeData.map(d => d.amount)) : 0, 
    [incomeData]
  );

  const ySteps = 5;

  // Generate chart points
  const points = useMemo(() => {
    if (incomeData.length === 0) return [];
    
    return incomeData.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / Math.max(1, incomeData.length - 1);
      const y = maxAmount === 0 ? height - padding : 
                height - padding - (d.amount / maxAmount) * (height - 2 * padding);
      return { ...d, x, y };
    });
  }, [incomeData, maxAmount, width, height, padding]);

  // Generate path for line chart
  const path = useMemo(() => 
    points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' '),
    [points]
  );

  // Generate area path for gradient fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${path} L ${lastPoint.x} ${height - padding} L ${firstPoint.x} ${height - padding} Z`;
  }, [path, points, height, padding]);

  // Generate Y-axis labels
  const yLabels = useMemo(() => 
    Array.from({ length: ySteps + 1 }, (_, i) =>
      Math.round((maxAmount * (ySteps - i)) / ySteps)
    ), [maxAmount, ySteps]
  );

  // Get chart colors based on period
  const colors = useMemo(() => {
    const colorSchemes = {
      'Last 6M': {
        line: '#4A90E2',
        gradient1: '#4A90E2',
        gradient2: 'rgba(74, 144, 226, 0.1)',
        points: '#4A90E2'
      },
      'Entire Year': {
        line: '#66BB6A',
        gradient1: '#66BB6A',
        gradient2: 'rgba(102, 187, 106, 0.1)',
        points: '#66BB6A'
      },
      'All Time': {
        line: '#9C27B0',
        gradient1: '#9C27B0',
        gradient2: 'rgba(156, 39, 176, 0.1)',
        points: '#9C27B0'
      }
    };

    return colorSchemes[selectedMonth] || {
      line: '#8DA563',
      gradient1: '#8DA563',
      gradient2: 'rgba(141, 165, 99, 0.1)',
      points: '#8DA563'
    };
  }, [selectedMonth]);

  // Format tooltip content
  const formatTooltipValue = (point) => {
    const getDateLabel = () => {
      switch (selectedMonth) {
        case 'All Time':
          return point.date;
        case 'Entire Year':
          return `${point.date} ${selectedYear}`;
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

  // Format Y-axis values
  const formatYAxisValue = (value) => {
    if (value === 0) return `${symbol}0` ;
    if (value >= 100000) return `${symbol}${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
    return `${symbol}${value}`;
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    if (incomeData.length === 0) return { highest: 0, average: 0, lowest: 0 };
    
    const amounts = incomeData.map(d => d.amount);
    return {
      highest: Math.max(...amounts),
      average: Math.round(amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length),
      lowest: Math.min(...amounts)
    };
  }, [incomeData]);

  if (incomeData.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 40 }}>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'Oxanium_400Regular', 
          color: '#666',
          textAlign: 'center'
        }}>
          No income data available for the selected period
        </Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Chart Title */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ 
          fontSize: 18, 
          fontFamily: 'Oxanium_400Regular', 
          fontWeight: '600',
          color: '#333',
          textAlign: 'center'
        }}>
          {chartTitle}
        </Text>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'Oxanium_400Regular', 
          color: '#666',
          textAlign: 'center',
          marginVertical: 8
        }}>
          {selectedMonth === 'All Time' ? 'All Years' : `${selectedYear} Financial Overview`}
        </Text>
        <Text style={{ 
            fontSize: 12, 
            fontFamily: 'Oxanium_400Regular',
            color: '#000',
            textAlign:'center',
          }}>Tap points for details</Text>
      </View>

      <Svg width={width} height={height}>
        {/* Gradient Definitions */}
        <Defs>
          <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.gradient1} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.gradient2} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Y-Axis Grid Lines and Labels */}
        {yLabels.map((val, i) => {
          const y = padding + (i * (height - 2 * padding)) / ySteps;
          return (
            <G key={`y-${i}`}>
              <Line 
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y} 
                stroke={i === ySteps ? "#ccc" : "#f0f0f0"}
                strokeWidth={i === ySteps ? 1 : 0.8}
                strokeDasharray={i === ySteps ? "0" : "2,2"}
              />
              <SvgText 
                x={padding - 10} 
                y={y + 4} 
                fontSize="16" 
                fill="#666" 
                textAnchor="end"
                fontFamily="Oxanium_400Regular"
              >
                {formatYAxisValue(val)}
              </SvgText>
            </G>
          );
        })}

        {/* X-Axis Labels */}
        {points.map((p, i) => (
          <SvgText 
            key={`x-${i}`} 
            x={p.x} 
            y={height - padding + 20} 
            fontSize="14" 
            fill="#666" 
            textAnchor="middle"
            fontFamily="Oxanium_400Regular"
          >
            {p.date}
          </SvgText>
        ))}

        {/* Area Fill */}
        {areaPath && (
          <Path 
            d={areaPath} 
            fill="url(#areaGradient)"
          />
        )}

        {/* Line Path */}
        {path && (
          <Path 
            d={path} 
            stroke={colors.line} 
            strokeWidth={3} 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive Circles */}
        {points.map((p, i) => (
          <G key={i}>
            {/* Invisible larger circle for easier touch */}
            <Circle 
              cx={p.x} 
              cy={p.y} 
              r={20} 
              fill="transparent" 
              onPressIn={() => handlePointPress(p)}
            />
            
            {/* Visual circle */}
            <Circle 
              cx={p.x} 
              cy={p.y} 
              r={6} 
              fill={colors.points}
              stroke="white"
              strokeWidth={2}
            />
            
            {/* Highlight selected point */}
            {selectedPoint && selectedPoint.x === p.x && (
              <>
                <Circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={10} 
                  fill="none"
                  stroke={colors.points}
                  strokeWidth={2}
                  opacity={0.3}
                />
                <Circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={8} 
                  fill={colors.points}
                  stroke="white"
                  strokeWidth={3}
                />
              </>
            )}
          </G>
        ))}

        {/* Tooltip */}
        {selectedPoint && (
          <G>
            <View style={{ 
              position: 'absolute', 
              left: selectedPoint.x - 60, 
              top: selectedPoint.y - 80,
              backgroundColor: '#1C2C21',
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.line,
              minWidth: 120,
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'Oxanium_400Regular',
                marginBottom: 2
              }}>
                {formatTooltipValue(selectedPoint).amount}
              </Text>
              <Text style={{
                color: '#ccc',
                fontSize: 11,
                fontFamily: 'Oxanium_400Regular'
              }}>
                {formatTooltipValue(selectedPoint).period}
              </Text>
            </View>
          </G>
        )}</Svg>
      

      {/* Statistics Summary */}
      <View style={{ 
        marginTop: 5, 
        padding: 15, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 12,
        width: '95%',
        borderLeftWidth: 4,
        borderLeftColor: colors.line
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ 
            fontSize: 18, 
            fontFamily: 'Oxanium_400Regular',
            color: '#666',
            fontWeight: '500'
          }}>
            Statistics
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>
              Highest
            </Text>
            <Text style={{ fontSize: 16, color: '#2e7d32', fontWeight: '600', fontFamily: 'Oxanium_400Regular' }}>
              {symbol}{statistics.highest.toLocaleString()}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>
              Average
            </Text>
            <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: '600', fontFamily: 'Oxanium_400Regular' }}>
              {symbol}{statistics.average.toLocaleString()}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, color: '#888', fontFamily: 'Oxanium_400Regular' }}>
              Lowest
            </Text>
            <Text style={{ fontSize: 16, color: '#d32f2f', fontWeight: '600', fontFamily: 'Oxanium_400Regular' }}>
              {symbol}{statistics.lowest.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}