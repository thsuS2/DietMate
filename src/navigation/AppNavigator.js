import React from 'react';
import { View } from 'react-native';
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
import AssetManagementScreen from '../screens/Wallet/AssetManagementScreen';
import RecurringTransactionsScreen from '../screens/Wallet/RecurringTransactionsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const WalletStack = createNativeStackNavigator();

// Wallet Stack Navigator
const WalletStackNavigator = () => {
  return (
    <WalletStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
      }}
    >
      <WalletStack.Screen 
        name="WalletMain" 
        component={WalletScreen}
        options={({ navigation }) => ({
          title: '가계부',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon.Button
                name="repeat"
                size={24}
                color={colors.primary}
                backgroundColor="transparent"
                onPress={() => navigation.navigate('RecurringTransactions')}
                iconStyle={{ marginRight: 0 }}
              />
              <Icon.Button
                name="cog"
                size={24}
                color={colors.primary}
                backgroundColor="transparent"
                onPress={() => navigation.navigate('CategorySettings')}
                iconStyle={{ marginRight: 0 }}
              />
            </View>
          ),
        })}
      />
      <WalletStack.Screen 
        name="CategorySettings" 
        component={CategorySettingsScreen}
        options={{ 
          title: '카테고리 관리',
        }}
      />
      <WalletStack.Screen
        name="RecurringTransactions"
        component={RecurringTransactionsScreen}
        options={{
          title: '반복 거래 관리',
        }}
      />
      <WalletStack.Screen 
        name="AssetManagement" 
        component={AssetManagementScreen}
        options={{ 
          title: '자산 관리',
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

