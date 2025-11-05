import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage 헬퍼 함수들
 */

// Storage Keys
const KEYS = {
  RECORDS: '@DietMate:records',
  SETTINGS: '@DietMate:settings',
  WALLET: '@DietMate:wallet',
};

/**
 * 기록 데이터 로드
 */
export const loadRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECORDS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('기록 로드 실패:', error);
    return {};
  }
};

/**
 * 기록 데이터 저장
 */
export const saveRecords = async (records) => {
  try {
    await AsyncStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('기록 저장 실패:', error);
    return false;
  }
};

/**
 * 설정 데이터 로드
 */
export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('설정 로드 실패:', error);
    return {};
  }
};

/**
 * 설정 데이터 저장
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('설정 저장 실패:', error);
    return false;
  }
};

/**
 * 가계부 데이터 로드
 */
export const loadWallet = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WALLET);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('가계부 로드 실패:', error);
    return [];
  }
};

/**
 * 가계부 데이터 저장
 */
export const saveWallet = async (wallet) => {
  try {
    await AsyncStorage.setItem(KEYS.WALLET, JSON.stringify(wallet));
    return true;
  } catch (error) {
    console.error('가계부 저장 실패:', error);
    return false;
  }
};

/**
 * 모든 데이터 삭제 (앱 초기화)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.RECORDS, KEYS.SETTINGS, KEYS.WALLET]);
    return true;
  } catch (error) {
    console.error('데이터 삭제 실패:', error);
    return false;
  }
};

/**
 * 특정 키의 데이터 삭제
 */
export const clearData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('데이터 삭제 실패:', error);
    return false;
  }
};

export default {
  loadRecords,
  saveRecords,
  loadSettings,
  saveSettings,
  loadWallet,
  saveWallet,
  clearAllData,
  clearData,
  KEYS,
};

