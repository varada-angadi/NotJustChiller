import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold, Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import MonthScroller from '../components/monthScroller';
import YearScroller from '../components/yearScoller';
import IncomeBreakdown from '../components/incomeCategory';
import IncomeLineChart from '../components/incomeChart';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useFinance } from '../context/balanceContext';

export default function TrackIncome() {

  const [fontsLoaded] = useFonts({ Oxanium_800ExtraBold, Oxanium_400Regular, });
  const { currency } = useFinance();
  const symbol = currency?.split(" ")[1] || "";

  // State management
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date utilities
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [userCreationYear, setUserCreationYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState('income');

  // Fetch income data from Firebase
  const fetchIncomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const txnsRef = collection(db, 'users', user.uid, 'transactions');
      const incomeQuery = query(
        txnsRef, 
        where('type', '==', 'income'),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(incomeQuery);
      
      if (snapshot.empty) {
        setIncomeData([]);
        return;
      }

      const fetchedData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: Number(data.amount) || 0,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          category: data.category || 'Other',
          description: data.description || '',
          ...data
        };
      });

      setIncomeData(fetchedData);

      // Set earliest year for year scroller
      if (fetchedData.length > 0) {
  const validDates = fetchedData
    .map(item => {
      const dateObj = item.date?.toDate?.(); // Convert Firestore Timestamp to JS Date
      return dateObj instanceof Date ? dateObj.getTime() : null;
    })
    .filter(ts => ts !== null && !isNaN(ts));

  const earliestYear = validDates.length
    ? new Date(Math.min(...validDates)).getFullYear()
    : currentYear;

  console.log("📅 Earliest year from Firebase (safe):", earliestYear);
  setUserCreationYear(earliestYear);
}



    } catch (error) {
      console.error("Error fetching income data:", error);
      setError(error.message);
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  // Generate chart data based on selected filters
  const chartData = useMemo(() => {
  if (!incomeData.length) return [];

  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getJsDate = (date) => date?.toDate?.() || new Date(date); // ⬅️ Ensure JS Date

  switch (selectedMonth) {
    case 'Last 6M': {
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      const filteredData = incomeData
        .filter(item => getJsDate(item.date) >= sixMonthsAgo)
        .reduce((acc, item) => {
          const date = getJsDate(item.date);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          acc[key] = (acc[key] || 0) + item.amount;
          return acc;
        }, {});

      return Object.entries(filteredData)
        .map(([key, amount]) => {
          const [year, month] = key.split('-');
          return {
            date: new Date(year, month).toLocaleString('default', { month: 'short' }),
            amount: amount
          };
        })
        .sort((a, b) => months.indexOf(a.date) - months.indexOf(b.date));
    }

    case 'Entire Year': {
      const yearData = incomeData
        .filter(item => getJsDate(item.date).getFullYear() === selectedYear)
        .reduce((acc, item) => {
          const month = getJsDate(item.date).getMonth();
          acc[month] = (acc[month] || 0) + item.amount;
          return acc;
        }, {});

      return months.map((month, index) => ({
        date: month,
        amount: yearData[index] || 0
      }));
    }

    case 'All Time': {
      const yearlyData = incomeData.reduce((acc, item) => {
        const year = getJsDate(item.date).getFullYear();
        acc[year] = (acc[year] || 0) + item.amount;
        return acc;
      }, {});

      return Object.entries(yearlyData)
        .map(([year, amount]) => ({ date: year, amount }))
        .sort((a, b) => Number(a.date) - Number(b.date));
    }

    default: {
      // Weekly breakdown
      const monthIndex = months.indexOf(selectedMonth);
      const weeklyData = incomeData
        .filter(item => {
          const date = getJsDate(item.date);
          return date.getFullYear() === selectedYear && date.getMonth() === monthIndex;
        })
        .reduce((acc, item) => {
          const day = getJsDate(item.date).getDate();
          const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
          acc[weekIndex] = (acc[weekIndex] || 0) + item.amount;
          return acc;
        }, {});

      return Array.from({ length: 5 }, (_, index) => ({
        date: `Week ${index + 1}`,
        amount: weeklyData[index] || 0
      }));
    }
  }
}, [incomeData, selectedMonth, selectedYear]);


  // Calculate total income
  const totalIncome = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.amount, 0),
    [chartData]
  );

  // Generate period label
  const getPeriodLabel = useCallback(() => {
    switch (selectedMonth) {
      case 'Last 6M': return `Last 6 Months (${selectedYear})`;
      case 'Entire Year': return `Entire Year ${selectedYear}`;
      case 'All Time': return 'All Time';
      default: return `${selectedMonth} ${selectedYear}`;
    }
  }, [selectedMonth, selectedYear]);

  // Generate insights
  const generateInsights = useCallback(() => {
    if (!chartData.length) return null;

    const maxEntry = chartData.reduce((max, curr) => 
      curr.amount > max.amount ? curr : max, chartData[0]);

    switch (selectedMonth) {
      case 'Last 6M': {
        const avgIncome = Math.round(totalIncome / 6);
        const growth = chartData.length >= 2 ? 
          (((chartData[chartData.length - 1].amount - chartData[0].amount) / chartData[0].amount) * 100).toFixed(1) : 0;
        
        return `• Best month: ${maxEntry.date} (₹${maxEntry.amount.toLocaleString()})\n• Average monthly income: ${symbol}${avgIncome.toLocaleString()}\n• Growth trend: ${growth}%`;
      }
      case 'Entire Year': {
        const avgIncome = Math.round(totalIncome / 12);
        return `• Best month: ${maxEntry.date} (₹${maxEntry.amount.toLocaleString()})\n• Average monthly income: ${symbol}${avgIncome.toLocaleString()}\n• Total year income: ₹${totalIncome.toLocaleString()}`;
      }
      case 'All Time': {
        const avgYearlyIncome = Math.round(totalIncome / chartData.length);
        return `• Best year: ${maxEntry.date} (₹${maxEntry.amount.toLocaleString()})\n• Average yearly income: ${symbol}${avgYearlyIncome.toLocaleString()}\n• Total all-time income: ₹${totalIncome.toLocaleString()}`;
      }
      default:
        return null;
    }
  }, [chartData, selectedMonth, totalIncome]);

  // Event handlers
  const handleYearSelect = useCallback((year) => {
    setSelectedYear(year);
    setSelectedMonth(currentMonth); // Reset to current month when year changes
  }, [currentMonth]);

  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8DA563" />
          <Text style={styles.loadingText}>Loading income data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubText}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>

        {/* Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Track Your Income</Text>
        </View>

        {/* Year Scroller */}
        <YearScroller userCreationYear={userCreationYear} selectedYear={selectedYear} onYearSelect={handleYearSelect}/>

        {/* Month/Period Scroller */}
        <MonthScroller selectedYear={selectedYear} selectedMonth={selectedMonth} onMonthSelect={handleMonthSelect}/>

        {/* Selected Period Info */}
        <View style={[
          styles.periodContainer,
          selectedMonth === 'Last 6M' && styles.shortPeriodContainer,
          selectedMonth === 'Entire Year' && styles.mediumPeriodContainer,
          selectedMonth === 'All Time' && styles.longPeriodContainer
        ]}>
          <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
          <Text style={styles.totalIncomeText}>
            Total Income: {symbol}{totalIncome.toLocaleString()}
          </Text>
          {selectedYear === currentYear && selectedMonth === currentMonth && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current Month</Text>
            </View>
          )}
        </View>

        {/* Income Chart */}
        {chartData.length > 0 ? (
          <IncomeLineChart 
            incomeData={chartData}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            chartTitle={
              selectedMonth === 'Last 6M' ? 'Last 6 Months Income Trend' :
              selectedMonth === 'Entire Year' ? 'Monthly Income Overview' :
              selectedMonth === 'All Time' ? 'Yearly Income Overview' :
              'Weekly Income Breakdown'
            }
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No income data available for this period</Text>
          </View>
        )}

        {/* Insights */}
        {generateInsights() && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Insights</Text>
            <Text style={styles.insightsText}>{generateInsights()}</Text>
          </View>
        )}

        {/* Category Analysis */}
        <View style={styles.titleContainer}>
          <Text style={{color: 'black',
    fontSize: 20,
    fontFamily: 'Oxanium_400Regular',
    paddingLeft:10,}}>Categorical Breakdown of Income</Text>
        </View>
        <IncomeBreakdown/>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  titleContainer: {
    marginBottom: 10,
    marginTop:20,
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontFamily: 'Oxanium_400Regular',
    paddingLeft:10,
  },
  periodContainer: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: '#F8F9FA',
  },
  shortPeriodContainer: {
    borderLeftColor: '#4A90E2',
    backgroundColor: '#F3F8FF',
  },
  mediumPeriodContainer: {
    borderLeftColor: '#66BB6A',
    backgroundColor: '#E8F5E8',
  },
  longPeriodContainer: {
    borderLeftColor: '#9C27B0',
    backgroundColor: '#FCF4FF',
  },
  periodLabel: {
    fontSize: 14,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
    marginBottom: 5,
  },
  totalIncomeText: {
    fontSize: 20,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  currentBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#8DA563',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  insightsContainer: {
    backgroundColor: '#FFF9E6',
    marginHorizontal:10,
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  insightsTitle: {
    fontSize: 18,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
    lineHeight: 20,
  },
});