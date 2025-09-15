import { Slot,useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import "../global.css";
import { CurrencyProvider } from "../context/CurrencyContext";
import { AuthProvider } from "../hooks/useAuth";
import { UserInfoProvider } from "../context/userInfo";
import { doc, getDoc } from 'firebase/firestore'; // Make sure these are imported
import { db } from '../config/firebase';
import { FinanceProvider } from "../context/balanceContext";

export default function RootLayout() {
  const router = useRouter(); // ✅ HOOK 1
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ HOOK 2
  const [user, setUser] = useState(null); // ✅ HOOK 3

  // ✅ HOOK 4 - Called every render, not conditionally
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  // ✅ HOOK 5 - Must not be inside `if`
 useEffect(() => {
  if (!checkingAuth) {
    if (user) {
      setTimeout(() => {    
      router.replace("/home");}, 200);
    }  
    else {
    setTimeout(() => {
    router.replace("/");}, 200);
    }}}, [user, checkingAuth]);


  // ✅ Only return here (no hooks after this)
  if (checkingAuth) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider> {/* ✅ Wrap here */}
        <UserInfoProvider>
        <CurrencyProvider>
          <FinanceProvider>
          <Stack screenOptions={{ animation: 'slide_from_right', gestureEnabled: true, headerShown: false }} />
        </FinanceProvider>
        </CurrencyProvider>
        </UserInfoProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
