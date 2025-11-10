import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { getThisWeek, getLastWeek, formatDateKorean } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import useSettingsStore from '../../store/useSettingsStore';
import { AppCard, AppText, AppButton, AppModal } from '../../components/common';
import { AppLineChart, AppBarChart, AppProgressChart } from '../../components/charts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const StatsScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState('this'); // 'this' | 'last'
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Zustand 스토어
  const { records, getWeeklyStats, getWeeklyRecords, getRecordByDate } = useRecordStore();
  const { settings } = useSettingsStore();

  // 주간 범위
  const thisWeek = getThisWeek();
  const lastWeek = getLastWeek();
  const weekRange = selectedWeek === 'this' ? thisWeek : lastWeek;

  // 통계 데이터
  const stats = getWeeklyStats(weekRange.start, weekRange.end, settings);
  const weeklyRecords = getWeeklyRecords(weekRange.start, weekRange.end);

  // 차트 데이터 준비
  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

  // 수분 차트 데이터
  const waterChartData = {
    labels: dayLabels,
    datasets: [{ data: stats.water.dailyData }],
  };

  // 운동 차트 데이터
  const exerciseChartData = {
    labels: dayLabels,
    datasets: [{ data: stats.exercise.dailyData }],
  };

  // 몸무게 차트 데이터
  const weightChartData = {
    labels: dayLabels.slice(0, stats.weight.data.length),
    datasets: [{ data: stats.weight.data.length > 0 ? stats.weight.data : [0] }],
  };

  // 목표 달성률 차트 데이터
  const progressChartData = {
    labels: ['수분', '운동', '기록'],
    data: [
      stats.water.goalRate,
      stats.exercise.count / 7, // 주 7일 중 운동한 비율
      stats.recordRate,
    ],
  };

  // 날짜 클릭 핸들러
  const handleDatePress = (date) => {
    setSelectedDate(date);
    setDetailModalVisible(true);
  };

  // 선택된 날짜의 상세 데이터
  const selectedDateRecord = selectedDate ? getRecordByDate(selectedDate) : null;

  return (
    <View style={styles.container}>
      {/* 주간 선택 */}
      <View style={styles.weekSelector}>
        <AppButton
          variant={selectedWeek === 'this' ? 'contained' : 'outlined'}
          colorTheme="primary"
          size="small"
          onPress={() => setSelectedWeek('this')}
          style={styles.weekButton}
        >
          이번주
        </AppButton>
        <AppButton
          variant={selectedWeek === 'last' ? 'contained' : 'outlined'}
          colorTheme="primary"
          size="small"
          onPress={() => setSelectedWeek('last')}
          style={styles.weekButton}
        >
          지난주
        </AppButton>
      </View>

      <ScrollView style={styles.content}>
        {/* 기간 표시 */}
        <AppText variant="body2" color="textSecondary" align="center" style={styles.dateRange}>
          {formatDateKorean(weekRange.start)} ~ {formatDateKorean(weekRange.end)}
        </AppText>

        {/* 주간 요약 카드 */}
        <AppCard variant="elevated" elevation="md" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            📈 주간 요약
          </AppText>
          
          <View style={styles.summaryGrid}>
            {/* 수분 */}
            <View style={[styles.summaryItem, { backgroundColor: colors.waterLight }]}>
              <AppText variant="h2" color="water">
                {Math.round(stats.water.goalRate * 100)}%
              </AppText>
              <AppText variant="caption" color="textSecondary">
                💧 수분 달성률
              </AppText>
            </View>

            {/* 운동 */}
            <View style={[styles.summaryItem, { backgroundColor: colors.exerciseLight }]}>
              <AppText variant="h2" color="exercise">
                {stats.exercise.count}회
              </AppText>
              <AppText variant="caption" color="textSecondary">
                🏃 운동 횟수
              </AppText>
            </View>

            {/* 몸무게 변화 */}
            <View style={[styles.summaryItem, { backgroundColor: colors.weightLight }]}>
              <AppText variant="h2" color="weight">
                {stats.weight.change >= 0 ? '+' : ''}{stats.weight.change.toFixed(1)}kg
              </AppText>
              <AppText variant="caption" color="textSecondary">
                ⚖️ 몸무게 변화
              </AppText>
            </View>

            {/* 기록 빈도 */}
            <View style={[styles.summaryItem, { backgroundColor: colors.primaryLight }]}>
              <AppText variant="h2" color="primary">
                {Math.round(stats.recordRate * 100)}%
              </AppText>
              <AppText variant="caption" color="textSecondary">
                📝 기록 빈도
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 수분 섭취 차트 */}
        {stats.water.total > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.card}>
            <AppBarChart
              data={waterChartData}
              colorTheme="water"
              title="💧 수분 섭취 (주간)"
              width={Dimensions.get('window').width - 64}
              height={200}
              suffix="ml"
            />
            <AppText variant="body2" color="textSecondary" align="center" style={styles.chartNote}>
              일평균: {stats.water.average}ml
            </AppText>
          </AppCard>
        )}

        {/* 몸무게 추이 차트 */}
        {stats.weight.data.length > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.card}>
            <AppLineChart
              data={weightChartData}
              colorTheme="weight"
              title="⚖️ 몸무게 추이"
              width={Dimensions.get('window').width - 64}
              height={200}
              suffix="kg"
            />
            <AppText variant="body2" color="textSecondary" align="center" style={styles.chartNote}>
              변화: {stats.weight.change >= 0 ? '+' : ''}{stats.weight.change.toFixed(1)}kg
            </AppText>
          </AppCard>
        )}

        {/* 운동 시간 차트 */}
        {stats.exercise.totalTime > 0 && (
          <AppCard variant="elevated" elevation="sm" style={styles.card}>
            <AppBarChart
              data={exerciseChartData}
              colorTheme="exercise"
              title="🏃 운동 시간 (주간)"
              width={Dimensions.get('window').width - 64}
              height={200}
              suffix="분"
            />
            <AppText variant="body2" color="textSecondary" align="center" style={styles.chartNote}>
              총 운동: {stats.exercise.totalTime}분 ({stats.exercise.count}일)
            </AppText>
          </AppCard>
        )}

        {/* 목표 달성률 차트 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppProgressChart
            data={progressChartData}
            colorThemes={['water', 'exercise', 'primary']}
            title="🎯 목표 달성률"
            width={Dimensions.get('window').width - 64}
            height={220}
          />
        </AppCard>

        {/* 날짜별 기록 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📅 날짜별 기록
          </AppText>
          <View style={styles.dateGrid}>
            {weeklyRecords.map((record) => {
              const hasRecord = record.data.water > 0 ||
                (record.data.meals && record.data.meals.length > 0) ||
                (record.data.exercises && record.data.exercises.length > 0) ||
                record.data.weight !== null ||
                record.data.memo;

              const date = new Date(record.date);
              const dayLabel = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

              return (
                <TouchableOpacity
                  key={record.date}
                  style={[
                    styles.dateItem,
                    hasRecord ? styles.dateItemActive : styles.dateItemInactive,
                  ]}
                  onPress={() => handleDatePress(record.date)}
                >
                  <AppText variant="caption" color="textSecondary">
                    {dayLabel}
                  </AppText>
                  <AppText variant="body2" bold={hasRecord}>
                    {date.getDate()}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </AppCard>

        {/* 데이터 없음 안내 */}
        {stats.recordedDays === 0 && (
          <AppCard variant="outlined" style={styles.emptyCard}>
            <AppText variant="body1" color="textSecondary" align="center">
              📝 아직 기록이 없습니다.
            </AppText>
            <AppText variant="body2" color="textSecondary" align="center" style={styles.emptyText}>
              기록 탭에서 오늘의 활동을 기록해보세요!
            </AppText>
          </AppCard>
        )}
      </ScrollView>

      {/* 날짜별 상세 보기 모달 */}
      {selectedDateRecord && (
        <AppModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          title={formatDateKorean(selectedDate)}
          size="large"
        >
          <View style={styles.detailContent}>
            {/* 수분 */}
            {selectedDateRecord.water > 0 && (
              <View style={styles.detailSection}>
                <AppText variant="h4">💧 수분</AppText>
                <AppText variant="body1" color="water">
                  {selectedDateRecord.water}ml
                </AppText>
              </View>
            )}

            {/* 식단 */}
            {selectedDateRecord.meals && selectedDateRecord.meals.length > 0 && (
              <View style={styles.detailSection}>
                <AppText variant="h4">🍽️ 식단</AppText>
                {selectedDateRecord.meals.map((meal, index) => (
                  <AppText key={index} variant="body2" style={styles.detailItem}>
                    • {meal.time} - {meal.content}
                  </AppText>
                ))}
              </View>
            )}

            {/* 운동 */}
            {selectedDateRecord.exercises && selectedDateRecord.exercises.length > 0 && (
              <View style={styles.detailSection}>
                <AppText variant="h4">🏃 운동</AppText>
                {selectedDateRecord.exercises.map((ex, index) => (
                  <AppText key={index} variant="body2" style={styles.detailItem}>
                    • {ex.time} - {ex.type} ({ex.duration}분)
                  </AppText>
                ))}
              </View>
            )}

            {/* 몸무게 */}
            {selectedDateRecord.weight && (
              <View style={styles.detailSection}>
                <AppText variant="h4">⚖️ 몸무게</AppText>
                <AppText variant="body1" color="weight">
                  {selectedDateRecord.weight.toFixed(1)}kg
                </AppText>
              </View>
            )}

            {/* 메모 */}
            {selectedDateRecord.memo && (
              <View style={styles.detailSection}>
                <AppText variant="h4">📝 메모</AppText>
                <AppText variant="body2" style={styles.memo}>
                  {selectedDateRecord.memo}
                </AppText>
              </View>
            )}

            {/* 기록 없음 */}
            {!selectedDateRecord.water && 
             (!selectedDateRecord.meals || selectedDateRecord.meals.length === 0) &&
             (!selectedDateRecord.exercises || selectedDateRecord.exercises.length === 0) &&
             !selectedDateRecord.weight &&
             !selectedDateRecord.memo && (
              <AppText variant="body1" color="textSecondary" align="center">
                이 날은 기록이 없습니다.
              </AppText>
            )}
          </View>
        </AppModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.sm,
  },
  weekButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  dateRange: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    minWidth: '47%',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
  },
  chartNote: {
    marginTop: spacing.md,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dateItem: {
    flex: 1,
    minWidth: '12%',
    aspectRatio: 1,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dateItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dateItemInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  emptyCard: {
    borderColor: colors.primary,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.sm,
  },
  detailContent: {
    paddingVertical: spacing.sm,
  },
  detailSection: {
    marginBottom: spacing.lg,
  },
  detailItem: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  memo: {
    marginTop: spacing.sm,
    lineHeight: 22,
  },
});

export default StatsScreen;
