import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getFirestore, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { expenseCategories, incomeCategories } from "../../utils/category";
import { useFonts, Oxanium_400Regular } from "@expo-google-fonts/oxanium";
import MonthScroller from "../../components/monthScroller";
import YearScroller from "../../components/yearScoller";
import { useFinance } from "../../context/balanceContext";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function CategoryPage() {
  const { categoryName } = useLocalSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState(months[currentDate.getMonth()]);
  const [userCreationYear, setUserCreationYear] = useState(currentYear);

  const { currency } = useFinance();
  const symbol = currency?.split(" ")[1] || "₹";

  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const [fontsLoaded] = useFonts({ Oxanium_400Regular });

  const isIncome = incomeCategories.some(cat => cat.name === categoryName);
  const transactionType = isIncome ? "income" : "expense";

  // Fetch transactions
  useEffect(() => {
    if (!auth.currentUser) {
      setError("No authenticated user found");
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${auth.currentUser.uid}/transactions`),
      where("category", "==", categoryName),
      where("type", "==", transactionType),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          let jsDate;
          if (data.date?.toDate) jsDate = data.date.toDate();
          else if (data.date?.seconds) jsDate = new Date(data.date.seconds * 1000);
          else jsDate = new Date(data.date || Date.now());

          return {
            ...data,
            id: doc.id,
            amount: Number(data.amount) || 0,
            date: jsDate,
            title: data.title || data.description || data.category,
            category: data.category || "Other",
            description: data.description || "",
          };
        });

        setTransactions(list);

        // Determine earliest year for YearScroller
        const validDates = list.map(tx => tx.date.getTime()).filter(ts => !isNaN(ts));
        const earliestYear = validDates.length ? new Date(Math.min(...validDates)).getFullYear() : currentYear;
        setUserCreationYear(earliestYear);

        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoryName, transactionType]);

  // Handle Month/Period selection
  const handlePeriodSelect = useCallback((monthOrPeriod) => {
    setSelectedPeriod(monthOrPeriod);
  }, []);

  const handleYearSelect = useCallback((year) => {
    setSelectedYear(year);
    // Reset month to current if previously monthly
    if (months.includes(selectedPeriod)) {
      setSelectedPeriod(months[currentDate.getMonth()]);
    }
  }, [selectedPeriod, currentDate]);

  const getJsDate = (date) => (date instanceof Date ? date : new Date(date));

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    return transactions.filter(tx => {
      const date = getJsDate(tx.date);
      if (!(date instanceof Date) || isNaN(date.getTime())) return false;

      if (selectedPeriod === "All Time") return true;
      if (selectedPeriod === "Entire Year") return date.getFullYear() === selectedYear;
      if (selectedPeriod === "Last 6M") return date >= sixMonthsAgo;
      // Monthly by name
      return date.getFullYear() === selectedYear && months[date.getMonth()] === selectedPeriod;
    });
  }, [transactions, selectedYear, selectedPeriod]);

  const totalAmount = useMemo(() => filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0), [filteredTransactions]);

  const renderTransaction = ({ item }) => (
    <View style={styles.txCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.txTitle}>{item.title}</Text>
        {item.description && <Text style={styles.txDescription}>{item.description}</Text>}
        <Text style={styles.txDate}>{item.date.toLocaleDateString()}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.txAmount, { color: isIncome ? "#2E7D32" : "#d32f2f" }]}>
          {isIncome ? "+" : "-"}{symbol}{item.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8DA563" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <Text style={styles.categorySubtitle}>{isIncome ? "Income Category" : "Expense Category"}</Text>
        </View>

        <YearScroller userCreationYear={userCreationYear} selectedYear={selectedYear} onYearSelect={handleYearSelect} />
        <MonthScroller selectedYear={selectedYear} selectedMonth={selectedPeriod} onMonthSelect={handlePeriodSelect} />

        <View style={styles.summaryContainer}>
          <Text style={styles.periodLabel}>
            {selectedPeriod} {selectedPeriod === "All Time" ? "" : selectedYear}
          </Text>
          <Text style={[styles.totalAmountText, { color: isIncome ? "#2E7D32" : "#d32f2f" }]}>
            Total: {symbol}{totalAmount.toLocaleString()}
          </Text>
          <Text style={styles.transactionCount}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No {transactionType} transactions for this period
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, fontFamily: "Oxanium_400Regular", color: "#666" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  errorText: { fontSize: 16, fontFamily: "Oxanium_400Regular", color: "#d32f2f", textAlign: "center", marginBottom: 8 },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 18, fontFamily: "Oxanium_400Regular", color: "#8DA563" },
  categoryTitle: { fontSize: 30, fontFamily: "Oxanium_400Regular", color: "black", marginBottom: 5 },
  categorySubtitle: { fontSize: 16, fontFamily: "Oxanium_400Regular", color: "#666", marginBottom: 10 },
  summaryContainer: { padding: 15, marginVertical: 10, borderRadius: 12, backgroundColor: "#F8F9FA" },
  periodLabel: { fontSize: 14, fontFamily: "Oxanium_400Regular", color: "#666", marginBottom: 5 },
  totalAmountText: { fontSize: 24, fontFamily: "Oxanium_400Regular", textAlign: "center", marginBottom: 5 },
  transactionCount: { fontSize: 14, fontFamily: "Oxanium_400Regular", color: "#666", textAlign: "center" },
  txCard: { backgroundColor: "#fff", padding: 15, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4, borderRadius: 8 },
  txTitle: { fontSize: 18, fontFamily: "Oxanium_400Regular", color: "#333", marginBottom: 2 },
  txDescription: { fontSize: 14, color: "#666", fontFamily: "Oxanium_400Regular", marginBottom: 4 },
  txAmount: { fontSize: 20, fontFamily: "Oxanium_400Regular", fontWeight: "600" },
  txDate: { fontSize: 12, color: "#888", fontFamily: "Oxanium_400Regular" },
  noDataContainer: { padding: 40, alignItems: "center" },
  noDataText: { fontSize: 16, fontFamily: "Oxanium_400Regular", color: "#666", textAlign: "center" },
});
