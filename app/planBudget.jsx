import { ScrollView, Text, View, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold, Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import MonthScroller from '../components/monthScroller';
import React, { useState } from 'react';
import SemiCircleChart from '../components/budgetRing';
import DonutChart from '../components/budgetPie';
import BudgetBarChart from '../components/savingsActual';
import MonthlyTrendChart from '../components/monthlyTrend';


export default function Budget() {
  const [fontsLoaded] = useFonts({
    Oxanium_800ExtraBold,
    Oxanium_400Regular,
  });

  const budgetData = [
  { label: 'Needs', value: 3000, color: '#0E665A' },
  { label: 'Wants', value: 1000, color: '#5BAC18' },
  { label: 'Savings', value: 6000, color: '#143054' },
];

const barChartData = [
  { label: 'Needs', budget: 3000, actual: 2500, color: '#0E665A' },
  { label: 'Wants', budget: 1000, actual: 700, color: '#5BAC18' },
  { label: 'Savings', budget: 6000, actual: 3400, color: '#143054' },
];

const monthlyData = [
  { month: 'Jan', budget: 5000, actual: 4500 },
  { month: 'Feb', budget: 6000, actual: 6300 },
  { month: 'Mar', budget: 5500, actual: 5000 },
  { month: 'Jan', budget: 5000, actual: 4500 },
  { month: 'Feb', budget: 6000, actual: 6300 },
  { month: 'Mar', budget: 5500, actual: 5000 },
];




  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'white', padding: 10 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>

        {/* Page Title */}
        <View className="flex-1">
          <Text style={{ color: 'black', fontSize: 30, fontFamily: 'Oxanium_400Regular' }}>
                Plan Your Budget
          </Text>
        </View>

        {/* Month Scroller */}
        <View>
          <MonthScroller />
        </View>

        {/*Budget Ring*/}
        <View>
            <SemiCircleChart total={10000} spent={6000} />
        </View>

        {/*Budget Set Button */}
        <View className='items-center' style={{paddingTop:10}}>
            <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 24,color: '#1C2C21',paddingBottom:10}}>
            Want to edit the Budget plan?
            </Text>
            <TouchableOpacity className="flex-1 justify-center items-center"style={{backgroundColor:'#1C2C21', width:90,height:40,borderRadius:25}}>
                <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 25,color: 'white',padding:5}}>Set</Text>
            </TouchableOpacity>
        </View>

        {/*Budget Aloocation Pie chart */}
        <View>
        <Text style={{ color: 'black', fontSize: 24, fontFamily: 'Oxanium_400Regular', marginTop:20}}>
            Budget vs Actual
        </Text>
        <View className="flex-row justify-center items-center">
            <DonutChart data={budgetData} />
            <BudgetBarChart data={barChartData}></BudgetBarChart>
        </View>
        </View>

        {/*Monthly Budget Expense Trend*/}
        <View style={{marginTop:20}}>
          <Text style={{ color: 'black', fontSize: 24, fontFamily: 'Oxanium_400Regular', marginTop:20}}>
            Monthly Trend – Budget vs Expense
        </Text>
          <MonthlyTrendChart data={monthlyData}></MonthlyTrendChart>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
