import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [250, 450, 300, 200, 500, 100, 50],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#1C2C21',
  backgroundGradientTo: '#1C2C21',
  decimalPlaces: 0,
  barPercentage: 0.6,
  color: (opacity = 0) => `rgba(141, 165, 100, ${opacity})`, // bar color
  labelColor: () => '#ffffff',
  style: {
    borderRadius: 16,
    padding:40,
  },
  propsForLabels: {
    fontFamily: 'Oxanium_400Regular',
  },
};

export default function WeeklyBarChart() {
  return (
    <View style={{marginTop: 5, alignItems: 'center',}}>
      <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Oxanium_400Regular', marginLeft: 16 }}>
        Weekly Expenses
      </Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="₹"
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={{ borderRadius: 16,}}
      />
    </View>
  );
}
