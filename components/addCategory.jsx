import React from 'react';
import { View, Text, TouchableOpacity,Image, Dimensions,StyleSheet } from 'react-native';


export default function CategorySelector({ value, onChange, categories }) {
  return (

    <View>
      <View style={{flexDirection: 'row',flexWrap: 'wrap',gap: 10,justifyContent: 'center',marginHorizontal:5,}}>
        {categories.map((item) => {const isSelected = item.name === value;
          return (

            <TouchableOpacity key={item.name}
              style={[styles.item,{backgroundColor: isSelected ? '#1C2C21' : '#fff',borderColor: isSelected ? '#3b4f2f' : '#8da563',},]}
              onPress={() => onChange(item.name)}
              activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={item.icon} style={{width: 24, height: 24, margin:5,resizeMode: 'contain',}}/>
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>{item.name}</Text>
            </View>
            </TouchableOpacity> );})}
      </View>
    </View>
);}

const styles = StyleSheet.create({
    item: {
    height:40,
    borderWidth: 1.5,
    borderRadius: 12,
    padding:5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    },
    itemText: {
    fontSize: 18,
    fontFamily: 'Oxanium_400Regular',
    color: '#1C2C21',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
  },
});

