import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import useWalletStore from '../../store/useWalletStore';
import { AppCard, AppText, AppButton, AppSelectBox } from '../../components/common';
import { AppBarChart, AppLineChart } from '../../components/charts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getPreviousMonths } from '../../utils/date';

const WalletDetailStatsScreen = () => {
  const {
    getMonthlyStatistics,
    getTrendData,
    checkBudgetOverrun,
    getTopCategories,
    getStatistics,
    budget,
    categories,
  } = useWalletStore();

  const isFocused = useIsFocused();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // 월 선택 옵션 (최근 6개월)
  const monthOptions = useMemo(() => {
    const months = getPreviousMonths(6);
    return months.map(ym => {
      const [year, month] = ym.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return {
        value: ym,
        label: `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
      };
    });
  }, []);

  // 선택된 월의 통계
  const currentStats = useMemo(() => {
    return getStatistics(selectedMonth);
  }, [selectedMonth, getStatistics]);

  // 예산 초과 체크
  const budgetOverrun = useMemo(() => {
    return checkBudgetOverrun(selectedMonth);
  }, [selectedMonth, checkBudgetOverrun]);

  // TOP 3 카테고리
  const topCategories = useMemo(() => {
    return getTopCategories(selectedMonth, 3);
  }, [selectedMonth, getTopCategories]);

  // 월별 비교 데이터 (최근 6개월)
  const monthlyComparisonData = useMemo(() => {
    const stats = getMonthlyStatistics(6);
    return {
      labels: stats.map(s => s.monthLabel),
      datasets: [
        {
          data: stats.map(s => Math.round(s.totalExpense / 1000)), // 천원 단위
        },
      ],
    };
  }, [getMonthlyStatistics]);

  // 트렌드 데이터 (최근 6개월)
  const trendData = useMemo(() => {
    const months = getPreviousMonths(6);
    const startMonth = months[0];
    const endMonth = months[months.length - 1];
    const trend = getTrendData(startMonth, endMonth);
    
    return {
      labels: trend.map(t => t.monthLabel),
      datasets: [
        {
          data: trend.map(t => Math.round(t.totalExpense / 1000)), // 천원 단위
        },
      ],
    };
  }, [getTrendData]);

  // 카테고리 정보 가져오기
  const getCategoryInfo = useCallback((categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 월 선택 */}
        <AppCard variant="elevated" elevation="xs" style={styles.monthSelectorCard}>
          <AppSelectBox
            label="조회 기간"
            options={monthOptions}
            selectedValue={selectedMonth}
            onChange={setSelectedMonth}
            colorTheme="wallet"
          />
        </AppCard>

        {/* 월간 리포트 요약 */}
        <AppCard variant="elevated" elevation="sm" style={styles.summaryCard}>
          <AppText variant="h3" style={styles.cardTitle}>
            📊 {monthOptions.find(m => m.value === selectedMonth)?.label} 리포트
          </AppText>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <AppText variant="caption" color="textSecondary">
                총 수입
              </AppText>
              <AppText variant="h3" color="walletIncome">
                +{currentStats.totalIncome.toLocaleString()}원
              </AppText>
            </View>
            
            <View style={styles.summaryItem}>
              <AppText variant="caption" color="textSecondary">
                총 지출
              </AppText>
              <AppText variant="h3" color="wallet">
                -{currentStats.totalExpense.toLocaleString()}원
              </AppText>
            </View>
            
            <View style={styles.summaryItem}>
              <AppText variant="caption" color="textSecondary">
                잔액
              </AppText>
              <AppText 
                variant="h3" 
                color={currentStats.balance >= 0 ? 'walletIncome' : 'error'}
              >
                {currentStats.balance >= 0 ? '+' : ''}
                {currentStats.balance.toLocaleString()}원
              </AppText>
            </View>
            
            <View style={styles.summaryItem}>
              <AppText variant="caption" color="textSecondary">
                거래 건수
              </AppText>
              <AppText variant="h3">
                {currentStats.transactionCount}건
              </AppText>
            </View>
          </View>

          {/* 예산 사용률 */}
          {budget.monthly > 0 && (
            <View style={styles.budgetUsage}>
              <View style={styles.budgetUsageHeader}>
                <AppText variant="body2" color="textSecondary">
                  예산 사용률
                </AppText>
                <AppText 
                  variant="body2" 
                  bold
                  color={currentStats.budgetUsage >= 1.0 ? 'error' : currentStats.budgetUsage >= 0.8 ? 'warning' : 'text'}
                >
                  {Math.round(currentStats.budgetUsage * 100)}%
                </AppText>
              </View>
              <View style={styles.budgetBar}>
                <View 
                  style={[
                    styles.budgetBarFill,
                    {
                      width: `${Math.min(currentStats.budgetUsage * 100, 100)}%`,
                      backgroundColor: currentStats.budgetUsage >= 1.0 
                        ? colors.error 
                        : currentStats.budgetUsage >= 0.8 
                        ? colors.warning 
                        : colors.primary,
                    },
                  ]}
                />
              </View>
              <AppText variant="caption" color="textSecondary">
                예산: {budget.monthly.toLocaleString()}원 / 사용: {currentStats.totalExpense.toLocaleString()}원
              </AppText>
            </View>
          )}
        </AppCard>

        {/* 예산 초과 알림 */}
        {budgetOverrun.total && (
          <AppCard variant="elevated" elevation="sm" style={[styles.alertCard, styles.alertCardOverrun]}>
            <AppText variant="h4" color="error">
              ⚠️ 예산 초과
            </AppText>
            <AppText variant="body2" color="textSecondary" style={styles.alertText}>
              이번 달 예산을 {Math.round(budgetOverrun.totalUsage * 100)}% 초과했습니다.
            </AppText>
          </AppCard>
        )}

        {budgetOverrun.categories.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={[styles.alertCard, styles.alertCardWarning]}>
            <AppText variant="h4" color="warning">
              ⚠️ 카테고리별 경고
            </AppText>
            {budgetOverrun.categories.map((cat) => {
              const categoryInfo = getCategoryInfo(cat.categoryId);
              return (
                <View key={cat.categoryId} style={styles.categoryAlert}>
                  <AppText variant="body2">
                    {categoryInfo?.icon} {cat.categoryName}: {Math.round(cat.usage * 100)}% 사용
                    {cat.isOverrun && ' (초과)'}
                  </AppText>
                </View>
              );
            })}
          </AppCard>
        )}

        {/* 월별 비교 막대 차트 */}
        {monthlyComparisonData.labels.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.chartCard}>
            <AppBarChart
              data={monthlyComparisonData}
              colorTheme="wallet"
              title="월별 지출 비교 (최근 6개월)"
              suffix="천원"
              showValues={true}
            />
          </AppCard>
        )}

        {/* 트렌드 라인 차트 */}
        {trendData.labels.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.chartCard}>
            <AppLineChart
              data={trendData}
              colorTheme="wallet"
              title="월별 지출 추이 (최근 6개월)"
              suffix="천원"
            />
          </AppCard>
        )}

        {/* TOP 3 카테고리 */}
        {topCategories.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.topCategoriesCard}>
            <AppText variant="h4" style={styles.cardTitle}>
              🏆 TOP 3 지출 카테고리
            </AppText>
            
            {topCategories.map((category) => {
              const categoryInfo = getCategoryInfo(category.id);
              const percentage = currentStats.totalExpense > 0 
                ? (category.amount / currentStats.totalExpense * 100).toFixed(1)
                : 0;
              
              return (
                <View key={category.id} style={styles.topCategoryItem}>
                  <View style={styles.topCategoryHeader}>
                    <View style={styles.topCategoryRank}>
                      <AppText variant="h3" color="primary">
                        {category.rank}
                      </AppText>
                    </View>
                    <View style={styles.topCategoryInfo}>
                      <AppText variant="body1" bold>
                        {categoryInfo?.icon} {category.name}
                      </AppText>
                      <AppText variant="caption" color="textSecondary">
                        {percentage}% · {category.amount.toLocaleString()}원
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.topCategoryBar}>
                    <View 
                      style={[
                        styles.topCategoryBarFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </AppCard>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  monthSelectorCard: {
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    gap: spacing.xs,
  },
  budgetUsage: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  budgetUsageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  budgetBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: spacing.borderRadius.round,
  },
  alertCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  alertCardOverrun: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  alertCardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertText: {
    marginTop: spacing.xs,
  },
  categoryAlert: {
    marginTop: spacing.xs,
  },
  chartCard: {
    marginBottom: spacing.md,
  },
  topCategoriesCard: {
    marginBottom: spacing.md,
  },
  topCategoryItem: {
    marginBottom: spacing.md,
  },
  topCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  topCategoryRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  topCategoryInfo: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  topCategoryBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.round,
    overflow: 'hidden',
  },
  topCategoryBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.round,
  },
});

export default WalletDetailStatsScreen;

