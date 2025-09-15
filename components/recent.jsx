import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // make sure you have correct imports
import { incomeCategories, expenseCategories } from '../utils/category';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

const getCategoryData = (type, name) => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories.find(cat => cat.name === name) || {};
};


export default function RecentActivitySection() {

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('date', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetched);
    });

    return unsubscribe;
  }, []);


  const renderItem = ({ item }) => {
    const categoryData = getCategoryData(item.type, item.category);
    return(
    
    <View className="flex-row justify-between items-stretch" 
    style={{backgroundColor: '#fff' , padding: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,}}>
        <View className="justify-center">
        <Image source={categoryData.icon} style={{padding:10, width: 36, height: 36, borderRadius: 8,justifyContent: 'center',}} resizeMode="contain"/>
        </View>

        <View className="flex-1 " style={{marginLeft:20, marginBottom:20}}>
            <Text style={[styles.type,item.type === 'income' ? styles.income : styles.expense,]}>{item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}</Text>
            <Text style={{fontSize: 24,fontFamily: 'Oxanium_400Regular', marginBottom:3}}>{item.category}</Text>
            <Text style={{fontSize: 18,fontFamily: 'Oxanium_400Regular',}}>{item.title}</Text>
        </View>

        <View>
            <Text style={[styles.type,item.type === 'income' ? styles.income : styles.expense, {textAlign:'center',fontSize: 25,fontFamily: 'Oxanium_400Regular', marginTop:12}]}>₹{item.amount}</Text>
            <Text style={{textAlign:'center',fontSize: 14,fontFamily: 'Oxanium_400Regular',marginTop:5}}> {item.date?.toDate?.().toDateString?.() || ''}</Text>
        </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  income: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: 'green',
  },
  expense: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: 'red',
  },
});
