import { create } from 'zustand';
import { loadSettings, saveSettings } from '../utils/storage';

/**
 * 설정 관리용 Zustand 스토어
 * 간헐적 단식, 알림, 다이어트 기간 등 관리
 */
const useSettingsStore = create((set, get) => ({
  // 상태
  settings: {
    // 간헐적 단식
    fastingStart: '20:00', // 단식 시작 시간
    fastingDuration: 16, // 단식 시간 (시간 단위)
    
    // 알림
    notifications: true,
    recordReminderTime: '22:00', // 기록 알림 시간
    fastingReminderEnabled: true,
    
    // 다이어트 기간
    dietStartDate: null, // YYYY-MM-DD
    dietEndDate: null, // YYYY-MM-DD
    targetWeight: null,
    
    // 사용자 정보
    currentWeight: null,
    height: null,
    age: null,
    gender: null,
    
    // 목표
    dailyWaterGoal: 2000, // ml
    dailyStepsGoal: 10000,
    
    // 수분 섭취 숏컷
    waterShortcuts: [
      { label: '컵', amount: 200 },
      { label: '텀블러', amount: 500 },
    ],
  },
  isLoading: false,

  // 초기 데이터 로드
  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await loadSettings();
      set({ settings: { ...get().settings, ...settings }, isLoading: false });
    } catch (error) {
      console.error('설정 로드 실패:', error);
      set({ isLoading: false });
    }
  },

  // 설정 업데이트
  updateSettings: async (newSettings) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 간헐적 단식 시간 설정
  setFastingTime: async (startTime, duration) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      fastingStart: startTime,
      fastingDuration: duration,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 알림 설정
  setNotificationSettings: async (notificationSettings) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      ...notificationSettings,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 다이어트 기간 설정
  setDietPeriod: async (startDate, endDate, targetWeight) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      dietStartDate: startDate,
      dietEndDate: endDate,
      targetWeight,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 사용자 정보 설정
  setUserInfo: async (userInfo) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      ...userInfo,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 수분 섭취 숏컷 설정
  setWaterShortcuts: async (shortcuts) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      waterShortcuts: shortcuts,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },

  // 일일 수분 목표 설정
  setDailyWaterGoal: async (goal) => {
    const { settings } = get();
    const updatedSettings = {
      ...settings,
      dailyWaterGoal: goal,
    };
    
    set({ settings: updatedSettings });
    await saveSettings(updatedSettings);
  },
}));

export default useSettingsStore;

