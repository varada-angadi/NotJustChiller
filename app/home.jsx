import { View, Text,TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import WeeklyBarChart from '../components/weeklyExpenseGraph';
import SavingsCard from '../components/savingsCard';
import RecentActivitySection from '../components/recent';
import StickyFAB from '../components/fab';

export default function Home() {
    const router=useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const today = dayjs().format('MMMM D, YYYY');
  const seperatorStyles={height:80, width:5, backgroundColor:"black"};
  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  return (
    <SafeAreaView className="flex-1 bg-[#1c2c21]">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      <ScrollView className="flex-1">
        <View
          className="flex-row items-center"
          style={{ paddingTop: 50, paddingHorizontal: 30 }}
        >
          <Text
            className="text-white"
            style={{ fontFamily: "Oxanium_400Regular", fontSize: 30 }}
          >
            Hey, XYZ
          </Text>
          <TouchableOpacity
            style={{ paddingLeft: 20, alignItems: "center" }}
            onPress={() => setShowBalance(!showBalance)}
          >
            <Ionicons
              name={showBalance ? "eye" : "eye-off"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/planBudget")}
          className="items-center"
          style={{ paddingTop: 20, paddingHorizontal: 30 }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontFamily: "Oxanium_400Regular",
            }}
          >
            Total Balance
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 60,
              fontFamily: "Oxanium_800ExtraBold",
            }}
          >
            {showBalance ? "₹ 12,340" : "•••••"}
          </Text>

          <Text
            style={{
              color: "#8DA563",
              fontSize: 20,
              fontFamily: "Oxanium_400Regular",
              paddingTop: 5,
            }}
          >
            “You're within budget”
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: "Oxanium_400Regular",
              paddingTop: 5,
            }}
          >
            {today}
          </Text>
        </TouchableOpacity>

        <View className="bg-white rounded-t-[25px] px-6 pt-6 mt-8">
          <View className="flex-row justify-center items-stretch min-h-[100px]">

            <TouchableOpacity onPress={() => router.push("/trackIncome")}
            className="flex-1 justify-center items-center">
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Oxanium_400Regular",
                  fontSize: 30,
                  color: "#1C2C21",
                }}
              >
                {" "}
                Income
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Oxanium_800ExtraBold",
                  fontSize: 40,
                  color: "#1C2C21",
                }}
              >
                {showBalance ? "₹ 3,340" : "•••••"}
              </Text>
            </TouchableOpacity>
            <View style={seperatorStyles}></View>

            <TouchableOpacity
              onPress={() => router.push("/trackExpense")}
              className="flex-1 justify-center items-center"
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Oxanium_400Regular",
                  fontSize: 30,
                  color: "#1C2C21",
                }}
              >
                {" "}
                Expense{" "}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Oxanium_800ExtraBold",
                  fontSize: 40,
                  color: "#1C2C21",
                }}
              >
                {showBalance ? "₹ 5,000" : "•••••"}
              </Text>
            </TouchableOpacity>
            
          </View>
          <Text
            className="mt-2 text-center"
            style={{ fontFamily: "Oxanium_400Regular", fontSize: 15 }}
          >
            “You have spend 10% more than last month”
          </Text>

          <View>
            <View className="flex-row justify-between items-center mt-5">
              <Text
                className="flex-1"
                style={{ fontFamily: "Oxanium_400Regular", fontSize: 25 }}
              >
                Expense
              </Text>
              <Text
                className="flex"
                style={{ fontFamily: "Oxanium_400Regular", fontSize: 15 }}
              >
                This Week
              </Text>
            </View>
            <WeeklyBarChart></WeeklyBarChart>
          </View>

          <View className="mt-5">
            <SavingsCard saved={3000} goal={10000} />
          </View>

          <View className="mt-5 mb-0">
            <Text
              className="flex-1"
              style={{
                fontFamily: "Oxanium_400Regular",
                fontSize: 25,
                color: "black",
              }}
            >
              Recent Activity
            </Text>
            <RecentActivitySection></RecentActivitySection>
          </View>

          

        </View>
      </ScrollView>
      <StickyFAB></StickyFAB>
    </SafeAreaView>
  );
}
