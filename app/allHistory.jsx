import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { incomeCategories, expenseCategories } from '../utils/category';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl, 
  StatusBar,
  TextInput
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const getCategoryData = (type, name) => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories.find(cat => cat.name === name) || {};
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toDateString();
};

const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const dateKey = formatDate(transaction.date);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  
  // Convert to array with dividers
  const result = [];
  Object.keys(grouped)
    .sort((a, b) => new Date(b) - new Date(a)) // Sort dates descending
    .forEach(date => {
      // Add date divider
      result.push({
        id: `divider-${date}`,
        type: 'divider',
        title: date,
        key: `divider-${date}`
      });
      
      // Add transactions for this date
      grouped[date]
        .sort((a, b) => b.date?.toMillis() - a.date?.toMillis())
        .forEach(transaction => {
          result.push(transaction);
        });
    });
  
  return result;
};

export default function AllHistory() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'income', 'expense'

  const fetchTransactions = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(
        collection(db, 'users', userId, 'transactions'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Calculate totals
        const income = fetched
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        const expense = fetched
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
        setTotalIncome(income);
        setTotalExpense(expense);
        
        // Store all transactions for filtering
        setAllTransactions(fetched);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter and search transactions
  const filterTransactions = () => {
    let filtered = [...allTransactions];
    
    // Apply type filter
    if (activeFilter === 'income') {
      filtered = filtered.filter(t => t.type === 'income');
    } else if (activeFilter === 'expense') {
      filtered = filtered.filter(t => t.type === 'expense');
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.title?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
      );
    }
    
    // Group filtered transactions by date
    const groupedData = groupTransactionsByDate(filtered);
    setTransactions(groupedData);
  };

  useEffect(() => {
    const unsubscribe = fetchTransactions();
    return () => {
      if (unsubscribe) {
        unsubscribe;
      }
    };
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [allTransactions, activeFilter, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderTransaction = ({ item }) => {
    if (item.type === 'divider') {
      return (
        <View style={styles.dividerContainer}>
          <Text style={styles.dividerText}>{item.title}</Text>
        </View>
      );
    }

    const categoryData = getCategoryData(item.type, item.category);
    
    return (
      <View style={styles.transactionCard}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Image 
            source={categoryData.icon} 
            style={styles.categoryIcon} 
            resizeMode="contain"
          />
        </View>
        
        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          <Text style={[
            styles.typeText,
            item.type === 'income' ? styles.incomeType : styles.expenseType
          ]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
        
        {/* Amount and Date Container */}
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amountText,
            item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            ₹{item.amount}
          </Text>
          <Text style={styles.dateText}>
            {item.date?.toDate?.()?.toDateString?.() || ''}
          </Text>
        </View>
      </View>
    );
  };

  const getEmptyStateMessage = () => {
    const hasTransactions = allTransactions.length > 0;
    const hasSearch = searchQuery.trim().length > 0;
    const hasFilter = activeFilter !== 'all';
    
    if (!hasTransactions) {
      // No transactions at all
      return {
        title: 'No transactions yet',
        subtitle: 'Start adding your income and expenses to track your financial journey',
        showAction: false
      };
    }
    
    if (hasSearch && hasFilter) {
      // Both search and filter applied
      return {
        title: `No ${activeFilter} transactions match "${searchQuery}"`,
        subtitle: 'Try adjusting your search terms or change the filter',
        showAction: true,
        actionText: 'Clear Search & Filter'
      };
    }
    
    if (hasSearch) {
      // Only search applied
      return {
        title: `No transactions match "${searchQuery}"`,
        subtitle: 'Try different keywords or check your spelling',
        showAction: true,
        actionText: 'Clear Search'
      };
    }
    
    if (hasFilter) {
      // Only filter applied
      return {
        title: `No ${activeFilter} transactions found`,
        subtitle: `You haven't added any ${activeFilter} transactions yet`,
        showAction: true,
        actionText: 'Show All Transactions'
      };
    }
    
    // Fallback (shouldn't reach here)
    return {
      title: 'No transactions found',
      subtitle: 'Something went wrong. Try refreshing the page',
      showAction: false
    };
  };

  const handleEmptyStateAction = () => {
    const hasSearch = searchQuery.trim().length > 0;
    const hasFilter = activeFilter !== 'all';
    
    if (hasSearch && hasFilter) {
      // Clear both search and filter
      setSearchQuery('');
      setActiveFilter('all');
    } else if (hasSearch) {
      // Clear only search
      setSearchQuery('');
    } else if (hasFilter) {
      // Clear only filter
      setActiveFilter('all');
    }
  };

  const renderEmptyState = () => {
    const emptyMessage = getEmptyStateMessage();
    
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
        </View>
        <Text style={styles.emptyText}>{emptyMessage.title}</Text>
        <Text style={styles.emptySubtext}>{emptyMessage.subtitle}</Text>
        
        {emptyMessage.showAction && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleEmptyStateAction}
          >
            <Text style={styles.clearButtonText}>{emptyMessage.actionText}</Text>
          </TouchableOpacity>
        )}
        
        {/* Show helpful stats when no transactions exist */}
        {allTransactions.length === 0 && (
          <View style={styles.helpfulTips}>
            <Text style={styles.tipsTitle}>Get started by adding:</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>💰</Text>
              <Text style={styles.tipText}>Income transactions (salary, freelance, etc.)</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>💸</Text>
              <Text style={styles.tipText}>Expense transactions (food, transport, etc.)</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      
      {/* Header */}
      <View>
        <Text style={{marginTop:20,marginLeft:20, fontFamily:'Oxanium_400Regular',fontSize:30}}>
          Transaction History
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions by title or category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter Buttons */}
      <View className='flex-row justify-start mt-5'>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilterButton
          ]}
          onPress={() => handleFilterPress('all')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'all' && styles.activeFilterButtonText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            activeFilter === 'income' && styles.activeFilterButton
          ]}
          onPress={() => handleFilterPress('income')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'income' && styles.activeFilterButtonText
          ]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            activeFilter === 'expense' && styles.activeFilterButton
          ]}
          onPress={() => handleFilterPress('expense')}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === 'expense' && styles.activeFilterButtonText
          ]}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {transactions.filter(item => item.type !== 'divider').length} transactions
          {activeFilter !== 'all' && ` (${activeFilter})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id || item.key}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContainer,
          transactions.length === 0 && styles.emptyListContainer
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeFilterButton: {
    backgroundColor: '#1c2c21',
  },
  filterButtonText: {
    color: '#666',
    fontFamily: 'Oxanium_400Regular',
    fontSize: 16,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  resultsContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Oxanium_400Regular',
  },
  clearButton: {
    marginTop: 15,
    backgroundColor: '#1c2c21',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    fontFamily: 'Oxanium_400Regular',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Oxanium_400Regular',
  },
  dividerContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  dividerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Oxanium_400Regular',
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 16,
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '500',
    marginBottom: 2,
  },
  incomeType: {
    color: '#4CAF50',
  },
  expenseType: {
    color: '#f44336',
  },
  categoryText: {
    fontSize: 20,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 22,
    fontFamily: 'Oxanium_400Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#f44336',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Oxanium_400Regular',
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  helpfulTips: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Oxanium_400Regular',
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Oxanium_400Regular',
    color: '#666',
    flex: 1,
  },
});