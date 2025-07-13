import React, { useState,useEffect } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import TabButton from './TabButton';

const TabScreen = ({defaultTab }) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab ?? 0);
  useEffect(() => {
    setSelectedTab(defaultTab);
  }, [defaultTab]);
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
      <View
        style={{
          flex: 1,
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      </View>
    </SafeAreaView>
  );
};

export default TabScreen;
