import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';
import { 
  normalizeDate, 
  parseDateString, 
  formatDate, 
  getTodayString, 
  diffInDays, 
  diffInMonths 
} from '../utils/date';

// parseDate는 parseDateString로 통일
const parseDate = parseDateString;

const clampDayOfMonth = (value, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), 1), 31);
};

const normalizeDaysOfWeek = (days) => {
  if (!Array.isArray(days)) {
    return [];
  }

  const normalized = days
    .map((day) => {
      const parsed = Number(day);
      if (Number.isNaN(parsed)) return null;
      return ((parsed % 7) + 7) % 7;
    })
    .filter((day) => day !== null);

  return Array.from(new Set(normalized)).sort((a, b) => a - b);
};

const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly'];

const normalizeRecurringTemplate = (template) => {
  const nowIso = new Date().toISOString();
  const startDateString = template.startDate || getTodayString();
  const startDate = parseDate(startDateString) || new Date();
  const frequency = RECURRENCE_FREQUENCIES.includes(template.frequency)
    ? template.frequency
    : 'monthly';
  const interval = template.interval && template.interval > 0
    ? Math.floor(template.interval)
    : 1;

  const daysOfWeekCandidates = template.daysOfWeek ?? (template.dayOfWeek !== undefined
    ? [template.dayOfWeek]
    : []);
  const normalizedDays = normalizeDaysOfWeek(daysOfWeekCandidates);
  const defaultDayOfWeek = startDate.getDay();
  const defaultDayOfMonth = startDate.getDate();

  return {
    id: template.id,
    name: template.name || '',
    type: template.type || 'expense',
    category: template.category,
    amount: Number(template.amount) || 0,
    memo: template.memo || '',
    frequency,
    interval,
    startDate: formatDate(startDate),
    endDate: template.endDate || null,
    dayOfMonth: clampDayOfMonth(
      template.dayOfMonth !== undefined ? template.dayOfMonth : defaultDayOfMonth,
      defaultDayOfMonth
    ),
    daysOfWeek: normalizedDays.length > 0 ? normalizedDays : [defaultDayOfWeek],
    time: template.time || '09:00',
    autoCreate: template.autoCreate !== undefined ? !!template.autoCreate : true,
    lastGeneratedDate: template.lastGeneratedDate || null,
    createdAt: template.createdAt || nowIso,
    updatedAt: template.updatedAt || nowIso,
  };
};

const calculateRecurringOccurrences = (template, rangeStart, rangeEnd) => {
  const occurrences = [];
  if (!rangeStart || !rangeEnd) return occurrences;

  const start = normalizeDate(rangeStart);
  const end = normalizeDate(rangeEnd);
  if (start > end) return occurrences;

  const templateStart = parseDate(template.startDate) || start;
  const interval = template.interval && template.interval > 0 ? template.interval : 1;
  const effectiveFrequency = template.frequency || 'monthly';

  let current = new Date(start);
  while (current <= end) {
    const currentDateString = formatDate(current);
    const currentDate = normalizeDate(current);

    if (currentDate < templateStart) {
      current.setDate(current.getDate() + 1);
      continue;
    }

    const templateEnd = template.endDate ? parseDate(template.endDate) : null;
    if (templateEnd && currentDate > templateEnd) {
      break;
    }

    const dayDiff = diffInDays(templateStart, currentDate);

    const pushOccurrence = () => occurrences.push(currentDateString);

    switch (effectiveFrequency) {
      case 'daily': {
        if (dayDiff >= 0 && dayDiff % interval === 0) {
          pushOccurrence();
        }
        break;
      }
      case 'weekly': {
        const daysOfWeek = Array.isArray(template.daysOfWeek) && template.daysOfWeek.length > 0
          ? template.daysOfWeek
          : [templateStart.getDay()];
        if (daysOfWeek.includes(currentDate.getDay())) {
          const weekDiff = Math.floor(dayDiff / 7);
          if (weekDiff >= 0 && weekDiff % interval === 0) {
            pushOccurrence();
          }
        }
        break;
      }
      case 'monthly': {
        const targetDay = template.dayOfMonth || templateStart.getDate();
        if (currentDate.getDate() === targetDay) {
          const monthDiff = diffInMonths(templateStart, currentDate);
          if (monthDiff >= 0 && monthDiff % interval === 0) {
            pushOccurrence();
          }
        }
        break;
      }
      default: {
        if (dayDiff >= 0 && dayDiff % interval === 0) {
          pushOccurrence();
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return occurrences;
};

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
    logger.error('가계부 데이터 로드 실패', error);
    return null;
  }
};

const saveWalletData = async (data) => {
  try {
    await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    logger.error('가계부 데이터 저장 실패', error);
  }
};

const useWalletStore = create((set, get) => ({
  // 상태
  categories: DEFAULT_CATEGORIES,
  transactions: {}, // { '2025-11': [...], '2025-10': [...] }
  recurringTemplates: [],
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
          recurringTemplates: data.recurringTemplates || [],
          budget: data.budget || { monthly: 2000000, categories: {} },
          assets: data.assets || [],
        });
      }
    } catch (error) {
      logger.error('가계부 로드 실패', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 데이터 저장
  saveWallet: async () => {
    const { categories, transactions, recurringTemplates, budget, assets } = get();
    await saveWalletData({ categories, transactions, recurringTemplates, budget, assets });
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

  // ========================================
  // 반복 거래 템플릿
  // ========================================

  getRecurringTemplates: () => get().recurringTemplates,

  addRecurringTemplate: async (template) => {
    const { recurringTemplates } = get();
    const normalized = normalizeRecurringTemplate({
      ...template,
      id: template?.id || `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    });

    set({
      recurringTemplates: [...recurringTemplates, normalized],
    });
    await get().saveWallet();

    return normalized;
  },

  updateRecurringTemplate: async (templateId, updates) => {
    const { recurringTemplates } = get();
    let updatedTemplate = null;

    const nextTemplates = recurringTemplates.map((template) => {
      if (template.id !== templateId) return template;

      const merged = {
        ...template,
        ...updates,
        id: template.id,
        createdAt: template.createdAt,
        lastGeneratedDate: updates.lastGeneratedDate ?? template.lastGeneratedDate,
      };

      updatedTemplate = normalizeRecurringTemplate({
        ...merged,
        updatedAt: new Date().toISOString(),
      });

      return updatedTemplate;
    });

    if (!updatedTemplate) {
      return null;
    }

    set({ recurringTemplates: nextTemplates });
    await get().saveWallet();
    return updatedTemplate;
  },

  deleteRecurringTemplate: async (templateId) => {
    const { recurringTemplates } = get();
    const nextTemplates = recurringTemplates.filter((template) => template.id !== templateId);

    if (nextTemplates.length === recurringTemplates.length) {
      return;
    }

    set({ recurringTemplates: nextTemplates });
    await get().saveWallet();
  },

  generateRecurringTransactions: async ({ startDate, endDate } = {}) => {
    const { transactions, recurringTemplates } = get();
    const todayString = getTodayString();
    const rangeStartString = startDate || todayString;
    const rangeEndString = endDate || rangeStartString;

    const rangeStart = parseDate(rangeStartString);
    const rangeEnd = parseDate(rangeEndString);

    if (!rangeStart || !rangeEnd) {
      return [];
    }

    let actualStart = rangeStart;
    let actualEnd = rangeEnd;
    if (actualStart > actualEnd) {
      actualStart = rangeEnd;
      actualEnd = rangeStart;
    }

    const transactionsCopy = Object.keys(transactions).reduce((acc, month) => {
      acc[month] = [...transactions[month]];
      return acc;
    }, {});

    const ensureMonthBucket = (monthKey) => {
      if (!transactionsCopy[monthKey]) {
        transactionsCopy[monthKey] = [];
      }
      return transactionsCopy[monthKey];
    };

    const hasRecurringOnDate = (templateId, dateString) => {
      const monthKey = dateString.substring(0, 7);
      const list = transactionsCopy[monthKey] || [];
      return list.some(
        (txn) => txn.recurringId === templateId && txn.date === dateString
      );
    };

    const generated = [];
    const updatedTemplates = [...recurringTemplates];

    recurringTemplates.forEach((template, index) => {
      if (template.autoCreate === false) {
        return;
      }

      const templateStart = parseDate(template.startDate) || actualStart;
      const templateEnd = template.endDate ? parseDate(template.endDate) : null;
      const effectiveStart = templateStart > actualStart ? templateStart : actualStart;
      const effectiveEnd = templateEnd && templateEnd < actualEnd ? templateEnd : actualEnd;
      if (effectiveEnd && effectiveStart > effectiveEnd) {
        return;
      }

      const occurrenceEnd = effectiveEnd || actualEnd;
      const occurrences = calculateRecurringOccurrences(template, effectiveStart, occurrenceEnd);
      if (!occurrences.length) {
        return;
      }

      let lastGeneratedDate = template.lastGeneratedDate;

      occurrences.forEach((dateString) => {
        if (hasRecurringOnDate(template.id, dateString)) {
          return;
        }

        const newTransaction = {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: template.type,
          amount: template.amount,
          category: template.category,
          memo: template.memo || template.name || '',
          date: dateString,
          time: template.time || '09:00',
          timestamp: new Date().toISOString(),
          recurringId: template.id,
        };

        const monthKey = dateString.substring(0, 7);
        const bucket = ensureMonthBucket(monthKey);
        bucket.push(newTransaction);
        generated.push(newTransaction);
        lastGeneratedDate = dateString;
      });

      if (lastGeneratedDate && lastGeneratedDate !== template.lastGeneratedDate) {
        updatedTemplates[index] = {
          ...template,
          lastGeneratedDate,
          updatedAt: new Date().toISOString(),
        };
      }
    });

    if (!generated.length) {
      return [];
    }

    Object.keys(transactionsCopy).forEach((month) => {
      transactionsCopy[month] = [...transactionsCopy[month]].sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
        const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
        return dateB.getTime() - dateA.getTime();
      });
    });

    set({
      transactions: transactionsCopy,
      recurringTemplates: updatedTemplates,
    });

    await get().saveWallet();
    return generated;
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

  // ========================================
  // 상세 통계 (월간 리포트용)
  // ========================================

  // 여러 달의 통계를 한번에 계산
  getMonthlyStatistics: (months = 6) => {
    const { transactions, budget } = get();
    const today = new Date();
    const results = [];

    for (let i = 0; i < months; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const yearMonth = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      
      const monthTransactions = get().getMonthTransactions(yearMonth);
      const income = monthTransactions.filter(t => t.type === 'income');
      const expenses = monthTransactions.filter(t => t.type === 'expense');
      
      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpense;
      const budgetUsage = budget.monthly > 0 ? totalExpense / budget.monthly : 0;

      results.push({
        yearMonth,
        monthLabel: `${targetDate.getMonth() + 1}월`,
        totalIncome,
        totalExpense,
        balance,
        budgetUsage,
        transactionCount: monthTransactions.length,
      });
    }

    return results.reverse(); // 오래된 순서부터
  },

  // 월별 추이 데이터 (트렌드 분석용)
  getTrendData: (startMonth, endMonth) => {
    const start = new Date(startMonth + '-01');
    const end = new Date(endMonth + '-01');
    const results = [];

    let current = new Date(start);
    while (current <= end) {
      const yearMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      const stats = get().getStatistics(yearMonth);
      
      results.push({
        yearMonth,
        monthLabel: `${current.getMonth() + 1}월`,
        totalExpense: stats.totalExpense,
        totalIncome: stats.totalIncome,
        balance: stats.balance,
        budgetUsage: stats.budgetUsage,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return results;
  },

  // 예산 초과 체크
  checkBudgetOverrun: (yearMonth) => {
    const { budget } = get();
    const stats = get().getStatistics(yearMonth);
    const groupedStats = get().getGroupedStatistics(yearMonth);

    const overruns = {
      total: stats.budgetUsage >= 1.0,
      totalUsage: stats.budgetUsage,
      categories: [],
    };

    // 카테고리별 예산 초과 체크
    groupedStats.groups.forEach(group => {
      const categoryBudget = budget.categories[group.id] || 0;
      if (categoryBudget > 0) {
        const usage = group.amount / categoryBudget;
        if (usage >= 0.8) { // 80% 이상 사용 시 경고
          overruns.categories.push({
            categoryId: group.id,
            categoryName: group.name,
            amount: group.amount,
            budget: categoryBudget,
            usage,
            isOverrun: usage >= 1.0,
          });
        }
      }
    });

    return overruns;
  },

  // TOP N 카테고리 가져오기
  getTopCategories: (yearMonth, limit = 3) => {
    const groupedStats = get().getGroupedStatistics(yearMonth);
    return groupedStats.groups
      .filter(group => group.amount > 0)
      .slice(0, limit)
      .map((group, index) => ({
        rank: index + 1,
        ...group,
      }));
  },
}));

export default useWalletStore;
