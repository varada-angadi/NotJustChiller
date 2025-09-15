import React, { useState,useEffect } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import TabButton from './TabButton';
import AddForm from './addForm';

const TabScreen = ({ selectedTab, setSelectedTab }) => {
  const button = [
    { title: 'Income' },
    { title: 'Expense' },
  ];
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TabButton
        button={button}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <View>
        {selectedTab === 0 ? (
          <AddForm isExpense={false} />
        ) : (
          <AddForm isExpense={true} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TabScreen;
