import React, { Component, useEffect } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Oxanium_400Regular, useFonts } from '@expo-google-fonts/oxanium';
import PaginationDots from '../../components/pagination';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { useUserInfo } from '../../context/userInfo';

export default function StartUp() {
    const [fontsLoaded] = useFonts({
        Oxanium_400Regular
      });

    const { username} = useUserInfo(); 
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
    if (!user) {
        router.replace('/signup');
    }
    }, [user]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1c2c21' }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1,}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className='flex-1' style={{padding:10}}>
                            <Text style={{marginTop:50,color:'white',fontSize: 30,fontFamily: 'Oxanium_400Regular', letterSpacing: 2,textAlign: 'center',}}>Welcome, {username || 'User'}</Text>
                        <View className='flex-1 items-center' style={{marginTop:30}}>
                        {/*App name*/}
                        <View>
                            <Text style={{textAlign:'center', color:'white',fontSize: 60,fontFamily: 'Iceland_400Regular', letterSpacing: 1,}}>notjust</Text>
                            <Text style={{textAlign: 'center', color: '#8da563',fontFamily: 'Oxanium_800ExtraBold',fontSize: 60,letterSpacing: 1,}}>CH₹LLAR</Text>
                        </View>

                        {/*App image*/}
                        <Image source={require('../../assets/logo.png')} style={{width:250, height:325,}} resizeMode='contain'/>

                        <Text style={{marginTop:30,textAlign:'center', color:'white',fontSize: 30,fontFamily: 'Oxanium_400Regular', letterSpacing: 5,}}>Let’s quickly set up your preferences.</Text>

                        <View style={{marginTop: 50,}}>
                        <PaginationDots/>
                        </View>

                        <TouchableOpacity onPress={()=> setTimeout(() => {router.replace("/onboarding/currency");}, 500)}
                            className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 30, height:50, width:230}}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',includeFontPadding: false, letterSpacing:2}} className="text-[20px] text-white text-center self-center leading-none">
                                Proceed Next
                            </Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    )
  }

