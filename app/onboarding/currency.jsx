import React, { Component, useEffect, useState } from 'react'
import { ActivityIndicator,Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View,Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Oxanium_400Regular, useFonts } from '@expo-google-fonts/oxanium';
import PaginationDots from '../../components/pagination';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import CurrencyPicker from '../../components/currencyPicker';
import { db } from '../../config/firebase';
import { doc,setDoc,getDoc } from 'firebase/firestore';

export default function Currency() {
    const [fontsLoaded] = useFonts({
        Oxanium_400Regular
      });
    const { user } = useAuth();
    const router = useRouter();
    const [currency, setCurrency] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
  const fetchCurrency = async () => {
    if (!user) return;

    try {
      const startupRef = doc(db, 'users', user.uid, 'preferences', 'startup');
const docSnap = await getDoc(startupRef);
if (docSnap.exists()) {
  const startupData = docSnap.data();
  const userCurrency = startupData?.currency || '';
  setCurrency(userCurrency);
        console.log("Fetched currency:", userCurrency);
      }
    } catch (error) {
      console.error('Error fetching currency: ', error);
    }
  };

  fetchCurrency();
}, [user]);

    useEffect(() => {
      if (!user) {
        Alert.alert(
          'Not Signed In',
          'You need to sign up or log in to continue.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/signup'),
            },
          ],
          { cancelable: false }
        );
      }
    }, [user]);


    const validateAndSaveCurrency = async () => {
      if (!currency || currency.trim() === '') {
        alert('Please select a currency to continue.');
        return;
      }

      setLoading(true);
      try {
        const startupRef = doc(db, 'users', user.uid, 'preferences', 'startup');
        await setDoc(startupRef, { currency }, { merge: true });
        console.log('Currency saved to Firebase');
        router.push("/onboarding/balance");
      } catch (error) {
        console.error('Error saving currency: ', error);
        alert('Something went wrong while saving your currency.');
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
                            
                        <View className='flex-1 items-center' style={{marginTop:80}}>
                        {/*App name*/}
                        <View style={{marginBottom:-30}}>
                            <Text style={{textAlign:'center', color:'white',fontSize: 60,fontFamily: 'Iceland_400Regular', letterSpacing: 1,}}>notjust</Text>
                            <Text style={{textAlign: 'center', color: '#8da563',fontFamily: 'Oxanium_800ExtraBold',fontSize: 60,letterSpacing: 1,}}>CH₹LLAR</Text>
                        </View>

                        {/*App image*/}
                        <Image source={require('../../assets/logo.png')} style={{width:200, height:325,}} resizeMode='contain'/>

                        {/*Page Title*/}
                        <View className='flex-row justify-between items-center'>
                        <Image source={require('../../assets/currency.png')}style={{width:30, height:30, paddingHorizontal:20}} resizeMode='contain'/>
                        <Text style={{color:'white',fontSize: 24,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,}}>Choose your preferred currency</Text>
                        </View>

                        {/*Currency Dropdown*/}
                        <View style={{marginTop:10, alignItems:'center'}}>
                            <CurrencyPicker selectedCurrency={currency} onSelect={setCurrency} />
                        </View>

                        {/*Page Helper*/}
                        <Text style={{marginTop:30,paddingHorizontal:40, color:'#FFFFFF80',fontSize: 16,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,textAlign:'center'}}>
                            💬 This will be used across all your transactions and summaries.
                        </Text>

                        {/*Pagination*/}
                        <View style={{marginTop: 50,}}>
                        <PaginationDots/>
                        </View>

                        {/*Next Button*/}
                        <TouchableOpacity onPress={validateAndSaveCurrency}
                        disabled={loading}
                            className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 30, height:50, width:230,opacity: loading ? 0.6 : 1 }}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',includeFontPadding: false, letterSpacing:2}} className="text-[20px] text-white text-center self-center leading-none">
                                {loading ? 'Saving...' : 'Proceed Next'}
                            </Text>
                        </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    )
  }


