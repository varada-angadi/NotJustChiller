// ExpenseBreakdown.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useFonts, Oxanium_800ExtraBold, Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { expenseCategories } from '../utils/category';
import { useRouter } from 'expo-router';

export default function ExpenseBreakdown() {
  const [transactions, setTransactions] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Oxanium_800ExtraBold,
    Oxanium_400Regular,
  });

  // Fetch expense transactions
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, `users/${auth.currentUser.uid}/transactions`),
      where('type', '==', 'expense')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(list);
    });

    return () => unsubscribe();
  }, []);

  // Match transactions with categories
  const categorizedData = transactions.map((tx) => {
    const category = expenseCategories.find((c) => c.name === tx.category);
    return {
      ...tx,
      icon: category ? category.icon : null,
    };
  });

  // Group totals by category
  const groupedData = categorizedData.reduce((acc, tx) => {
    if (!acc[tx.category]) {
      acc[tx.category] = { ...tx, amount: 0 };
    }
    acc[tx.category].amount += tx.amount;
    return acc;
  }, {});

  const finalData = Object.values(groupedData);
  const total = finalData.reduce((sum, item) => sum + item.amount, 0);
  const sortedData = [...finalData].sort((a, b) => b.amount - a.amount);

  const renderItem = ({ item }) => {
    const percentage = ((item.amount / total) * 100).toFixed(1);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/category/${item.category}`)}
        style={{
          backgroundColor: '#fff',
          padding: 10,
          marginBottom: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          borderRadius: 8,
        }}
      >
        {/* Left side: icon + category + bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: 220 }}>
            {item.icon && <Image source={item.icon} style={{ width: 50, height: 50, marginRight: 10 }} />}
        
        <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 25,
                  color: '#1c2c21',
                  fontFamily: 'Oxanium_400Regular',
                }}
              >
                {item.category}
              </Text>
        
              <View
                style={{
                  height: 20,
                  width: 220,
                  backgroundColor: '#8DA563',
                  borderRadius: 5,
                  marginTop: 10,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: '#1C2C21',
                    borderRadius: 5,
                  }}
                />
              </View>
            </View>
          </View>
        
          {/* Right side: amount + percentage */}
          <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 25,
                color: '#2E7D32',
                fontFamily: 'Oxanium_400Regular',
              }}
            >
              +₹{item.amount}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: '#1c2c21',
                marginTop: 5,
                fontFamily: 'Oxanium_400Regular',
              }}
            >
              {percentage}%
            </Text>
          </View>
        </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}
