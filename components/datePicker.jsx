import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';

export default function FormDatePicker({value, onChange }) {
    const [fontsLoaded] = useFonts({
          Oxanium_800ExtraBold,
          Oxanium_400Regular
        });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
  console.log("Selected Date:", value);
}, [value]);

  return (
    <View>

        <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>
            {value ? dayjs(value).format('DD MMM YYYY') : 'Select date'}
          </Text>
        </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker value={value || new Date()} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (event.type==="set" && selectedDate) { onChange(selectedDate);}}}/>)}
    </View>
  );
}

const styles = StyleSheet.create({

  inputWrapper: {
  height: 45,
  borderWidth: 2,
  borderColor: '#8da563',
  borderRadius: 6,
  width: 350,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
  justifyContent: 'center',
},

inputText: {
  fontSize: 20,
  color: 'black',
  fontFamily: 'Oxanium_400Regular',
},
  input: {
  height: 45,
  borderWidth: 2,
  borderColor: '#8da563',
  borderRadius: 6,
  width: 350,
  paddingHorizontal: 10,
  fontSize: 16,
  color: 'black', // Match your input text color
  backgroundColor: '#fff', // Or whatever bg you use in inputs
  fontFamily: 'Oxanium_400Regular', // Match the Title field
  justifyContent:'center',
  },
});
