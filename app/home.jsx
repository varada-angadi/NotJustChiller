import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function Home() {
  const [showBalance, setShowBalance] = useState(false);
  const today = dayjs().format('MMMM D, YYYY');
  const seperatorStyles={height:80, width:5, backgroundColor:"black"};
  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  return (
    <SafeAreaView className="flex-1 bg-[#1c2c21]">
        <ScrollView className="flex-1">
            <View className="flex-row items-center" style={{paddingTop: 50, paddingHorizontal: 30,}}>
            <Text className="text-white" style={{fontFamily:"Oxanium_400Regular", fontSize:30}}>Hey, XYZ</Text>
            <TouchableOpacity style={{paddingLeft: 20, alignItems: 'center'}} onPress={() => setShowBalance(!showBalance)}>
                <Ionicons name={showBalance ? 'eye' : 'eye-off'} size={30} color="white" />
            </TouchableOpacity>
            </View>

            <View className="items-center" style={{paddingTop:20,paddingHorizontal: 30,}}>
            <Text 
            style={{color:'white', fontSize:30, fontFamily:"Oxanium_400Regular",}}>
                Total Balance
            </Text>
            <Text style={{color:'white', fontSize:60, fontFamily:"Oxanium_800ExtraBold",}}>
                {showBalance ? '₹ 12,340' : '•••••'}
            </Text>
            <Text style={{color:'#8DA563', fontSize:20, fontFamily:"Oxanium_400Regular", paddingTop:5}}>
                “You're within budget”
            </Text>
            <Text style={{color:'white', fontSize:25, fontFamily:"Oxanium_400Regular", paddingTop:5}}>
                {today}
            </Text>
            </View>

            <View className="bg-white rounded-t-[25px] px-6 pt-6 pb-10 mt-8">
            <View className="flex-row justify-center items-stretch min-h-[100px]">
                <View className="flex-1 justify-center items-center">
                    <Text style={{textAlign:'center', fontFamily:"Oxanium_400Regular", fontSize:30, color:"#1C2C21"}}> Income</Text>
                    <Text style={{textAlign:'center', fontFamily:"Oxanium_800ExtraBold", fontSize:40, color:"#1C2C21"}}>{showBalance ? '₹ 3,340' : '•••••'}</Text>
                </View>
                <View style={seperatorStyles}></View>
                <View className="flex-1 justify-center items-center">
                    <Text style={{textAlign:'center', fontFamily:"Oxanium_400Regular", fontSize:30, color:"#1C2C21"}}> Expense </Text>
                    <Text style={{textAlign:'center', fontFamily:"Oxanium_800ExtraBold", fontSize:40, color:"#1C2C21"}}>{showBalance ? '₹ 5,000' : '•••••'}</Text>
                </View>
            </View>
            <Text className="mt-2 text-center" style={{fontFamily:"Oxanium_400Regular", fontSize:15}}>“You have spend 10% more than last month”</Text>
            
            

            <View>
                <View className="flex-row justify-between items-center mt-5">
                <Text className="flex-1" style={{fontFamily:"Oxanium_400Regular", fontSize:25}}>Expense</Text>
                <Text className="flex" style={{fontFamily:"Oxanium_400Regular", fontSize:15}}>This Week</Text>
                </View>


            </View>
        </View>
    </ScrollView>
    </SafeAreaView>
  );
}
