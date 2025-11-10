import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { formatDateKorean, getTodayString } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import { AppButton, AppCard, AppText, AppInput, AppSelectBox, AppRadioButton } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const ExerciseRecordScreen = () => {
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const today = getTodayString();

  // Zustand 스토어
  const { getRecordByDate, addExercise } = useRecordStore();

  // 오늘의 운동 기록
  const todayRecord = getRecordByDate(today);
  const exercises = todayRecord.exercises || [];

  // 운동 종류 옵션
  const exerciseOptions = [
    { label: '걷기', value: '걷기' },
    { label: '러닝', value: '러닝' },
    { label: '자전거', value: '자전거' },
    { label: '수영', value: '수영' },
    { label: '웨이트', value: '웨이트' },
    { label: '요가', value: '요가' },
    { label: '필라테스', value: '필라테스' },
    { label: '스트레칭', value: '스트레칭' },
    { label: '기타', value: '기타' },
  ];

  // 강도 옵션
  const intensityOptions = [
    { label: '낮음', value: 'low' },
    { label: '보통', value: 'medium' },
    { label: '높음', value: 'high' },
  ];

  // 운동 저장
  const handleSaveExercise = async () => {
    if (!exerciseType || !duration || parseFloat(duration) <= 0) {
      return;
    }

    const exercise = {
      type: exerciseType,
      duration: parseFloat(duration),
      intensity,
    };

    await addExercise(today, exercise);
    
    // 입력 필드 초기화
    setExerciseType('');
    setDuration('');
    setIntensity('medium');
  };

  // 강도 표시 텍스트
  const getIntensityText = (intensity) => {
    const map = {
      low: '낮음 🟢',
      medium: '보통 🟡',
      high: '높음 🔴',
    };
    return map[intensity] || intensity;
  };

  // 총 운동 시간
  const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">🏃 운동</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.date}>
            {formatDateKorean(today)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 오늘의 총 운동 시간 */}
        {totalDuration > 0 && (
          <AppCard variant="elevated" elevation="md" style={styles.card}>
            <AppText variant="caption" color="textSecondary" align="center">
              오늘의 총 운동 시간
            </AppText>
            <AppText variant="h1" align="center" color="exercise" style={styles.totalTime}>
              {totalDuration} 분
            </AppText>
          </AppCard>
        )}

        {/* 운동 입력 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 운동 기록하기
          </AppText>

          <AppSelectBox
            label="운동 종류"
            options={exerciseOptions}
            selectedValue={exerciseType}
            onChange={setExerciseType}
            placeholder="운동을 선택하세요"
            colorTheme="exercise"
          />

          <AppInput
            label="운동 시간 (분)"
            value={duration}
            onChangeText={setDuration}
            type="number"
            placeholder="예: 30"
          />

          <AppText variant="body2" style={styles.intensityLabel}>
            운동 강도
          </AppText>
          <AppRadioButton
            options={intensityOptions}
            selectedValue={intensity}
            onChange={setIntensity}
            colorTheme="exercise"
            direction="row"
          />

          <AppButton
            variant="contained"
            colorTheme="exercise"
            icon="plus"
            onPress={handleSaveExercise}
            disabled={!exerciseType || !duration || parseFloat(duration) <= 0}
            style={styles.saveButton}
          >
            저장
          </AppButton>
        </AppCard>

        {/* 오늘의 운동 기록 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 오늘의 기록
          </AppText>
          {exercises.length === 0 ? (
            <AppText variant="body2" color="textSecondary" align="center" style={styles.emptyText}>
              아직 기록이 없습니다. 운동을 기록해보세요! 🏃
            </AppText>
          ) : (
            <FlatList
              data={exercises.slice().reverse()}
              keyExtractor={(item, index) => `${item.time}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.exerciseItem}>
                  <View style={styles.exerciseInfo}>
                    <AppText variant="body1" bold>
                      {item.type}
                    </AppText>
                    <AppText variant="caption" color="textSecondary">
                      {item.time}
                    </AppText>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <AppText variant="body1" color="exercise" bold>
                      {item.duration}분
                    </AppText>
                    <AppText variant="caption" color="textSecondary">
                      {getIntensityText(item.intensity)}
                    </AppText>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </AppCard>

        {/* 걸음수 (추후 연동) */}
        <AppCard variant="outlined" style={styles.stepsCard}>
          <AppText variant="body2" color="textSecondary" align="center">
            🚶 걸음수 연동은 추후 업데이트 예정입니다.
          </AppText>
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
  totalTime: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  intensityLabel: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  emptyText: {
    paddingVertical: spacing.lg,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseDetails: {
    alignItems: 'flex-end',
  },
  stepsCard: {
    borderColor: colors.exercise,
    paddingVertical: spacing.lg,
  },
});

export default ExerciseRecordScreen;

