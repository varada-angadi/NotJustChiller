import React, { useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useFonts, Oxanium_400Regular } from '@expo-google-fonts/oxanium';

export default function YearScroller({ userCreationYear,  selectedYear, onYearSelect }) {

  const flatListRef = useRef(null);
  const [fontsLoaded] = useFonts({ Oxanium_400Regular });
  const currentYear = new Date().getFullYear();

  // Generate years array
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = userCreationYear; year <= currentYear; year++) {
      years.push({ id: year.toString(), year });
    }
    return years;
  }, [userCreationYear, currentYear]);

  // Auto-scroll to selected year
  useEffect(() => {
    const scrollToIndex = yearOptions.findIndex(item => item.year === selectedYear);
    if (scrollToIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: scrollToIndex,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);
    }
  }, [selectedYear, yearOptions]);
  console.log('🔁 Years rendered:', yearOptions);

  const renderItem = ({ item }) => {
    const isSelected = selectedYear === item.year;
    const isCurrentYear = item.year === currentYear;

    return (
      <TouchableOpacity
        onPress={() => onYearSelect(item.year)}
        style={[
          styles.yearItem,
          isSelected && styles.selectedYearItem,
          isCurrentYear && !isSelected && styles.currentYearItem
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.yearText,
          isSelected && styles.selectedYearText,
          isCurrentYear && !isSelected && styles.currentYearText
        ]}>
          {item.year}
        </Text>
        {isCurrentYear && (
          <View style={styles.currentIndicator} />
        )}
      </TouchableOpacity>
    );
  };

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
      
      <FlatList
        ref={flatListRef}
        horizontal
        data={yearOptions}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: 92, // Approximate item width + margin
          offset: 92 * index,
          index,
        })}
      />
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#1C2C21' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
          <Text style={styles.legendText}>Current Year</Text>
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
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  yearItem: {
    margin: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedYearItem: {
    backgroundColor: '#1C2C21',
    borderColor: '#8DA563',
  },
  currentYearItem: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
  },
  yearText: {
    color: '#666',
    fontFamily: 'Oxanium_400Regular',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedYearText: {
    color: 'white',
    fontWeight: '600',
  },
  currentYearText: {
    color: '#E65100',
    fontWeight: '600',
  },
  currentIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
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
    marginHorizontal: 15,
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