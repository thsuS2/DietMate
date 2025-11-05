import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens (추후 구현)
import HomeScreen from '../screens/Home/HomeScreen';
import RecordScreen from '../screens/Record/RecordScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import FastingScreen from '../screens/Fasting/FastingScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Record':
                iconName = focused ? 'pencil' : 'pencil-outline';
                break;
              case 'Stats':
                iconName = focused ? 'chart-line' : 'chart-line-variant';
                break;
              case 'Fasting':
                iconName = focused ? 'clock' : 'clock-outline';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200EE',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '홈' }}
        />
        <Tab.Screen 
          name="Record" 
          component={RecordScreen} 
          options={{ title: '기록' }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{ title: '통계' }}
        />
        <Tab.Screen 
          name="Fasting" 
          component={FastingScreen} 
          options={{ title: '단식' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: '설정' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

