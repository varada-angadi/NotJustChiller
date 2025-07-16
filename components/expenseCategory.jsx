import React from 'react';
import { View, Text, Image,FlatList } from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';

const categoryData = [
  {
    id: '1',
    name: 'EatsTreats',
    icon: require('../assets/expense/food.png'),
    amount: 1200,
    color: '#062734',
  },
  {
    id: '2',
    name: 'Shopping',
    icon: require('../assets/expense/shop.png'),
    amount: 700,
    color: '#2D618E',
  },
  {
    id: '3',
    name: 'Transportation',
    icon: require('../assets/expense/transport.png'),
    amount: 400,
    color: '#F2CB08',
  },
  {
    id: '5',
    name: 'UtilityBill',
    icon: require('../assets/expense/bill.png'),
    amount: 800,
    color: '#EF476F',
  },
  {
    id: '6',
    name: 'RentHousing',
    icon: require('../assets/expense/housing.png'),
    amount: 8000,
    color: '#EF476F',
  },
  {
    id: '7',
    name: 'Education',
    icon: require('../assets/expense/edu.png'),
    amount: 1500,
    color: '#EF476F',
  },
  {
    id: '8',
    name: 'Subscription',
    icon: require('../assets/expense/sub.png'),
    amount: 1500,
    color: '#EF476F',
  },
  {
    id: '9',
    name: 'Entertainment',
    icon: require('../assets/expense/ent.png'),
    amount: 5000,
    color: '#EF476F',
  },
  {
    id: '10',
    name: 'GiftsGiving',
    icon: require('../assets/expense/gift.png'),
    amount: 2000,
    color: '#EF476F',
  },
  {
    id: '11',
    name: 'Miscellaneous',
    icon: require('../assets/expense/misc.png'),
    amount: 650,
    color: '#EF476F',
  },
];

export default function CategoryBreakdown() {
    const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
    const sortedData = [...categoryData].sort((a, b) => b.amount / total - a.amount / total
  );

  const renderItem = ({ item }) => {    
    const percentage = ((item.amount / total) * 100).toFixed(1);

    return(
        /* Space between Cards */
    <View style={{marginBottom:20}}>
        {/* Individual Card format */}
        <View className="flex-row items-center justify-between" style={{ padding:10,backgroundColor: '#fff',shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,}}>
            {/* Creating row like structure*/}
            <View className="flex-row items-center">
                {/* Category Icon */}
                <Image source={item.icon} style={{width: 50, height: 50, marginRight:10}}/>
                
                {/* Text and bar one below other */}
                <View>
                <Text style={{fontSize: 25, color: '#1c2c21',marginLeft:15,fontFamily:'Oxanium_400Regular'}}>{item.name}</Text>

                {/* Bar formating */}
                <View style={{height:20, width:220, backgroundColor:'#8DA563',borderRadius: 5,marginLeft:15,marginTop:10,overflow: 'hidden',}}>
                    <View style={[ {height: '100%',borderRadius: 5,},{width: `${percentage}%`,backgroundColor:'#1C2C21',},]}/>
                </View>
                </View>
            </View>

            {/* Amount and percentage */}
            <View>
            <Text style={{fontSize: 25, color: '#1c2c21',fontFamily:'Oxanium_400Regular',color:'#8E2D2D'}}>-₹{item.amount}</Text>
            <Text style={{fontSize: 20,color:'1c2c21',textAlign: 'right',marginTop:5,fontFamily: 'Oxanium_400Regular',zIndex:1}}>{percentage}%</Text>
            </View>
            
        </View>
        

        
    </View>
    );
  };

  return (
    <View style={{paddingHorizontal:20,paddingTop:10}}>
        <FlatList
                data={sortedData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
    </View>
  );
}

