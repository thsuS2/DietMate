import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useWalletStore from '../../store/useWalletStore';
import { getTodayString, formatDateShort, getThisWeek } from '../../utils/date';
import { AppCard, AppText, AppButton, AppProgressBar } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { PieChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionAddModal from './TransactionAddModal';

const WalletScreen = () => {
  const navigation = useNavigation();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [periodType, setPeriodType] = useState('month'); // 'day' | 'week' | 'month'
  const [selectedMonth, setSelectedMonth] = useState(getTodayString().substring(0, 7)); // '2025-11'

  const { 
    transactions, 
    budget, 
    categories,
    getMonthTransactions, 
    getTransactionsByPeriod,
    getGroupedStatistics,
    getCategoryWithParent,
    loadWallet,
  } = useWalletStore();

  // 초기 로드
  useEffect(() => {
    loadWallet();
  }, []);

  // 통계 데이터 (1차 카테고리로 그룹핑)
  const groupedStats = getGroupedStatistics(selectedMonth);
  const monthTransactions = getMonthTransactions(selectedMonth);

  // 오늘 거래
  const today = getTodayString();
  const todayTransactions = monthTransactions.filter(t => t.date === today);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 이번 주 거래
  const thisWeek = getThisWeek();
  const weekTransactions = getTransactionsByPeriod(thisWeek.start, thisWeek.end);
  const weekExpense = weekTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 도넛 차트 데이터 (1차 카테고리 기준)
  const pieChartData = groupedStats.groups
    .filter(group => group.amount > 0)
    .slice(0, 5) // 상위 5개만
    .map(group => ({
      name: group.name,
      amount: group.amount,
      color: group.color,
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));

  // 날짜별 그룹핑
  const groupedTransactions = monthTransactions.reduce((acc, txn) => {
    if (!acc[txn.date]) {
      acc[txn.date] = [];
    }
    acc[txn.date].push(txn);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort().reverse();

  return (
    <View style={styles.container}>
      {/* Header with Settings Button */}
      <View style={styles.header}>
        <AppText variant="h2">💰 가계부</AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('CategorySettings')}
          style={styles.settingsButton}
        >
          <MaterialCommunityIcons name="cog" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* 예산 카드 */}
        <AppCard variant="elevated" elevation="md" style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <AppText variant="h3">📊 이번 달 예산</AppText>
            <AppText variant="h2" color="wallet">
              {groupedStats.totalExpense.toLocaleString()}원
            </AppText>
          </View>
          <AppText variant="body2" color="textSecondary" align="right">
            예산: {budget.monthly.toLocaleString()}원
          </AppText>
          <AppProgressBar
            progress={groupedStats.totalExpense / budget.monthly}
            colorTheme="wallet"
            height={12}
            showPercentage={true}
            style={styles.budgetProgress}
          />
        </AppCard>

        {/* 기간별 요약 */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'day' && styles.periodButtonActive,
            ]}
            onPress={() => setPeriodType('day')}
          >
            <AppText
              variant="body2"
              color={periodType === 'day' ? 'primary' : 'textSecondary'}
              bold={periodType === 'day'}
            >
              오늘
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setPeriodType('week')}
          >
            <AppText
              variant="body2"
              color={periodType === 'week' ? 'primary' : 'textSecondary'}
              bold={periodType === 'week'}
            >
              이번 주
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setPeriodType('month')}
          >
            <AppText
              variant="body2"
              color={periodType === 'month' ? 'primary' : 'textSecondary'}
              bold={periodType === 'month'}
            >
              이번 달
            </AppText>
          </TouchableOpacity>
        </View>

          <AppCard variant="elevated" elevation="sm" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <AppText variant="caption" color="textSecondary">
                지출
              </AppText>
              <AppText variant="h3" color="wallet">
                -{periodType === 'day' 
                  ? todayExpense.toLocaleString()
                  : periodType === 'week'
                  ? weekExpense.toLocaleString()
                  : groupedStats.totalExpense.toLocaleString()}원
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 카테고리별 지출 (도넛 차트) */}
        {pieChartData.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.chartCard}>
            <AppText variant="h3" style={styles.sectionTitle}>
              📊 카테고리별 지출
            </AppText>
            <PieChart
              data={pieChartData}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            
            {/* 카테고리 목록 (1차 카테고리) */}
            <View style={styles.categoryList}>
              {groupedStats.groups.slice(0, 5).map((group) => (
                <View key={group.id} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: group.color }]}
                    />
                    <AppText variant="body2">
                      {group.icon} {group.name}
                    </AppText>
                  </View>
                  <View style={styles.categoryAmount}>
                    <AppText variant="body2" bold>
                      {group.amount.toLocaleString()}원
                    </AppText>
                    <AppText variant="caption" color="textSecondary">
                      {Math.round(group.ratio * 100)}%
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </AppCard>
        )}

        {/* 거래 내역 */}
        <AppCard variant="elevated" elevation="sm" style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <AppText variant="h3">📝 거래 내역</AppText>
            <AppText variant="body2" color="primary">
              {selectedMonth}
            </AppText>
          </View>

          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <AppText variant="body2" color="textSecondary">
                    {formatDateShort(date)}
                  </AppText>
                  <AppText variant="body2" color="wallet">
                    -{groupedTransactions[date]
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}원
                  </AppText>
                </View>

                {groupedTransactions[date].map((txn) => {
                  const catInfo = getCategoryWithParent(txn.category);
                  const displayCat = catInfo?.category;
                  const parentCat = catInfo?.parent;
                  
                  // 표시용: 2차가 있으면 "1차 > 2차", 없으면 "1차"
                  const displayName = parentCat 
                    ? `${parentCat.name} > ${displayCat?.name}`
                    : displayCat?.name || '기타';
                  
                  return (
                    <TouchableOpacity
                      key={txn.id}
                      style={styles.transactionItem}
                    >
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: displayCat?.color || colors.walletEtc },
                          ]}
                        >
                          <AppText variant="body1">{displayCat?.icon || '💸'}</AppText>
                        </View>
                        <View style={styles.transactionInfo}>
                          <AppText variant="body2">{displayName}</AppText>
                          {txn.memo && (
                            <AppText variant="caption" color="textSecondary">
                              {txn.memo}
                            </AppText>
                          )}
                        </View>
                      </View>
                      <AppText
                        variant="body1"
                        color={txn.type === 'income' ? 'walletIncome' : 'wallet'}
                        bold
                      >
                        {txn.type === 'income' ? '+' : '-'}
                        {txn.amount.toLocaleString()}원
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <AppText variant="body1" color="textSecondary" align="center">
                아직 거래 내역이 없습니다
              </AppText>
              <AppText variant="caption" color="textSecondary" align="center" style={styles.emptyHint}>
                + 버튼을 눌러 수입/지출을 추가해보세요
              </AppText>
            </View>
          )}
        </AppCard>
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddModalVisible(true)}
      >
        <AppText variant="h1" color="white">
          +
        </AppText>
      </TouchableOpacity>

      {/* 추가 모달 */}
      <TransactionAddModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingsButton: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  budgetCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.walletLight,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  budgetProgress: {
    marginTop: spacing.sm,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  chartCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  categoryList: {
    marginTop: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  transactionCard: {
    marginBottom: 80, // 플로팅 버튼 공간
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateGroup: {
    marginBottom: spacing.md,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.sm,
    marginBottom: spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyHint: {
    marginTop: spacing.xs,
  },
  floatingButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default WalletScreen;
