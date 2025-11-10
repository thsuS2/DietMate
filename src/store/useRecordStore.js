import { create } from 'zustand';
import { loadRecords, saveRecords } from '../utils/storage';

/**
 * 기록 관리용 Zustand 스토어
 * 식단, 운동, 몸무게, 수분, 메모 관리
 */
const useRecordStore = create((set, get) => ({
  // 상태
  records: {}, // { "2025-11-05": { meals: [], exercise: {}, weight: 0, water: 0, memo: "" } }
  isLoading: false,

  // 초기 데이터 로드
  loadRecords: async () => {
    set({ isLoading: true });
    try {
      const records = await loadRecords();
      set({ records, isLoading: false });
    } catch (error) {
      console.error('기록 로드 실패:', error);
      set({ isLoading: false });
    }
  },

  // 식단 추가
  addMeal: async (date, meal) => {
    const { records } = get();
    const dateRecords = records[date] || { meals: [], exercise: null, weight: null, water: 0, memo: '' };
    
    const updatedRecords = {
      ...records,
      [date]: {
        ...dateRecords,
        meals: [...dateRecords.meals, meal],
      },
    };

    set({ records: updatedRecords });
    await saveRecords(updatedRecords);
  },

  // 운동 기록
  addExercise: async (date, exercise) => {
    const { records } = get();
    const dateRecords = records[date] || { 
      meals: [], 
      exercises: [],
      weight: null, 
      weightHistory: [],
      water: 0, 
      waterHistory: [],
      memo: '' 
    };
    
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updatedRecords = {
      ...records,
      [date]: {
        ...dateRecords,
        exercises: [
          ...(dateRecords.exercises || []),
          {
            ...exercise,
            time: timeString,
            timestamp: now.toISOString(),
          },
        ],
      },
    };

    set({ records: updatedRecords });
    await saveRecords(updatedRecords);
  },

  // 몸무게 기록
  addWeight: async (date, weight) => {
    const { records } = get();
    const dateRecords = records[date] || { 
      meals: [], 
      exercise: null, 
      weight: null, 
      weightHistory: [],
      water: 0, 
      waterHistory: [],
      memo: '' 
    };
    
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updatedRecords = {
      ...records,
      [date]: {
        ...dateRecords,
        weight: parseFloat(weight),
        weightHistory: [
          ...(dateRecords.weightHistory || []),
          {
            time: timeString,
            weight: parseFloat(weight),
            timestamp: now.toISOString(),
          },
        ],
      },
    };

    set({ records: updatedRecords });
    await saveRecords(updatedRecords);
  },

  // 수분 추가 (1컵 = 200ml)
  addWater: async (date, amount = 200, label = '') => {
    const { records } = get();
    const dateRecords = records[date] || { 
      meals: [], 
      exercise: null, 
      weight: null, 
      water: 0, 
      waterHistory: [],
      memo: '' 
    };
    
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updatedRecords = {
      ...records,
      [date]: {
        ...dateRecords,
        water: (dateRecords.water || 0) + amount,
        waterHistory: [
          ...(dateRecords.waterHistory || []),
          {
            time: timeString,
            amount,
            label,
            timestamp: now.toISOString(),
          },
        ],
      },
    };

    set({ records: updatedRecords });
    await saveRecords(updatedRecords);
  },

  // 메모 추가
  addMemo: async (date, memo) => {
    const { records } = get();
    const dateRecords = records[date] || { meals: [], exercise: null, weight: null, water: 0, memo: '' };
    
    const updatedRecords = {
      ...records,
      [date]: {
        ...dateRecords,
        memo,
      },
    };

    set({ records: updatedRecords });
    await saveRecords(updatedRecords);
  },

  // 특정 날짜 기록 가져오기
  getRecordByDate: (date) => {
    const { records } = get();
    return records[date] || { 
      meals: [], 
      exercise: null, 
      weight: null, 
      water: 0, 
      waterHistory: [],
      memo: '' 
    };
  },

  // 주간 기록 가져오기
  getWeeklyRecords: (startDate, endDate) => {
    const { records } = get();
    const weeklyRecords = [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      weeklyRecords.push({
        date: dateStr,
        data: records[dateStr] || { meals: [], exercise: null, weight: null, water: 0, memo: '' },
      });
    }
    
    return weeklyRecords;
  },
}));

export default useRecordStore;

