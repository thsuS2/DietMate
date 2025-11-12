import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 가계부 관리용 Zustand 스토어
 * 수입/지출, 예산, 카테고리 관리
 */

// 기본 카테고리 (계층 구조)
const DEFAULT_CATEGORIES = [
  // ========================================
  // 수입 - 1차 카테고리
  // ========================================
  { 
    id: 'income', 
    name: '수입', 
    type: 'income', 
    color: '#4CAF50', 
    icon: '💰', 
    isParent: true,
    children: ['income_salary', 'income_interest', 'income_bonus', 'income_investment', 'income_etc']
  },
  
  // 수입 - 2차 카테고리
  { id: 'income_salary', name: '월급', type: 'income', color: '#66BB6A', icon: '💵', parentId: 'income' },
  { id: 'income_interest', name: '이자', type: 'income', color: '#81C784', icon: '🏦', parentId: 'income' },
  { id: 'income_bonus', name: '상여', type: 'income', color: '#A5D6A7', icon: '🎁', parentId: 'income' },
  { id: 'income_investment', name: '투자', type: 'income', color: '#C8E6C9', icon: '📈', parentId: 'income' },
  { id: 'income_etc', name: '기타소득', type: 'income', color: '#4CAF50', icon: '💸', parentId: 'income' },

  // ========================================
  // 지출 - 1차 카테고리
  // ========================================
  { id: 'special', name: '특별지출', type: 'expense', color: '#E91E63', icon: '🎁', isParent: true, children: [] },
  { id: 'food', name: '식비', type: 'expense', color: '#FF6B6B', icon: '🍽️', isParent: true, children: [] },
  { id: 'living', name: '생활비', type: 'expense', color: '#9B59B6', icon: '🏠', isParent: true, children: [] },
  { id: 'culture', name: '문화생활', type: 'expense', color: '#E74C3C', icon: '🎬', isParent: true, children: [] },
  { id: 'variable', name: '변동지출', type: 'expense', color: '#FFD93D', icon: '💳', isParent: true, children: [] },
  { id: 'date', name: '데이트', type: 'expense', color: '#FFC0CB', icon: '💕', isParent: true, children: [] },
  { id: 'fixed', name: '고정지출', type: 'expense', color: '#607D8B', icon: '📌', isParent: true, children: [] },
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
  assets: [
    // 자산 목록
    // { id, name, type: 'bank'|'cash'|'card'|'savings', balance, icon, color }
  ],
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
          assets: data.assets || [],
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
    const { categories, transactions, budget, assets } = get();
    await saveWalletData({ categories, transactions, budget, assets });
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

  // 1차 카테고리만 가져오기 (부모)
  getParentCategories: (type = null) => {
    const { categories } = get();
    const parents = categories.filter(cat => cat.isParent === true);
    return type ? parents.filter(cat => cat.type === type) : parents;
  },

  // 2차 카테고리 가져오기 (자식)
  getChildCategories: (parentId) => {
    const { categories } = get();
    return categories.filter(cat => cat.parentId === parentId);
  },

  // 카테고리와 부모 정보 함께 가져오기
  getCategoryWithParent: (categoryId) => {
    const { categories } = get();
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return null;

    if (category.parentId) {
      const parent = categories.find(cat => cat.id === category.parentId);
      return { category, parent };
    }

    return { category, parent: null };
  },

  // 통계 계산 (1차 카테고리로 그룹핑)
  getGroupedStatistics: (yearMonth) => {
    const transactions = get().getMonthTransactions(yearMonth);
    const { categories } = get();

    // 지출만 필터링
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // 1차 카테고리별로 그룹핑
    const primaryGroups = {};

    expenses.forEach(txn => {
      const catInfo = get().getCategoryWithParent(txn.category);
      if (!catInfo) return;

      // 1차 카테고리 ID 찾기
      const primaryId = catInfo.parent ? catInfo.parent.id : catInfo.category.id;
      const primaryCat = categories.find(c => c.id === primaryId);

      if (!primaryGroups[primaryId]) {
        primaryGroups[primaryId] = {
          id: primaryId,
          name: primaryCat?.name || '기타',
          color: primaryCat?.color || '#95A5A6',
          icon: primaryCat?.icon || '💸',
          amount: 0,
          count: 0,
        };
      }

      primaryGroups[primaryId].amount += txn.amount;
      primaryGroups[primaryId].count += 1;
    });

    // 배열로 변환 및 정렬
    const groupedData = Object.values(primaryGroups)
      .map(group => ({
        ...group,
        ratio: totalExpense > 0 ? group.amount / totalExpense : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalExpense,
      groups: groupedData,
    };
  },

  // ========================================
  // 자산 관리
  // ========================================

  // 자산 추가
  addAsset: async (asset) => {
    const { assets } = get();
    const newAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
    };

    set({ assets: [...assets, newAsset] });
    await get().saveWallet();
  },

  // 자산 수정
  updateAsset: async (assetId, updates) => {
    const { assets } = get();
    set({
      assets: assets.map(asset =>
        asset.id === assetId ? { ...asset, ...updates } : asset
      ),
    });
    await get().saveWallet();
  },

  // 자산 삭제
  deleteAsset: async (assetId) => {
    const { assets } = get();
    set({ assets: assets.filter(asset => asset.id !== assetId) });
    await get().saveWallet();
  },

  // 총 자산 계산
  getTotalAssets: () => {
    const { assets } = get();
    return assets.reduce((sum, asset) => sum + (asset.balance || 0), 0);
  },

  // 타입별 자산 합계
  getAssetsByType: (type) => {
    const { assets } = get();
    return assets.filter(asset => asset.type === type);
  },
}));

export default useWalletStore;
