import React, { Component, useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Oxanium_400Regular, useFonts } from '@expo-google-fonts/oxanium';
import PaginationDots from '../../components/pagination';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // adjust path as per your setup
import { Alert } from 'react-native';


export default function Month() {
    const [fontsLoaded] = useFonts({
        Oxanium_400Regular
      });
    const { user } = useAuth();
    const router = useRouter();
    const [startDay, setStartDay] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleInput = (text) => {
    const num = parseInt(text);
        if (!isNaN(num) && num >= 1 && num <= 28) {
        setStartDay(num.toString());
        setError('');
        } else {
        setStartDay(text);
        setError('Enter a valid date between 1 and 28');
        }
    };

    const handleNext = async () => {
    const day = parseInt(startDay);
    if (isNaN(day) || day < 1 || day > 28) {
        setError('Enter a valid date between 1 and 28');
        return;
    }
    setLoading(true);
    try {
        const docRef = doc(db, "users", user.uid, "preferences", "startup");
        await setDoc(docRef, { budgetStartDay: day }, { merge: true });
        router.push("/onboarding/allocation");
    } catch (err) {
        console.error("Error saving budget start day:", err);
        Alert.alert("Error", "Could not save your input. Please try again.");
    }finally {
    setLoading(false); 
    }};

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
                            <Image source={require('../../assets/month.png')}style={{width:20, height:20, paddingHorizontal:20}} resizeMode='contain'/>
                            <Text style={{color:'white',fontSize: 24,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,}}>When does your budget cycle begin?</Text>
                        </View>
                        
                        {/*Date Input*/}
                        <TextInput placeholder="e.g. 1 to 28" placeholderTextColor="rgba(255,255,255,0.5)" value={startDay} onChangeText={handleInput} keyboardType="numeric" maxLength={2}
                        style={{marginTop:10,color: 'white',fontSize: 24,borderBottomWidth: 1,borderBottomColor: '#8DA563',width: 150,textAlign: 'center',fontFamily: 'Oxanium_400Regular',}}/>
                        {error ? (<Text style={{ color: '#ff6666', fontSize: 14, marginTop: 6 }}>{error} </Text>) : null}
                        
                        {/*Page Helper*/}
                        <Text style={{marginTop:50,paddingHorizontal:40, color:'#FFFFFF80',fontSize: 16,fontFamily: 'Oxanium_400Regular', letterSpacing: 1,textAlign:'center'}}>
                        💬 We'll align your budgeting months starting from this day.
                        </Text>

                        {/*Pagination*/}
                        <View style={{marginTop: 30,}}>
                        <PaginationDots/>
                        </View>

                        {/*Next Page*/}
                        
                    {loading ? (
                        <Text style={{ marginTop: 30, color: '#8DA563', fontSize: 18 }}>
                        Saving...
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleNext}
                            className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 30, height:50, width:230}}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',includeFontPadding: false, letterSpacing:2}} className="text-[20px] text-white text-center self-center leading-none">
                                Proceed Next
                            </Text>
                        </TouchableOpacity>)}
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
