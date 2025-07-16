import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold, Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import MonthScroller from '../components/monthScroller';
import Dropdown from '../components/dropDown';
import CategoryBreakdown from '../components/expenseCategory';
import IncomeLineChart from '../components/incomeChart'; // ✅ keep this
import React, { useState } from 'react';


const mockIncome = [
  { date: 'Jan', amount: 6000 },
  { date: 'Feb', amount: 7200 },
  { date: 'Mar', amount: 6500 },
  { date: 'Apr', amount: 8000 },
];

export default function Expense() {
  const [fontsLoaded] = useFonts({
    Oxanium_800ExtraBold,
    Oxanium_400Regular,
  });

  const [selectedPeriod, setSelectedPeriod] = useState('month'); // or any default like 'today'


  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'white', padding: 10 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Page Title */}
        <View className="flex-1">
          <Text style={{ color: 'black', fontSize: 30, fontFamily: 'Oxanium_400Regular' }}>
            Track Your Income
          </Text>
        </View>

        {/* Month Scroller */}
        <View>
          <MonthScroller />
        </View>

        {/* Dropdown */}
        <View>
          <Dropdown
            label="Income"
            selectedValue={selectedPeriod}
            onValueChange={value => setSelectedPeriod(value)}
          />
        </View>

        {/* Income Line Chart */}
        <View style={{ marginVertical: 20 }}>
          <IncomeLineChart incomeData={mockIncome} />
        </View>

        {/* Categorical Analysis */}
        <View>
          <CategoryBreakdown />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
