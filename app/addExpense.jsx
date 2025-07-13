import React, { Component } from 'react'
import { Text, View, StatusBar, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import TabScreen from '../components/TabScreen';

export default function addExpense() {
    const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

    return (
      <SafeAreaView className="flex-1" style={{backgroundColor:"#1C2C21", padding:10}}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <ScrollView showsVerticalScrollIndicator={false}>

            <View className="flex-row justify-between items-center" style={{marginBottom:20}}>
                <Text style={{color:"white", fontFamily:"Oxanium_400Regular",fontSize:18}}>Cancel</Text>
                <Text style={{color:"white",fontFamily:"Oxanium_400Regular",fontSize:30, position:"absolute", textAlign:'center',left:0,right:0}}>Add Expense</Text>
                <Text style={{color:"white",fontFamily:"Oxanium_400Regular",fontSize:18}}>Save</Text>
            </View>

            <View style={{backgroundColor:"white",}}>
                <View>
                <TabScreen defaultTab={1} ></TabScreen>
                </View>

            </View>


          </ScrollView>
    </SafeAreaView>
    )
  }

