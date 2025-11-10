import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { formatDateKorean, getTodayString, getWeekDays, getThisWeek } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import { AppButton, AppCard, AppText, AppInput } from '../../components/common';
import { AppLineChart } from '../../components/charts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const WeightRecordScreen = () => {
  const [weight, setWeight] = useState('');
  const today = getTodayString();

  // Zustand 스토어
  const { records, addWeight, getRecordByDate } = useRecordStore();

  // 오늘의 몸무게
  const todayRecord = getRecordByDate(today);
  const currentWeight = todayRecord.weight;
  const weightHistory = todayRecord.weightHistory || [];

  // 주간 데이터 (최근 7일)
  const { start, end } = getThisWeek();
  const weekDays = getWeekDays(start, end);
  const weeklyData = weekDays.map(date => {
    const record = records[date];
    return {
      date,
      weight: record?.weight || null,
    };
  });

  // 차트 데이터 준비
  const chartData = {
    labels: weeklyData.map(d => {
      const date = new Date(d.date);
      return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    }),
    datasets: [
      {
        data: weeklyData.map(d => d.weight || 0).filter(w => w > 0).length > 0
          ? weeklyData.map(d => d.weight || 0)
          : [0], // 데이터 없으면 0 표시
      },
    ],
  };

  // 유효한 데이터가 있는지 확인
  const hasValidData = weeklyData.some(d => d.weight && d.weight > 0);

  // 몸무게 저장
  const handleSaveWeight = async () => {
    if (!weight || parseFloat(weight) <= 0) {
      return;
    }

    await addWeight(today, weight);
    setWeight('');
  };

  // 최근 기록 (최대 7개)
  const recentRecords = Object.keys(records)
    .filter(date => records[date].weight)
    .sort((a, b) => new Date(b) - new Date(a))
    .slice(0, 7)
    .map(date => ({
      date,
      weight: records[date].weight,
      history: records[date].weightHistory || [],
    }));

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">⚖️ 몸무게</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.date}>
            {formatDateKorean(today)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 현재 몸무게 카드 */}
        {currentWeight && (
          <AppCard variant="elevated" elevation="md" style={styles.card}>
            <AppText variant="caption" color="textSecondary" align="center">
              오늘의 몸무게
            </AppText>
            <AppText variant="h1" align="center" color="weight" style={styles.currentWeight}>
              {currentWeight.toFixed(1)} kg
            </AppText>
          </AppCard>
        )}

        {/* 몸무게 입력 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 몸무게 기록하기
          </AppText>
          <AppInput
            label="몸무게 (kg)"
            value={weight}
            onChangeText={setWeight}
            type="number"
            placeholder="예: 65.5"
          />
          <AppButton
            variant="contained"
            colorTheme="weight"
            icon="scale-bathroom"
            onPress={handleSaveWeight}
            disabled={!weight || parseFloat(weight) <= 0}
          >
            저장
          </AppButton>
        </AppCard>

        {/* 주간 추이 그래프 */}
        {hasValidData && (
          <AppCard variant="elevated" elevation="sm" style={styles.card}>
            <AppText variant="h4" style={styles.sectionTitle}>
              📈 주간 추이
            </AppText>
            <AppLineChart
              data={chartData}
              colorTheme="weight"
              width={Dimensions.get('window').width - 64}
              height={200}
              suffix=" kg"
            />
          </AppCard>
        )}

        {/* 최근 기록 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 최근 기록
          </AppText>
          {recentRecords.length === 0 ? (
            <AppText variant="body2" color="textSecondary" align="center" style={styles.emptyText}>
              아직 기록이 없습니다. 몸무게를 기록해보세요! ⚖️
            </AppText>
          ) : (
            <FlatList
              data={recentRecords}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <View style={styles.recordItem}>
                  <AppText variant="body2" color="textSecondary">
                    {formatDateKorean(item.date)}
                  </AppText>
                  <AppText variant="body1" color="weight" bold>
                    {item.weight.toFixed(1)} kg
                  </AppText>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </AppCard>
      </ScrollView>
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
  date: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  currentWeight: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  emptyText: {
    paddingVertical: spacing.lg,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});

export default WeightRecordScreen;

