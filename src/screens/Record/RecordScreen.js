import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WaterRecordScreen from './WaterRecordScreen';
import MealRecordScreen from './MealRecordScreen';
import ExerciseRecordScreen from './ExerciseRecordScreen';
import WeightRecordScreen from './WeightRecordScreen';
import MemoRecordScreen from './MemoRecordScreen';
import FastingScreen from '../Fasting/FastingScreen';

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

const styles = StyleSheet.create({});

export default RecordScreen;
