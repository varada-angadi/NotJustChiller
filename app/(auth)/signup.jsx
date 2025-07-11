import React from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { useFonts, Iceland_400Regular } from '@expo-google-fonts/iceland';
import { Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Formik } from "formik";
import validationSchema from "../../utils/signupSchema"

export default function Login() {
  const router=useRouter();
  const handleSignup = () => {}
  const { height, width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    Iceland_400Regular,
    Oxanium_800ExtraBold,
    Michroma_400Regular
  });
  if (!fontsLoaded) return null;
    return(
          <SafeAreaView>
            <View style={{height: height+120, width: width,backgroundColor: '#1c2c21',alignItems: 'center'}}>
            <Text style={{top: 120, textAlign:'center', color:'white',fontSize: 60,fontFamily: 'Iceland_400Regular', letterSpacing: 1,}}>notjust</Text>
            <Text style={{top: 105, textAlign: 'center', color: '#8da563',fontFamily: 'Oxanium_800ExtraBold',fontSize: 60,letterSpacing: 1,}}>CH₹LLAR</Text>
            <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 27, marginTop: 200, textAlign: 'center',}} className="text-white">Create your new account</Text>
            
            <View className="w-3/4">
            <Formik initialValues={{name:"", email:"",password:""}}  validationSchema={validationSchema} onSubmit={handleSignup}>
              {({handleChange,handleBlur,handleSubmit,values,errors,touched}) => (
                <View className="w-full">
                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 20, marginTop: 30,}} className="text-white">Name</Text>
                  <TextInput 
                  className="h-[38px] border border-[#8da563] w-[350px] text-white" style={{ marginTop:10, borderWidth:2}} 
                  onChangeText={handleChange("name")} value={values.name} onBlur={handleBlur("name")}/>
                  {touched.name && errors.name && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.name}</Text>}

                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 20, marginTop: 10,}} className="text-white">Email</Text>
                  <TextInput 
                  className="h-[38px] border border-[#8da563] w-[350px] text-white" style={{ marginTop:10, borderWidth:2}} 
                  keyboardType="email-address" onChangeText={handleChange("email")} value={values.email} onBlur={handleBlur("email")}/>
                  {touched.email && errors.email && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.email}</Text>}

                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 20, marginTop: 10,}} className="text-white">Password</Text>
                  <TextInput 
                  className="h-[38px] border border-[#8da563] w-[350px] text-white" style={{marginTop:10, borderWidth:2}} 
                  secureTextEntry onChangeText={handleChange("password")} value={values.password} onBlur={handleBlur("password")}/>
                  {touched.password && errors.password && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.password}</Text>}

                <TouchableOpacity 
                onPress={handleSubmit}
                className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 100, height:50, width:330}}>
                  <Text style={{fontFamily: 'Michroma_400Regular',includeFontPadding: false,}}
                  className="text-[20px] text-white text-center self-center leading-none">
                    SIGN UP
                    </Text>
                </TouchableOpacity>
                </View>
                )}
            </Formik>

            <View>
              <TouchableOpacity
              style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',marginTop: 16,}}
              onPress={()=> router.push("/login")}>
                <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 16,}} className="text-white">Already have an account?{" "}</Text>
              <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 16,}} className="text-[#8DA563]">Log In</Text>
              </TouchableOpacity>

              
            </View>
            </View>
            </View>
          </SafeAreaView>
        
    )
}
