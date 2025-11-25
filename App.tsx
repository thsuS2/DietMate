/**
 * DietMate - 집중 다이어트 종합 비서 앱
 * 
 * @format
 */

import React, { useEffect, useMemo } from 'react';
import { StatusBar, useColorScheme, View, Alert } from 'react-native';
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

  // 알림 관련 설정값만 추출 (의존성 배열 최적화)
  const notificationSettings = useMemo(() => ({
    notifications: settings.notifications,
    recordReminderTime: settings.recordReminderTime,
    fastingReminderEnabled: settings.fastingReminderEnabled,
    fastingStart: settings.fastingStart,
    fastingDuration: settings.fastingDuration,
  }), [
    settings.notifications,
    settings.recordReminderTime,
    settings.fastingReminderEnabled,
    settings.fastingStart,
    settings.fastingDuration,
  ]);

  useEffect(() => {
    // 초기화 함수
    const initialize = async () => {
      try {
        // 알림 초기화
        await initNotifications();
        
        // 저장된 데이터 로드
        await loadRecords();
        await loadSettings();
        await loadWallet();
      } catch (error) {
        // 초기화 실패 시 사용자에게 알림
        Alert.alert(
          '초기화 오류',
          '앱 초기화 중 문제가 발생했습니다. 앱을 다시 시작해주세요.',
          [{ text: '확인' }]
        );
      }
    };

    initialize();
  }, [loadRecords, loadSettings, loadWallet]);

  // 설정이 로드되면 알림 스케줄링
  useEffect(() => {
    if (notificationSettings.notifications) {
      scheduleAllNotifications(notificationSettings);
    }
  }, [notificationSettings]);

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
