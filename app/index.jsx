import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Iceland_400Regular } from '@expo-google-fonts/iceland';
import { Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Iceland_400Regular,
    Oxanium_800ExtraBold,
    Michroma_400Regular
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#395942] relative">
      <View className="flex-1 items-center">
        

        <Image
          source={require('../assets/startEle1.png')}
          className="w-[334px] h-[417px] mt-[130px]"
          resizeMode="contain"
        />
        <View className="absolute inset-0 bg-black/40" />

        <Text
          style={{ fontFamily: 'Iceland_400Regular' }}
          className="text-white text-[80px] leading-[80px] tracking-[2px] mt-5 mb-0"
        >
          notjust
        </Text>

        <Text
          style={{ fontFamily: 'Oxanium_800ExtraBold' }}
          className="text-white text-[80px] leading-[80px] tracking-[2px] -mt-6"
        >
          CH₹LLAR
        </Text>

        <Text
          style={{ fontFamily: 'Michroma_400Regular' }}
          className="text-white text-center text-[20px] mt-2"
        >
          From broke to woke — one Chillar at a time.
        </Text>


        <TouchableOpacity onPress={() => {router.push("/login");}}
          className="mt-5 w-[332px] h-[60px] bg-[#1c2c21] border-2 border-[#8DA563]  rounded-[25px] justify-center items-center z-20"
          
        >
          
        <Text
        style={{
        fontFamily: 'Michroma_400Regular',
        includeFontPadding: false,
        }}
        className="text-[24px] text-[#8DA563] text-center self-center leading-none"
        >
            LOG IN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() =>router.push("/signup")}
          className="mt-2.5 w-[332px] h-[60px] bg-[#1c2c21] border-2 border-[#8DA563] rounded-[25px] justify-center items-center z-20"
          
        >
          <Text
            style={{ fontFamily: 'Michroma_400Regular',includeFontPadding: false, }}
            className="text-[24px] text-[#8DA563]"
          >
            SIGN UP
          </Text>
        </TouchableOpacity>

      </View>

      
    </SafeAreaView>
  );
}
