import React, { Component, useState } from 'react'
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Oxanium_400Regular, useFonts } from '@expo-google-fonts/oxanium';
import PaginationDots from '../../components/pagination';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import { db } from '../../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

export default function Month() {
    const [fontsLoaded] = useFonts({
        Oxanium_400Regular
      });
    const router = useRouter();
    const { user } = useAuth();
    const [needs, setNeeds] = useState('');
    const [wants, setWants] = useState('');
    const [savings, setSavings] = useState('');
    const [error, setError] = useState('');

    const  handleGo = async () =>{
    const total = parseInt(needs) + parseInt(wants) + parseInt(savings);

    if (!needs || !wants || !savings) {
      setError("Please fill all fields");
      return;
    }

    if (total !== 100) {
      setError("The percentages must add up to 100%");
      return;
    }

    try {
      

      const userRef = doc(db, 'users', user.uid, 'preferences', 'startup');
      await setDoc(userRef, {
        allocation: {
          needs: parseInt(needs),
          wants: parseInt(wants),
          savings: parseInt(savings),
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
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

      router.push("/onboarding/allocation");
    } catch (e) {
      console.error("🔥 Error saving allocation:", e);
      setError("Error saving data. Please try again.");
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
                            <Image source={require('../../assets/allocation.png')}style={{width:20, height:20, paddingHorizontal:20}} resizeMode='contain'/>
                            <Text style={{color:'white',fontSize: 24,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,}}>Divide your budget smartly</Text>
                        </View>
                        
                        {/*Budget Allocation*/}
                        <View style={{flexDirection: 'row',alignItems: 'center',borderBottomWidth: 1,borderBottomColor: '#8DA563',width: 150,marginTop: 10,}}>
                            <Text style={{ color: 'white', fontSize: 20, marginRight: 4, fontFamily: 'Oxanium_400Regular', }}>
                                Needs (%)
                            </Text>
                            <TextInput placeholder="40%" placeholderTextColor="rgba(255, 255, 255, 0.5)" value={needs} onChangeText={setNeeds} keyboardType="numeric"
                            style={{ color: 'white', fontSize: 24, fontFamily: 'Oxanium_400Regular', flex: 1, textAlign: 'center' }} />
                            
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center',borderBottomWidth: 1,borderBottomColor: '#8DA563',width: 150,marginTop: 10,}}>
                            <Text style={{ color: 'white', fontSize: 20, marginRight: 4, fontFamily: 'Oxanium_400Regular', }}>
                                Wants (%)
                            </Text>
                            <TextInput placeholder="30%" placeholderTextColor="rgba(255, 255, 255, 0.5)" value={wants} onChangeText={setWants} keyboardType="numeric"
                            style={{ color: 'white', fontSize: 24, fontFamily: 'Oxanium_400Regular', flex: 1, textAlign: 'center' }} />
                            
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center',borderBottomWidth: 1,borderBottomColor: '#8DA563',width: 150,marginTop: 10,}}>
                            <Text style={{ color: 'white', fontSize: 20, marginRight: 4, fontFamily: 'Oxanium_400Regular', }}>
                                Savings (%)
                            </Text>
                            <TextInput placeholder="30%" placeholderTextColor="rgba(255, 255, 255, 0.5)" value={savings} onChangeText={setSavings} keyboardType="numeric"
                            style={{ color: 'white', fontSize: 24, fontFamily: 'Oxanium_400Regular', flex: 1, textAlign: 'center' }} />
                        </View>
                        {error && <Text style={{ color: 'red',fontSize:14 }}>{error}</Text>}

                        {/*Page Helper*/}
                        <Text style={{marginTop:30,paddingHorizontal:40, color:'#FFFFFF80',fontSize: 16,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,textAlign:'center'}}>
                        💬 Make sure these add up to 100%. You can always adjust this later.
                        </Text>

                        {/*Pagination*/}
                        <View style={{marginTop: 10,}}>
                        <PaginationDots/>
                        </View>

                        {/*Next Page*/}
                        <TouchableOpacity onPress={handleGo}
                            className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 20, height:50, width:230}}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',includeFontPadding: false, letterSpacing:2}} className="text-[20px] text-white text-center self-center leading-none">
                                Lets Go
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    )
  }

