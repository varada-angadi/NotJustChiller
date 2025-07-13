
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const categoryImages = {
  EatsTreats: require('../assets/expense/food.png'),
  Transport: require('../assets/expense/transport.png'),
  RentHousing:require('../assets/expense/housing.png'),
  Education:require('../assets/expense/edu.png'),
  Subscription:require('../assets/expense/sub.png'),
  Shopping:require('../assets/expense/shop.png'),
  Entertainment:require('../assets/expense/ent.png'),
  Health:require('../assets/expense/health.png'),
  UtilityBill:require('../assets/expense/bill.png'),
  GiftsGiving:require('../assets/expense/gift.png'),
  Miscellaneous:require('../assets/expense/misc.png'),
  Expense:require('../assets/expense/expense.png'),

  Internship:require('../assets/income/intern.png'),
  Salary:require('../assets/income/salary.png'),
  Reward:require('../assets/income/reward.png'),
  Freelancing:require('../assets/income/freelanch.png'),
  Returns:require('../assets/income/return.png'),
  Income:require('../assets/income/income.png'),
  
};

const recentTransactions = [
  {
    id: '1',
    type: 'Income',
    category: 'Freelancing',
    label: 'Client Payment',
    amount: 3200,
    date: 'Jul 10, 2025',
  },
  {
    id: '2',
    type: 'Expense',
    category: 'EatsTreats',
    label: 'Groceries',
    amount: 850,
    date: 'Jul 9, 2025',
  },
  {
    id: '3',
    type: 'Expense',
    category: 'Entertainment',
    label: 'Netflix',
    amount: 199,
    date: 'Jul 8, 2025',
  },
];

export default function RecentActivitySection() {
  const renderItem = ({ item }) => (
    
    <View className="flex-row justify-between items-stretch" 
    style={{backgroundColor: '#fff' , padding: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,}}>
        <View className="justify-center">
        <Image source={categoryImages[item.category]} style={{padding:10, width: 36, height: 36, borderRadius: 8,justifyContent: 'center',}} resizeMode="contain"/>
        </View>

        <View className="flex-1 " style={{marginLeft:20, marginBottom:20}}>
            <Text style={[styles.type,item.type === 'Income' ? styles.income : styles.expense,]}>{item.type}</Text>
            <Text style={{fontSize: 25,fontFamily: 'Oxanium_400Regular', marginBottom:3}}>{item.category}</Text>
            <Text style={{fontSize: 18,fontFamily: 'Oxanium_400Regular',}}>{item.label}</Text>
        </View>

        <View>
            <Text style={{textAlign:'center',fontSize: 25,fontFamily: 'Oxanium_400Regular',color: '#4CAF50', marginTop:12}}>₹{item.amount}</Text>
            <Text style={{textAlign:'center',fontSize: 14,fontFamily: 'Oxanium_400Regular',marginTop:5}}>{item.date}</Text>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recentTransactions}
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
    fontSize: 15,
    fontFamily: 'Oxanium_400Regular',
    color: '#4CAF50',
  },
  expense: {
    fontSize: 15,
    fontFamily: 'Oxanium_400Regular',
    color: '#E53935',
  },
});
