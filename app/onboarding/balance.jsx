import React, { useEffect, useState} from 'react'
import { ActivityIndicator,Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Oxanium_400Regular, useFonts } from '@expo-google-fonts/oxanium';
import PaginationDots from '../../components/pagination';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { useCurrency } from '../../context/CurrencyContext';

export default function Balance() {
    const [fontsLoaded] = useFonts({
        Oxanium_400Regular
      });
    const { user } = useAuth();
    const router = useRouter();
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false);
    const { currencySymbol, fetchCurrency } = useCurrency();
    useEffect(() => {
    if (user) {
      fetchCurrency();
    }
  }, [user]);


    const handleProceed = async () => {
  const numericBalance = parseFloat(balance);
  if (!balance || isNaN(numericBalance) || numericBalance <= 0) {
    Alert.alert('Invalid Balance', 'Please enter a valid balance greater than 0.');
    return;
  }

  setLoading(true);

  try {
    const docRef = doc(db, "users", user.uid, "preferences", "startup");
await setDoc(docRef, { balance: numericBalance }, { merge: true });
const overviewRef = doc(db, 'users', user.uid, 'summary', 'overview');
      await setDoc(overviewRef, {
      totalIncome: 0,
      totalExpense: 0,
      });
            Alert.alert("Setup Complete", "You're all set!", [
            {
              text: "Continue",
              onPress: () => router.replace("/home"), // ✅ go to home
            },
          ]);


    /*console.log("✅ Balance saved successfully:", numericBalance);
setTimeout(() => {
  router.replace("/onboarding/month");
}, 100);*/

  } catch (error) {
    Alert.alert("Something went wrong", "Please try again.");
  } finally {
    setLoading(false);
  }
};


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1c2c21' }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1,}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            
                        <View className='flex-1 items-center' style={{marginTop:50}}>
                        {/*App name*/}
                        <View>
                            <Text style={{textAlign:'center', color:'white',fontSize: 60,fontFamily: 'Iceland_400Regular', letterSpacing: 1,}}>notjust</Text>
                            <Text style={{textAlign: 'center', color: '#8da563',fontFamily: 'Oxanium_800ExtraBold',fontSize: 60,letterSpacing: 1,}}>CH₹LLAR</Text>
                        </View>

                        {/*App image*/}
                        <Image source={require('../../assets/logo.png')} style={{width:200, height:325,}} resizeMode='contain'/>

                        {/*Page Title*/}
                        <View className='flex-row justify-between items-center'>
                            <Image source={require('../../assets/balnce.png')}style={{width:30, height:30, paddingHorizontal:20}} resizeMode='contain'/>
                            <Text style={{color:'white',fontSize: 24,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,}}>Current Balance</Text>
                        </View>

                        {/*Balance Input*/}
                        <View style={{flexDirection: 'row',alignItems: 'center',borderBottomWidth: 1,borderBottomColor: '#8DA563',width: 150,marginTop: 10,}}>
                            <Text style={{color: 'white',fontSize: 24,marginRight: 4,fontFamily: 'Oxanium_400Regular',}}>
                                {currencySymbol}
                            </Text>
                            <TextInput placeholder="1500" placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={balance} onChangeText={setBalance} keyboardType="numeric" 
                            style={{color: 'white',fontSize: 24,fontFamily: 'Oxanium_400Regular',flex: 1,textAlign:'center'}}/>
                        </View>

                        {/*Page Helper*/}
                        <Text style={{marginTop:50,paddingHorizontal:40, color:'#FFFFFF80',fontSize: 16,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,textAlign:'center'}}>
                            💬 How much money do you currently have in hand or bank?
                        </Text>

                        {/*Pagination*/}
                        <View style={{marginTop: 30,}}>
                        <PaginationDots/>
                        </View>

                        {/*Next Button*/}
                        <TouchableOpacity onPress={handleProceed}
                            className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 30, height:50, width:230}}>
                                {loading ? ( <ActivityIndicator size="small" color="#8DA563" />) : (
                            <Text style={{fontFamily: 'Oxanium_400Regular',includeFontPadding: false, letterSpacing:2}} className="text-[20px] text-white text-center self-center leading-none">
                              
                                Proceed Next
                            </Text>
                                )}
                        </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    )
  }

