/**
 * DietMate - 집중 다이어트 종합 비서 앱
 * 
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { initNotifications, scheduleAllNotifications } from './src/utils/notify';
import useRecordStore from './src/store/useRecordStore';
import useSettingsStore from './src/store/useSettingsStore';
import useWalletStore from './src/store/useWalletStore';
import { paperTheme } from './src/theme/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  
  // Zustand 스토어 초기화
  const loadRecords = useRecordStore(state => state.loadRecords);
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const loadWallet = useWalletStore(state => state.loadWallet);
  const settings = useSettingsStore(state => state.settings);

  useEffect(() => {
    // 초기화 함수
    const initialize = async () => {
      // 알림 초기화
      await initNotifications();
      
      // 저장된 데이터 로드
      await loadRecords();
      await loadSettings();
      await loadWallet();
    };

    initialize();
  }, [loadRecords, loadSettings, loadWallet]);

  // 설정이 로드되면 알림 스케줄링
  useEffect(() => {
    if (settings.notifications) {
      scheduleAllNotifications(settings);
    }
  }, [settings.notifications, settings.recordReminderTime, settings.fastingReminderEnabled, settings.fastingStart, settings.fastingDuration]);

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
