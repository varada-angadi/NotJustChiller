import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../context/CurrencyContext';

const currencies = ['INR ₹', 'USD $', 'EUR €', 'JPY ¥', 'GBP £'];

const CurrencyPicker = ({ selectedCurrency, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { fetchCurrency } = useCurrency();

  const handleSelect = async (currency) => {
    onSelect(currency); // update parent state
    setOpen(false);

    if (!user) return;

    try {
      const currencySymbol = currency.split(' ')[1]; // Extract symbol (e.g., '₹')
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          preferences: {
            currency: currencySymbol,
          },
        },
        { merge: true }
      );
      await fetchCurrency(); // update context
      console.log('✅ Currency saved successfully:', currencySymbol);
    } catch (error) {
      console.error('❌ Error saving currency:', error);
    }
  };

  return (
    <View style={{ marginTop: 10, width: 250, position: 'relative', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          backgroundColor: '#1c2c21',
          borderWidth: 2,
          width: 150,
          height: 50,
          borderColor: '#8da563',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>
          {selectedCurrency || 'Select Currency'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#1c2c21',
            marginTop: 50,
            borderWidth: 2,
            width: 150,
            borderColor: '#8da563',
            overflow: 'hidden',
            zIndex: 9999,
            maxHeight: 150,
            elevation: 5,
          }}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {currencies.map((currency, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(currency)}
                style={{
                  padding: 12,
                  borderBottomWidth: index !== currencies.length - 1 ? 1 : 0,
                  borderColor: '#8da563',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>{currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CurrencyPicker;
