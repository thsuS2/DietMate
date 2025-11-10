import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 가계부 관리용 Zustand 스토어
 * 수입/지출, 예산, 카테고리 관리
 */

// 기본 카테고리
const DEFAULT_CATEGORIES = [
  { id: 'income', name: '수입', type: 'income', color: '#4CAF50', icon: '💰' },
  { id: 'salary', name: '급여', type: 'income', color: '#66BB6A', icon: '💵' },
  { id: 'food', name: '식비', type: 'expense', color: '#FF6B6B', icon: '🍽️' },
  { id: 'delivery', name: '배달음식', type: 'expense', color: '#FF8787', icon: '🛵' },
  { id: 'cafe', name: '카페', type: 'expense', color: '#FFD93D', icon: '☕' },
  { id: 'transport', name: '교통', type: 'expense', color: '#9B59B6', icon: '🚗' },
  { id: 'shopping', name: '쇼핑', type: 'expense', color: '#4ECDC4', icon: '🛍️' },
  { id: 'health', name: '의료/건강', type: 'expense', color: '#3498DB', icon: '🏥' },
  { id: 'culture', name: '문화/여가', type: 'expense', color: '#E74C3C', icon: '🎬' },
  { id: 'etc', name: '기타', type: 'expense', color: '#95A5A6', icon: '💸' },
];

const WALLET_STORAGE_KEY = '@dietmate_wallet';

// AsyncStorage 헬퍼
const loadWalletData = async () => {
  try {
    const data = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('가계부 데이터 로드 실패:', error);
    return null;
  }
};

const saveWalletData = async (data) => {
  try {
    await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('가계부 데이터 저장 실패:', error);
  }
};

const useWalletStore = create((set, get) => ({
  // 상태
  categories: DEFAULT_CATEGORIES,
  transactions: {}, // { '2025-11': [...], '2025-10': [...] }
  budget: {
    monthly: 2000000, // 월별 총 예산
    categories: {}, // 카테고리별 예산
  },
  isLoading: false,

  // 초기 데이터 로드
  loadWallet: async () => {
    set({ isLoading: true });
    try {
      const data = await loadWalletData();
      if (data) {
        set({
          categories: data.categories || DEFAULT_CATEGORIES,
          transactions: data.transactions || {},
          budget: data.budget || { monthly: 2000000, categories: {} },
        });
      }
    } catch (error) {
      console.error('가계부 로드 실패:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 데이터 저장
  saveWallet: async () => {
    const { categories, transactions, budget } = get();
    await saveWalletData({ categories, transactions, budget });
  },

  // 거래 추가
  addTransaction: async (transaction) => {
    const { transactions } = get();
    const month = transaction.date.substring(0, 7); // '2025-11'
    
    const newTransaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    const monthTransactions = transactions[month] || [];
    const updatedTransactions = {
      ...transactions,
      [month]: [...monthTransactions, newTransaction].sort((a, b) => 
        new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
      ),
    };

    set({ transactions: updatedTransactions });
    await get().saveWallet();
    return newTransaction;
  },

  // 거래 수정
  updateTransaction: async (transactionId, updates) => {
    const { transactions } = get();
    let updated = false;

    const updatedTransactions = Object.keys(transactions).reduce((acc, month) => {
      acc[month] = transactions[month].map(txn => {
        if (txn.id === transactionId) {
          updated = true;
          return { ...txn, ...updates };
        }
        return txn;
      });
      return acc;
    }, {});

    if (updated) {
      set({ transactions: updatedTransactions });
      await get().saveWallet();
    }
  },

  // 거래 삭제
  deleteTransaction: async (transactionId) => {
    const { transactions } = get();
    let deleted = false;

    const updatedTransactions = Object.keys(transactions).reduce((acc, month) => {
      acc[month] = transactions[month].filter(txn => {
        if (txn.id === transactionId) {
          deleted = true;
          return false;
        }
        return true;
      });
      return acc;
    }, {});

    if (deleted) {
      set({ transactions: updatedTransactions });
      await get().saveWallet();
    }
  },

  // 특정 월 거래 내역 가져오기
  getMonthTransactions: (yearMonth) => {
    const { transactions } = get();
    return transactions[yearMonth] || [];
  },

  // 특정 기간 거래 내역 가져오기
  getTransactionsByPeriod: (startDate, endDate) => {
    const { transactions } = get();
    const allTransactions = Object.values(transactions).flat();
    
    return allTransactions.filter(txn => {
      return txn.date >= startDate && txn.date <= endDate;
    }).sort((a, b) => 
      new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
    );
  },

  // 통계 계산
  getStatistics: (yearMonth) => {
    const transactions = get().getMonthTransactions(yearMonth);
    const { budget } = get();

    // 수입/지출 분리
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');

    // 총액 계산
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // 카테고리별 지출
    const categoryExpenses = {};
    expenses.forEach(txn => {
      if (!categoryExpenses[txn.category]) {
        categoryExpenses[txn.category] = 0;
      }
      categoryExpenses[txn.category] += txn.amount;
    });

    // 카테고리별 비율
    const categoryRatios = Object.keys(categoryExpenses).map(catId => {
      const category = get().categories.find(c => c.id === catId);
      return {
        categoryId: catId,
        categoryName: category?.name || catId,
        color: category?.color || '#95A5A6',
        icon: category?.icon || '💸',
        amount: categoryExpenses[catId],
        ratio: totalExpense > 0 ? categoryExpenses[catId] / totalExpense : 0,
      };
    }).sort((a, b) => b.amount - a.amount);

    // 예산 대비
    const budgetUsage = budget.monthly > 0 ? totalExpense / budget.monthly : 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryExpenses,
      categoryRatios,
      budgetUsage,
      transactionCount: transactions.length,
    };
  },

  // 예산 설정
  setBudget: async (monthly, categories = {}) => {
    set({
      budget: {
        monthly,
        categories,
      },
    });
    await get().saveWallet();
  },

  // 카테고리별 예산 설정
  setCategoryBudget: async (categoryId, amount) => {
    const { budget } = get();
    set({
      budget: {
        ...budget,
        categories: {
          ...budget.categories,
          [categoryId]: amount,
        },
      },
    });
    await get().saveWallet();
  },

  // 카테고리 추가
  addCategory: async (category) => {
    const { categories } = get();
    const newCategory = {
      ...category,
      id: category.id || `cat_${Date.now()}`,
    };

    set({ categories: [...categories, newCategory] });
    await get().saveWallet();
  },

  // 카테고리 수정
  updateCategory: async (categoryId, updates) => {
    const { categories } = get();
    set({
      categories: categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ),
    });
    await get().saveWallet();
  },

  // 카테고리 삭제
  deleteCategory: async (categoryId) => {
    const { categories } = get();
    set({
      categories: categories.filter(cat => cat.id !== categoryId),
    });
    await get().saveWallet();
  },

  // 카테고리 ID로 찾기
  getCategoryById: (categoryId) => {
    const { categories } = get();
    return categories.find(cat => cat.id === categoryId);
  },

  // 타입별 카테고리 가져오기
  getCategoriesByType: (type) => {
    const { categories } = get();
    return categories.filter(cat => cat.type === type);
  },
}));

export default useWalletStore;
