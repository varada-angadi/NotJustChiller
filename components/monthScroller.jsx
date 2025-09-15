import React, { useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useFonts, Oxanium_400Regular } from '@expo-google-fonts/oxanium';

const monthScroll = [
  { id: '1', month: 'Jan' },
  { id: '2', month: 'Feb' },
  { id: '3', month: 'Mar' },
  { id: '4', month: 'Apr' },
  { id: '5', month: 'May' },
  { id: '6', month: 'Jun' },
  { id: '7', month: 'Jul' },
  { id: '8', month: 'Aug' },
  { id: '9', month: 'Sep' },
  { id: '10', month: 'Oct' },
  { id: '11', month: 'Nov' },
  { id: '12', month: 'Dec' },
];

const periodOptions = [
  { id: 'last6', month: 'Last 6M', isPeriod: true, periodType: 'short' },
  { id: 'entireyear', month: 'Entire Year', isPeriod: true, periodType: 'medium' },
  { id: 'alltime', month: 'All Time', isPeriod: true, periodType: 'long' },
];

export default function MonthScroller({ selectedYear, selectedMonth, onMonthSelect }) {
  const flatListRef = useRef(null);
  const [fontsLoaded] = useFonts({ Oxanium_400Regular });
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });

  // Add current month indicator for current year only
  const updatedMonthScroll = useMemo(() =>
    monthScroll.map(month => ({
      ...month,
      isCurrentMonth: month.month === currentMonth && selectedYear === currentYear
    })), [currentMonth, selectedYear, currentYear]
  );

  // Auto-scroll to selected month/period
  useEffect(() => {
    const allOptions = [...periodOptions, ...updatedMonthScroll];
    const selectedIndex = allOptions.findIndex(item => item.month === selectedMonth);
    
    if (selectedIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);
    }
  }, [selectedMonth, updatedMonthScroll]);

  const getPeriodStyle = (item, isSelected) => {
    if (!item.isPeriod) return {};
    
    const styles = {
      short: {
        backgroundColor: isSelected ? '#1976D2' : '#E3F2FD',
        borderColor: '#4A90E2',
      },
      medium: {
        backgroundColor: isSelected ? '#388E3C' : '#E8F5E8',
        borderColor: '#66BB6A',
      },
      long: {
        backgroundColor: isSelected ? '#7B1FA2' : '#FCF4FF',
        borderColor: '#9C27B0',
      }
    };
    
    return styles[item.periodType] || {};
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedMonth === item.month;
    const isCurrentMonth = item.isCurrentMonth;
    const isPeriod = item.isPeriod;
    
    return (
      <TouchableOpacity
        onPress={() => onMonthSelect(item.month)}
        style={[
          styles.monthItem,
          isSelected && styles.selectedMonthItem,
          isCurrentMonth && !isSelected && styles.currentMonthItem,
          isPeriod && getPeriodStyle(item, isSelected),
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.monthText,
          isSelected && styles.selectedMonthText,
          isCurrentMonth && !isSelected && styles.currentMonthText,
          isPeriod && isSelected && { color: 'white' }
        ]}>
          {item.month}
        </Text>
        {isCurrentMonth && (
          <View style={styles.currentIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const allOptions = useMemo(() => [...periodOptions, ...updatedMonthScroll], [updatedMonthScroll]);

  const onScrollToIndexFailed = (info) => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        data={allOptions}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: 86,
          offset: 86 * index,
          index,
        })}
      />
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#1C2C21' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        {selectedYear === currentYear && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#8DA563' }]} />
            <Text style={styles.legendText}>Current Month</Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
          <Text style={styles.legendText}>Period View</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  labelContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  monthItem: {
    margin: 6,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 25,
    backgroundColor: '#8DA563',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    minWidth: 70,
    alignItems: 'center',
  },
  selectedMonthItem: {
    backgroundColor: '#1C2C21',
    borderColor: '#8DA563',
  },
  currentMonthItem: {
    backgroundColor: '#E8F5E8',
    borderColor: '#8DA563',
  },
  monthText: {
    color: '#000',
    fontFamily: 'Oxanium_400Regular',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedMonthText: {
    color: 'white',
    fontWeight: '600',
  },
  currentMonthText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  currentIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8DA563',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Oxanium_400Regular',
  },
});