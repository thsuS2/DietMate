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
        data: records[dateStr] || { meals: [], exercises: [], weight: null, water: 0, waterHistory: [], memo: '' },
      });
    }
    
    return weeklyRecords;
  },

  // 주간 통계 계산
  getWeeklyStats: (startDate, endDate, settings = {}) => {
    const weeklyRecords = get().getWeeklyRecords(startDate, endDate);
    const dailyWaterGoal = settings.dailyWaterGoal || 2000;
    
    // 수분 통계
    const waterData = weeklyRecords.map(r => r.data.water || 0);
    const totalWater = waterData.reduce((sum, w) => sum + w, 0);
    const averageWater = totalWater / 7;
    const waterGoalDays = waterData.filter(w => w >= dailyWaterGoal).length;
    // 평균 수분 섭취량 대비 목표량 비율 (최대 100%)
    const waterGoalRate = Math.min(averageWater / dailyWaterGoal, 1.0);

    // 운동 통계
    const exerciseData = weeklyRecords.map(r => {
      const exercises = r.data.exercises || [];
      return exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
    });
    const totalExerciseTime = exerciseData.reduce((sum, t) => sum + t, 0);
    const exerciseDays = exerciseData.filter(t => t > 0).length;

    // 몸무게 통계
    const weights = weeklyRecords
      .map(r => r.data.weight)
      .filter(w => w !== null && w !== undefined);
    const startWeight = weights.length > 0 ? weights[0] : null;
    const endWeight = weights.length > 0 ? weights[weights.length - 1] : null;
    const weightChange = startWeight && endWeight ? endWeight - startWeight : 0;

    // 기록 빈도
    const recordedDays = weeklyRecords.filter(r => {
      const data = r.data;
      return data.water > 0 || 
             (data.meals && data.meals.length > 0) || 
             (data.exercises && data.exercises.length > 0) ||
             data.weight !== null ||
             data.memo;
    }).length;
    const recordRate = recordedDays / 7;

    return {
      water: {
        total: totalWater,
        average: Math.round(averageWater),
        dailyData: waterData,
        goalRate: waterGoalRate,
      },
      exercise: {
        totalTime: totalExerciseTime,
        count: exerciseDays,
        dailyData: exerciseData,
      },
      weight: {
        start: startWeight,
        end: endWeight,
        change: weightChange,
        data: weights,
      },
      recordRate,
      recordedDays,
    };
  },
}));

export default useRecordStore;

