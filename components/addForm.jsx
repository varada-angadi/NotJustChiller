import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ImageBackground, TextInput,KeyboardAvoidingView, Platform,ScrollView } from 'react-native';
import { useFonts, Oxanium_400Regular } from '@expo-google-fonts/iceland';
import { Oxanium_800ExtraBold } from '@expo-google-fonts/oxanium';
import { Formik } from "formik";
import { transactionSchema } from "../utils/addExIn";
import FormDatePicker from "./datePicker";
import CategorySelector from "./addCategory";
import { expenseCategories, incomeCategories } from '../utils/category';


const AddForm = forwardRef(({ isExpense }, ref) => {
    const [fontsLoaded] = useFonts({
          Oxanium_800ExtraBold,
          Oxanium_400Regular
        });
const formikRef = useRef();

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      formikRef.current?.resetForm();
    }
  }));
    const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
  };

    return(
        <KeyboardAvoidingView behavior="padding">

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
                                placeholder="₹ Enter the Amount" onChangeText={handleChange("amount")} value={values.amount} onBlur={handleBlur("amount")} />
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
        </KeyboardAvoidingView>


);});
export default AddForm;