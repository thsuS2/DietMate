import { create } from 'zustand';
import { loadWallet, saveWallet } from '../utils/storage';

/**
 * 가계부 관리용 Zustand 스토어
 * 감정적 소비 방지를 위한 기록
 */
const useWalletStore = create((set, get) => ({
  // 상태
  expenses: [], // [{ id, date, amount, reason, category, isEmotional }]
  isLoading: false,

  // 초기 데이터 로드
  loadWallet: async () => {
    set({ isLoading: true });
    try {
      const expenses = await loadWallet();
      set({ expenses, isLoading: false });
    } catch (error) {
      console.error('가계부 로드 실패:', error);
      set({ isLoading: false });
    }
  },

  // 소비 추가
  addExpense: async (expense) => {
    const { expenses } = get();
    const newExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...expense,
    };
    
    const updatedExpenses = [...expenses, newExpense];
    
    set({ expenses: updatedExpenses });
    await saveWallet(updatedExpenses);
  },

  // 소비 수정
  updateExpense: async (id, updates) => {
    const { expenses } = get();
    const updatedExpenses = expenses.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    );
    
    set({ expenses: updatedExpenses });
    await saveWallet(updatedExpenses);
  },

  // 소비 삭제
  deleteExpense: async (id) => {
    const { expenses } = get();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    
    set({ expenses: updatedExpenses });
    await saveWallet(updatedExpenses);
  },

  // 날짜별 소비 가져오기
  getExpensesByDate: (date) => {
    const { expenses } = get();
    return expenses.filter(expense => expense.date === date);
  },

  // 기간별 소비 통계
  getExpensesByPeriod: (startDate, endDate) => {
    const { expenses } = get();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  },

  // 감정적 소비 통계
  getEmotionalExpenses: () => {
    const { expenses } = get();
    return expenses.filter(expense => expense.isEmotional);
  },

  // 주간 총 소비액
  getWeeklyTotal: (startDate, endDate) => {
    const weeklyExpenses = get().getExpensesByPeriod(startDate, endDate);
    return weeklyExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  // 감정적 소비 총액
  getEmotionalExpensesTotal: () => {
    const emotionalExpenses = get().getEmotionalExpenses();
    return emotionalExpenses.reduce((total, expense) => total + expense.amount, 0);
  },
}));

export default useWalletStore;

