import { ScrollView, Text,View, StyleSheet, Image} from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import { FlatList } from 'react-native';

const monthScroll=[
  {
    id:'1',
    month:'Jan',
  },
  {
    id:'2',
    month:'Feb',
  },
  {
    id:'3',
    month:'Mar',
  },
  {
    id:'4',
    month:'Apr',
  },
  {
    id:'5',
    month:'May',
  },
  {
    id:'6',
    month:'Jun',
  },
  {
    id:'7',
    month:'Jul',
  },
  {
    id:'8',
    month:'Aug',
  },
  {
    id:'9',
    month:'Sept',
  },
  {
    id:'10',
    month:'Oct',
  },
  {
    id:'11',
    month:'Nov',
  },
  {
    id:'12',
    month:'Dec',
  },
];

export default function MonthScroller() {

    const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

    const renderItem=({item})=>(
  <View className="flex-row justify-between" style={{ margin:8,paddingLeft:20 , paddingRight:20,paddingTop:8,paddingBottom:8, borderRadius:25, backgroundColor:"#1C2C21"}}>
    <Text style={{color:"white", fontFamily:"Oxanium_400Regular", fontSize:15}}>{item.month}</Text>
  </View>
);

    return (
      <View style={{paddingTop:10}}>
        <FlatList
          horizontal
          data={monthScroll}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }

