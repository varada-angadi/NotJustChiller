import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useFinance } from '../context/balanceContext';
import { Text as SvgText } from 'react-native-svg';


const chartConfig = {
  backgroundGradientFrom: '#1C2C21',
  backgroundGradientTo: '#1C2C21',
  decimalPlaces: 0,
  barPercentage: 0.6,
  color: (opacity = 1) => `rgba(141, 165, 100, ${opacity})`,
  labelColor: () => '#ffffff',
  style: {
    borderRadius: 16,
    padding: 40,
  },
  propsForLabels: {
    fontFamily: 'Oxanium_400Regular',
  },
};

const getStartOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Mon = 0
  return new Date(date.setDate(diff));
};

export default function WeeklyBarChart() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));
  const { balance, currency, addIncome, addExpense } = useFinance();
  const symbol = currency?.split(" ")[1] || "";
  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const goToNextWeek = () => {
    setStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

const chartHeight = 240;
const barOffset = 10; // space between bar top and label

const maxValue = Math.max(...weeklyData);

const screenWidth = Dimensions.get('window').width;

  const goToPreviousWeek = () => {
    setStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const pan = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50) {
      runOnJS(goToNextWeek)();
    } else if (e.translationX > 50) {
      runOnJS(goToPreviousWeek)();
    }
  });

  useEffect(() => {
    if (!user?.uid) return;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Full week
    

    const q = query(
      collection(db, 'users', user.uid, 'transactions'),
      where('type', '==', 'expense'),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<=', Timestamp.fromDate(end)),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dailyTotals = Array(7).fill(0);

      snapshot.forEach((doc) => {
        const txn = doc.data();
        const date = txn.date?.toDate();
        if (!date) return;

        const dayIndex = (date.getDay() + 6) % 7;
        dailyTotals[dayIndex] += txn.amount || 0;
      });

      setWeeklyData(dailyTotals);
    });

    return () => unsubscribe();
  }, [user, startDate]);

  const handleBarPress = (index) => {
    setSelectedIndex(index);
  };

  return (
    <GestureDetector gesture={pan}>
      <View style={{ position: 'relative' }}>
  <BarChart
    data={{
      labels: weekLabels,
      datasets: [{ data: weeklyData }],
    }}
    width={screenWidth - 32}
    height={240}
    yAxisLabel={symbol}
    fromZero
    chartConfig={chartConfig}
    verticalLabelRotation={0}
    showBarTops={true}
    withInnerLines={true}
    style={{ borderRadius: 16 }}
  />

  {/* Label Overlay */}
  <View
    style={{
      position:'absolute',
      top: 225,
      left: 50,
      width: screenWidth - 80,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems:'center',
      paddingHorizontal: 10,
    }}
  >
    {weeklyData.map((value, index) => (
      <Text
        key={index}
        style={{
          color: '#fff',
          fontSize: 12,
          fontFamily: 'Oxanium_400Regular',
        }}
      >
        {value > 0 ? `${value}` : ''}
      </Text>
    ))}
  </View>
  <Text style={{ color: '#000', marginTop: 10, fontFamily:"Oxanium_400Regular", textAlign:'center', fontSize:16}}>
          {startDate.toDateString()} - {new Date(startDate.getTime() + 6 * 86400000).toDateString()}
        </Text>
        <Text style={{ color: 'gray', marginBottom: 5,textAlign:'center' }}>{`<- Swipe ->`}</Text>
</View>

    </GestureDetector>
  );
  
}
