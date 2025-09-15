// hooks/useSummary.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

export const useSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });

  useEffect(() => {
    if (!user?.uid) return;

    const summaryRef = doc(db, "users", user.uid, "summary", "overview");

    const unsubscribe = onSnapshot(summaryRef, (docSnap) => {
      if (docSnap.exists()) {
        setSummary({
          totalIncome: docSnap.data().totalIncome || 0,
          totalExpense: docSnap.data().totalExpense || 0,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return summary;
};
