import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';

export default function Dropdown({ onValueChange = () => {}, selectedValue }) {
const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense</Text>

      <RNPickerSelect
        onValueChange={onValueChange}
        value={selectedValue}
        placeholder={{ label: 'Select a period', value: null }}
        items={[
          { label: 'Today', value: 'today' },
          { label: 'This week', value: 'week' },
          { label: 'This month', value: 'month' },
          { label: 'Past 6 months', value: '6months' },
          { label: 'Past year', value: 'year' },
        ]} style={pickerSelectStyles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom:0,
  },
  title: {
    fontFamily: 'Oxanium_400Regular',
    fontSize: 24,
    color: '#1C2C21',
    paddingLeft: 5,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: 'black',
    fontFamily: 'Oxanium_400Regular',
    minWidth: 140,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#1C2C21',
    fontFamily: 'Oxanium_400Regular',
    minWidth: 140,
  },
};
