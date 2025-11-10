import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WaterRecordScreen from './WaterRecordScreen';
import FastingScreen from '../Fasting/FastingScreen';

// 임시 화면들 (추후 구현)
const MealRecordScreen = () => (
  <View style={styles.tempScreen}>
    <Text style={styles.tempText}>🍽️ 식단 기록 (준비 중)</Text>
  </View>
);

const ExerciseRecordScreen = () => (
  <View style={styles.tempScreen}>
    <Text style={styles.tempText}>🏃 운동 기록 (준비 중)</Text>
  </View>
);

const WeightRecordScreen = () => (
  <View style={styles.tempScreen}>
    <Text style={styles.tempText}>⚖️ 몸무게 기록 (준비 중)</Text>
  </View>
);

const MemoRecordScreen = () => (
  <View style={styles.tempScreen}>
    <Text style={styles.tempText}>📝 메모 (준비 중)</Text>
  </View>
);

const Tab = createMaterialTopTabNavigator();

const RecordScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#666',
        tabBarIndicatorStyle: {
          backgroundColor: '#6200EE',
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tab.Screen 
        name="Water" 
        component={WaterRecordScreen}
        options={{ title: '💧 수분' }}
      />
      <Tab.Screen 
        name="Meal" 
        component={MealRecordScreen}
        options={{ title: '🍽️ 식단' }}
      />
      <Tab.Screen 
        name="Exercise" 
        component={ExerciseRecordScreen}
        options={{ title: '🏃 운동' }}
      />
      <Tab.Screen 
        name="Weight" 
        component={WeightRecordScreen}
        options={{ title: '⚖️ 몸무게' }}
      />
      <Tab.Screen 
        name="Memo" 
        component={MemoRecordScreen}
        options={{ title: '📝 메모' }}
      />
      <Tab.Screen 
        name="Fasting" 
        component={FastingScreen}
        options={{ title: '⏰ 단식' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tempScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  tempText: {
    fontSize: 18,
    color: '#666',
  },
});

export default RecordScreen;
