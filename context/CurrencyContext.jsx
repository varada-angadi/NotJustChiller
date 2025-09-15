import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [loading, setLoading] = useState(true);


  const fetchCurrency = async () => {
  if (user) {
    setLoading(true);
    try {
      const startupRef = doc(db, 'users', user.uid, 'preferences', 'startup');
      const docSnap = await getDoc(startupRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrencySymbol(data?.currency || '₹');
      } else {
        setCurrencySymbol('₹');
      }
    } catch (error) {
      console.log('Error fetching currency:', error);
      setCurrencySymbol('₹');
    } finally {
      setLoading(false);
    }
  } else {
    setCurrencySymbol('₹');
  }
};


  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrency();
    };
    fetchData();
  }, [user]); // ✅ Correct use of async inside useEffect

  return (
    <CurrencyContext.Provider value={{ currencySymbol, setCurrencySymbol, fetchCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
