import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

// Create context
export const FinanceContext = createContext();

// Provider
export const FinanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      const uid = getAuth().currentUser?.uid;
      if (!uid) return;

      try {
        const docRef = doc(db, "users", uid, "preferences", "startup");
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setBalance(data.balance || 0);
          setCurrency(data.currency || "₹");
          console.log("📥 Initial fetched balance:", data.balance || 0);
        }
      } catch (error) {
        console.error("❌ Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // ✅ Add Income Function
  const addIncome = async (amount) => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    try {
      const ref = doc(db, "users", uid, "preferences", "startup");
      const snap = await getDoc(ref);
      const currentBalance = snap.data()?.balance || 0;
      const newBalance = currentBalance + amount;
      setBalance(newBalance);
      console.log("✅ Updated local balance:", newBalance);


      await setDoc(ref, { balance: newBalance }, { merge: true });
      setBalance(newBalance); // update local state
    } catch (error) {
      console.error("❌ Failed to add income:", error);
    }
  };

  // ✅ Add Expense Function
  const addExpense = async (amount) => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    try {
      const ref = doc(db, "users", uid, "preferences", "startup");
      const snap = await getDoc(ref);
      const currentBalance = snap.data()?.balance || 0;
      const newBalance = currentBalance - amount;
      setBalance(newBalance);
      console.log("✅ Updated local balance:", newBalance);


      await setDoc(ref, { balance: newBalance }, { merge: true });
      setBalance(newBalance); // update local state
    } catch (error) {
      console.error("❌ Failed to add expense:", error);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        balance,
        currency,
        loading,
        addIncome,
        addExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Hook to access
export const useFinance = () => useContext(FinanceContext);
