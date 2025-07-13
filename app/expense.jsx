import { ScrollView, Text,View, StyleSheet, Image} from 'react-native';
import DonutChartWithLabels from '../components/expenseChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useFonts, Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Oxanium_400Regular } from '@expo-google-fonts/oxanium';
import RNPickerSelect from 'react-native-picker-select';
import MonthScroller from '../components/monthScroller';
import Dropdown from '../components/dropDown';
import CategoryBreakdown from '../components/categoryBreakdown';


const categoryData = [
  {
    name: 'Eats',
    icon: require('../assets/expense/food.png'), // replace with your actual image paths
    amount: 360,
    color: '#8DA563',
  },
  {
    name: 'Shopping',
    icon: require('../assets/expense/shop.png'),
    amount: 250,
    color: '#FFD166',
  },
  {
    name: 'Transport',
    icon: require('../assets/expense/transport.png'),
    amount: 110,
    color: '#A6D1E6',
  },
  {
    name: 'Health',
    icon: require('../assets/expense/health.png'),
    amount: 80,
    color: '#EF476F',
  },
];

export default function Expense() {

  const [fontsLoaded] = useFonts({
      Oxanium_800ExtraBold,
      Oxanium_400Regular
    });

const total=200;

  return (
    <SafeAreaView className="flex-1" style={{backgroundColor:"white", padding:10}}>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    <ScrollView showsVerticalScrollIndicator={false}>

     {/* Page Title */}
      <View className="flex-1">
        <Text style={{color:'black',fontSize:30, fontFamily:'Oxanium_400Regular',}} >Track Your Expense</Text>
      </View>

     {/* Month Scroller */}
      <View>
        <MonthScroller/>
      </View>

     {/* Sub-Page Title and Dropdown */}
      <View>
        <Dropdown></Dropdown>
      </View>

     {/* Expense Donut chart */}
      <View>
      <DonutChartWithLabels/>
      </View>

     {/* Categorical Analysis */}
     <View>
        <CategoryBreakdown/>
     </View>



      </ScrollView>
      </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1c2c21',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 6,
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    color: '#1c2c21',
    fontWeight: '500',
  },
  barWrapper: {
    height: 8,
    width: '40%',
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
    marginRight: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  percentageText: {
    width: 50,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1c2c21',
  },
});
