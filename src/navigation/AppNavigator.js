import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import RecordScreen from '../screens/Record/RecordScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';
import CategorySettingsScreen from '../screens/Wallet/CategorySettingsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const WalletStack = createNativeStackNavigator();

// Wallet Stack Navigator
const WalletStackNavigator = () => {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen 
        name="WalletMain" 
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen 
        name="CategorySettings" 
        component={CategorySettingsScreen}
        options={{ 
          title: '카테고리 관리',
          headerTintColor: colors.primary,
        }}
      />
    </WalletStack.Navigator>
  );
};

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
              case 'Wallet':
                iconName = focused ? 'wallet' : 'wallet-outline';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
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
          name="Wallet" 
          component={WalletStackNavigator} 
          options={{ 
            title: '가계부',
            headerShown: false,
          }}
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

