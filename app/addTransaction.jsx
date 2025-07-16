import React, { Component, useRef, useState } from 'react'
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import TabScreen from '../components/TabScreen';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

export default function AddTransaction() {
    const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  const { defaultTab } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState(parseInt(defaultTab) || 0); 
 // 0: Income, 1: Expense
  const incomeFormRef = useRef();
  const expenseFormRef = useRef();
  const navigation = useNavigation();

  const handleReset = () => {
    if (selectedTab === 0) {
      incomeFormRef.current?.resetForm();
    } else {
      expenseFormRef.current?.resetForm();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

    return (
      <SafeAreaView className="flex-1" style={{backgroundColor:"#1C2C21",}}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <ScrollView showsVerticalScrollIndicator={false}>

            <View className="flex-row justify-between items-center" style={{marginBottom:20,padding:15, marginTop:5, position:"relative"}}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={{color:"white", fontFamily:"Oxanium_400Regular",fontSize:18}}>Cancel</Text>
                </TouchableOpacity >
                <Text style={{color:"white",fontFamily:"Oxanium_400Regular",fontSize:30, position:"absolute", textAlign:'center',left:0,right:0, zIndex:-1}}>{selectedTab === 0 ? 'Add Income' : 'Add Expense'}</Text>
                <TouchableOpacity onPress={handleReset}>
                <Text style={{color:"white",fontFamily:"Oxanium_400Regular",fontSize:18}}>Reset</Text>
                </TouchableOpacity>
            </View>

            <View style={{backgroundColor:"white",}}>
                <View>
                <TabScreen
  selectedTab={selectedTab}
  setSelectedTab={setSelectedTab}
/>
                </View>

            </View>


          </ScrollView>
    </SafeAreaView>
    )
  }

