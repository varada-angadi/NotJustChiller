import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput,KeyboardAvoidingView, Platform,ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts, Oxanium_400Regular } from '@expo-google-fonts/iceland';
import { Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Formik } from "formik";
import { transactionSchema } from "../utils/addTransaction";
import FormDatePicker from "./datePicker";
import CategorySelector from "./addCategory";
import { expenseCategories, incomeCategories } from '../utils/category';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useFinance } from '../context/balanceContext';
import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore";

const AddForm = forwardRef(({ isExpense }, ref) => {
    const [fontsLoaded] = useFonts({
          Oxanium_800ExtraBold,
          Oxanium_400Regular
        });
const formikRef = useRef();
const { addIncome, addExpense, currency } = useFinance();
const symbol = currency?.split(" ")[1] || "";

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      formikRef.current?.resetForm();
    }
  }));
    const auth = getAuth();
    const user = auth.currentUser;

  const handleSubmit = async (values, { resetForm }) => {
  try {
    const transactionData = {
      title: values.title,
      amount: parseFloat(values.amount),
      date: values.date,
      category: values.category,
      description: values.description || "",
      type: isExpense ? "expense" : "income",
      
    };
    await addDoc(collection(db, "users", user.uid, "transactions"), transactionData);
    const overviewRef = doc(db, "users", user.uid, "summary", "overview");
    if (transactionData.type === "income") {
      await updateDoc(overviewRef, {
        totalIncome: increment(transactionData.amount),
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await updateDoc(overviewRef, {
        totalExpense: increment(transactionData.amount),
        lastUpdated: new Date().toISOString(),
      });
    }
    if (transactionData.type === "income") {
      await addIncome(transactionData.amount);
    } else {
      await addExpense(transactionData.amount);
    }

    alert("Transaction saved successfully!");
    resetForm(); // Clear form after save
  } catch (error) {
    console.error("Error saving transaction:", error);
    alert("Something went wrong while saving. Please try again.");
  }
};


    return(
        <SafeAreaView style={{ flex: 1}}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1,}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        

            <Formik innerRef={formikRef} initialValues={{Title:"",Amount:"",date: new Date(),Category:"",Description:""}} validationSchema={transactionSchema} onSubmit={handleSubmit}>
                {({handleChange,handleBlur,handleSubmit,values,errors,touched,setFieldValue}) => (

                    <View>

                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                            <View style={{ width: 350, alignItems: 'flex-start' }}>
                                <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 20,color: '#1C2C21',marginBottom: 6,}}>
                                    Title
                                </Text>
                                <TextInput style={{fontSize:18,height: 45,width: '100%',borderWidth: 2,borderColor: '#8da563',borderRadius: 6,paddingHorizontal: 10,color: '#1C2C21',backgroundColor: 'white',}}
                                placeholder="Enter the Transaction Title" onChangeText={handleChange('title')}value={values.title}onBlur={handleBlur('title')}/>
                                {touched.title && errors.title && (<Text style={{ fontSize: 12, color: 'red', marginTop: 4 }}>{errors.title}</Text>)}
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                            <View style={{ width: 350, alignItems: 'flex-start' }}>
                                <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 20,color: '#1C2C21',marginBottom: 6,}}>
                                    Amount
                                </Text>
                                <TextInput style={{fontSize:18,height: 45,width: '100%',borderWidth: 2,borderColor: '#8da563',borderRadius: 6,paddingHorizontal: 10,color: '#1C2C21',backgroundColor: 'white',}}
                                placeholder= {`${symbol || ""} Enter the Amount`} keyboardType="numeric" onChangeText={handleChange("amount")} value={values.amount} onBlur={handleBlur("amount")} />
                                {touched.amount && errors.amount && (<Text style={{ fontSize: 12, color: 'red', marginTop: 4 }}>{errors.amount}</Text>)}
                            </View>
                        </View>

                    <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                        <View style={{ width: 350, alignItems: 'flex-start' }}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 20,color: '#1C2C21',marginBottom: 6,}}>
                                Date
                            </Text>
                            <FormDatePicker value={values.date} onChange={(val) => {setFieldValue("date", val);}}/>
                            {touched.date && errors.date && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.date}</Text> )}
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                        <View style={{ width: 350, alignItems: 'flex-start' }}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 20,color: '#1C2C21',marginBottom: 6,}}>
                                Category
                            </Text>
                        </View>
                        <CategorySelector label="Category" value={values.category} onChange={(val) => setFieldValue("category", val)}
                        categories={isExpense ? expenseCategories : incomeCategories}/>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                        <View style={{ width: 350, alignItems: 'flex-start' }}>
                            <Text style={{fontFamily: 'Oxanium_400Regular',fontSize: 20,color: '#1C2C21',marginBottom: 6,}}>
                                Description (optional)
                            </Text>
                        <TextInput style={{fontSize:18,height: 80,width: '100%',borderWidth: 2,borderColor: '#8da563',borderRadius: 6,paddingHorizontal: 10,color: '#1C2C21',backgroundColor: 'white',}}
                        multiline textAlignVertical="top" numberOfLines={4} placeholder="Enter the Description" onChangeText={handleChange("description")} value={values.description} onBlur={handleBlur("description")}/>
                        {touched.description && errors.description && <Text className="text-xs mb-2" style={{color:'red'}}>{errors.description}</Text>}
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginVertical: 40 }}>
                        <TouchableOpacity className="bg-[#1c2c21] border-2 border-[#8DA563] rounded-[25px] justify-center items-center" style={{ height: 55, width: 200 }} onPress={handleSubmit}>
                            <Text style={{fontFamily: 'Oxanium_400Regular', includeFontPadding: false, fontSize:25}} className=" text-white text-center leading-none">
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                )}
            </Formik>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            </SafeAreaView>


);});
export default AddForm;