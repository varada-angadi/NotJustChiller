import React, { useState } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,Keyboard} from 'react-native';
import { useFonts, Iceland_400Regular } from '@expo-google-fonts/iceland';
import { Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Formik } from "formik";
import validationSchema from "../../utils/loginSchema";
import Toast from "react-native-toast-message";
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ScrollView } from "react-native-gesture-handler";

export default function Login() {
  const router=useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Iceland_400Regular,
    Oxanium_800ExtraBold,
    Michroma_400Regular
  });

    const handleLogin = async (values) => {
  const { email, password } = values;
  setLoading(true); 

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log("Loading set to true");
    const user = userCredential.user;
    setLoading(false);
    setTimeout(() => { router.replace("/home");}, 200);
    Toast.show({
      type: 'success',
      text1: 'Logged In',
    });

  } catch (error) {
    setLoading(false);
    alert(error.message);
  }
};


  if (!fontsLoaded) return null;

    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1c2c21' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1,}}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1 }}>
      
        {loading && (
  <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  }}>
    <ActivityIndicator size="large" color="#8DA563" />
    <Text style={{
      marginTop: 12,
      color: 'white',
      fontSize: 16,
      fontFamily: 'Michroma_400Regular',
    }}>
      Logging in...
    </Text>
  </View>
)}
            <View style={{height: height+120, width: width,backgroundColor: '#1c2c21',alignItems: 'center'}}>
            <Text style={{top: 120, textAlign:'center', color:'white',fontSize: 60,fontFamily: 'Iceland_400Regular', letterSpacing: 1,}}>notjust</Text>
            <Text style={{top: 105, textAlign: 'center', color: '#8da563',fontFamily: 'Oxanium_800ExtraBold',fontSize: 60,letterSpacing: 1,}}>CH₹LLAR</Text>
            <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 27, marginTop: 200, textAlign: 'center',}} className="text-white">Log into your account</Text>
            
            <View className="w-3/4">
            <Formik initialValues={{email:"",password:""}}  validationSchema={validationSchema}onSubmit={handleLogin}>
              {({handleChange,handleBlur,handleSubmit,values,errors,touched}) => (
                <View className="w-full">
                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 20, marginTop: 30,}} className="text-white">Email</Text>
                  <TextInput 
                  className="h-[38px] border border-[#8da563] w-[350px] text-white" style={{ marginTop:10, borderWidth:2}} 
                  keyboardType="email-address" onChangeText={handleChange("email")} value={values.email} onBlur={handleBlur("email")}/>
                  {touched.email && errors.email && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.email}</Text>}

                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 20, marginTop: 30,}} className="text-white">Password</Text>
                  <View style={{ position: 'relative', marginTop: 10,}}>
                    <TextInput className="h-[38px] border border-[#8da563] w-[350px] text-white pr-10" style={{ borderWidth: 2, paddingRight: 35 }} 
                    secureTextEntry={!showPassword} onChangeText={handleChange("password")} value={values.password} onBlur={handleBlur("password")}/>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, top: 6 }} >
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#8DA563"/>
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.password}</Text>}
                  <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 14, marginTop: 12,}} className="text-white">Forgot Password?</Text>

                <TouchableOpacity 
                onPress={handleSubmit}
                className=" bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20" style={{marginTop: 100, height:50, width:330}}>
                  <Text style={{fontFamily: 'Michroma_400Regular',includeFontPadding: false,}}
                  className="text-[20px] text-white text-center self-center leading-none">
                    LOG IN
                    </Text>
                </TouchableOpacity>
                </View>
                )}
            </Formik>



            <View>
              <TouchableOpacity
              style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',marginTop: 16,}}
              onPress={()=> router.push("/signup")}>
                <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 16,}} className="text-white">Don't have an account?{" "}</Text>
              <Text style={{ fontFamily: 'Michroma_400Regular', fontSize: 16,}} className="text-[#8DA563]">Sign Up</Text>
              </TouchableOpacity>

              
            </View>
            </View>
            </View>
           
</View>
 </TouchableWithoutFeedback>
</KeyboardAvoidingView>
</SafeAreaView>
        
    )
}
