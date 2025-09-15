import { View, Text,TouchableOpacity, ScrollView, Image, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import WeeklyBarChart from '../components/weeklyExpenseGraph';
import SavingsCard from '../components/savingsCard';
import RecentActivitySection from '../components/recent';
import StickyFAB from '../components/fab';
import { signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useFinance } from '../context/balanceContext';
import { useSummary } from '../context/summaryContext';

export default function Home() {
  const router=useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const today = dayjs().format('MMMM D, YYYY');
  const seperatorStyles={height:80, width:5, backgroundColor:"black"};

  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

  const [name, setName] = useState("");
  const { balance, currency, addIncome, addExpense } = useFinance();
  const symbol = currency?.split(" ")[1] || "";
  const { totalIncome, totalExpense } = useSummary();

  useEffect(() => {
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
      } else {
        console.log("No such document!");
      }
    }
  };

  fetchUserData();
}, []);


  const handleLogout = async () => {
  try {
    await signOut(auth);
    router.replace("/");
    Toast.show({
      type: 'success',
      text1: 'Logged out',
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Logout failed',
      text2: error.message,
    });
  }
};

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
          <View style={{ flex: 1 }}>
    <Text
      className="text-white"
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{
        fontFamily: "Oxanium_400Regular",
        fontSize: 30,
      }}
    >
            Hey, {name || "username not found"}
          </Text>
          </View>
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
              fontSize: 25,
              fontFamily: "Oxanium_400Regular",
            }}
          >
            Total Balance
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 40,
              fontFamily: "Oxanium_400Regular",
              padding:10,
            }}
          >
            {showBalance ? `${symbol} ${balance?.toLocaleString()}` : "•••••"}
          </Text>

          {/*<Text
            style={{
              color: "#8DA563",
              fontSize: 20,
              fontFamily: "Oxanium_400Regular",
              paddingTop: 5,
            }}
          >
            “You're within budget”
          </Text>*/}


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
                {showBalance ? `${symbol} ${totalIncome.toLocaleString()}` : "•••••"}
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
                {showBalance ? `${symbol} ${totalExpense.toLocaleString()}` : "•••••"}
              </Text>
            </TouchableOpacity>
            
          </View>
          {/*<Text
            className="mt-2 text-center"
            style={{ fontFamily: "Oxanium_400Regular", fontSize: 15 }}
          >
            “You have spend 10% more than last month”
          </Text>*/}

          <View>
            <View className="flex-row justify-between items-center mt-5">
              <Text
                className="flex-1"
                style={{ fontFamily: "Oxanium_400Regular", fontSize: 25, paddingBottom:5 }}
              >
                Expense
              </Text>
            </View>
            <WeeklyBarChart></WeeklyBarChart>
          </View>

          {/*<View className="mt-5">
            <SavingsCard saved={3000} goal={10000} />
          </View>*/}

          <View style={{marginTop:30}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,}}>
              <Text style={{ fontSize: 25, fontFamily: 'Oxanium_400Regular' }}>Recent Activity</Text>
              <Text style={{ fontSize: 18, color: '#1E88E5', fontFamily: 'Oxanium_400Regular' }} onPress={() => router.push('/allHistory')}>View All</Text>
            </View>
            <RecentActivitySection></RecentActivitySection>
          </View>

          <TouchableOpacity
  onPress={handleLogout}
  style={{
    backgroundColor: '#8DA563',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
  }}
>
  <Text style={{ color: 'white', fontFamily: 'Michroma_400Regular' }}>
    Logout
  </Text>
</TouchableOpacity>


          

        </View>
      </ScrollView>
      <StickyFAB></StickyFAB>
    </SafeAreaView>
  );
}
