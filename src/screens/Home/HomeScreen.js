import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTodayString, formatDateWithDay, getDaysElapsed, getDday, getGreeting, isFasting, getFastingEndTime } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import useSettingsStore from '../../store/useSettingsStore';
import { AppCard, AppText, AppButton, AppProgressBar } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const HomeScreen = () => {
  const navigation = useNavigation();
  const today = getTodayString();

  // Zustand stores
  const { getRecordByDate, addWater, getWeeklyStats, records } = useRecordStore();
  const { settings } = useSettingsStore();

  // 오늘의 기록
  const todayRecord = getRecordByDate(today);

  // 이번 주 통계 (연속 기록 일수 계산용)
  const thisWeek = {
    start: getTodayString(), // 간단하게 오늘부터 7일로 계산
    end: getTodayString(),
  };

  // 경과일 / D-Day 계산
  const daysElapsed = settings.dietStartDate ? getDaysElapsed(settings.dietStartDate) : 0;
  const daysRemaining = settings.dietEndDate ? getDday(settings.dietEndDate) : 0;
  const totalDays = settings.dietStartDate && settings.dietEndDate 
    ? getDaysElapsed(settings.dietStartDate) + daysRemaining 
    : 0;
  const progressRate = totalDays > 0 ? daysElapsed / totalDays : 0;

  // 단식 상태 및 진행률
  const fastingStatus = isFasting(settings.fastingStart, settings.fastingDuration);
  const calculateFastingProgress = () => {
    if (!fastingStatus) return { hours: 0, progress: 0 };
    
    const now = new Date();
    const [startHours, startMinutes] = settings.fastingStart.split(':').map(Number);
    
    // 오늘의 시작 시간
    let fastingStartTime = new Date();
    fastingStartTime.setHours(startHours, startMinutes, 0, 0);
    
    // 만약 시작 시간이 미래라면, 어제부터 시작한 것
    if (fastingStartTime > now) {
      fastingStartTime.setDate(fastingStartTime.getDate() - 1);
    }
    
    const elapsedMs = now - fastingStartTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const progress = Math.min(elapsedHours / settings.fastingDuration, 1);
    
    return {
      hours: Math.floor(elapsedHours),
      progress,
    };
  };
  
  const fastingProgress = calculateFastingProgress();

  // 식단 기록 상태 및 사진
  const mealStatus = {
    breakfast: todayRecord.meals?.some(m => m.type === '아침') || false,
    lunch: todayRecord.meals?.some(m => m.type === '점심') || false,
    dinner: todayRecord.meals?.some(m => m.type === '저녁') || false,
    snack: todayRecord.meals?.some(m => m.type === '간식') || false,
  };
  
  const mealPhotos = todayRecord.meals?.filter(m => m.photo).map(m => m.photo) || [];

  // 운동 통계 및 진행률
  const exerciseTime = todayRecord.exercises?.reduce((sum, ex) => sum + (ex.duration || 0), 0) || 0;
  const exerciseCount = todayRecord.exercises?.length || 0;
  const dailyExerciseGoal = 30; // 일일 운동 목표 (분)
  const exerciseProgress = Math.min(exerciseTime / dailyExerciseGoal, 1);
  
  // 체중 및 목표까지 남은 kg
  const weightRemaining = settings.targetWeight && todayRecord.weight 
    ? todayRecord.weight - settings.targetWeight 
    : null;

  // 연속 기록 일수 계산 (간단 버전)
  const calculateStreak = () => {
    let streak = 0;
    const dateKeys = Object.keys(records).sort().reverse();
    
    for (const dateKey of dateKeys) {
      const record = records[dateKey];
      const hasRecord = record.water > 0 || 
                       (record.meals && record.meals.length > 0) || 
                       (record.exercises && record.exercises.length > 0) ||
                       record.weight !== null ||
                       record.memo;
      
      if (hasRecord) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // 동기부여 메시지
  const getMotivationalMessage = () => {
    if (!settings.dietStartDate) {
      return '다이어트 기간을 설정해보세요!';
    }
    if (progressRate < 0.3) {
      return '시작이 반이에요! 화이팅!';
    }
    if (progressRate < 0.7) {
      return '꾸준히 잘하고 있어요! 💪';
    }
    return '목표가 거의 다 왔어요! 조금만 더!';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="h2">{getGreeting()} 😊</AppText>
          <AppText variant="body2" color="textSecondary">
            {formatDateWithDay(today)}
          </AppText>
        </View>

        {/* D-Day Card */}
        {settings.dietStartDate && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <AppCard variant="elevated" elevation="md" style={styles.ddayCard}>
              <View style={styles.ddayContent}>
                <AppText variant="h3" color="primary">
                  🎯 다이어트 D{daysElapsed > 0 ? '+' : ''}{daysElapsed}일
                </AppText>
                
                <AppProgressBar
                  progress={progressRate}
                  colorTheme="primary"
                  height={12}
                  showPercentage={true}
                  style={styles.ddayProgress}
                />
                
                {settings.dietEndDate && (
                  <AppText variant="body2" color="textSecondary" align="center">
                    목표까지 {daysRemaining}일 남았어요!
                  </AppText>
                )}
                
                <AppText variant="caption" color="primary" align="center" style={styles.motivationalText}>
                  {getMotivationalMessage()}
                </AppText>
              </View>
            </AppCard>
          </TouchableOpacity>
        )}

        {/* Character Section - Placeholder */}
        <AppCard variant="elevated" elevation="md" style={styles.characterCard}>
          <View style={styles.characterContainer}>
            <AppText variant="h1" align="center" style={styles.characterEmoji}>
              🌟
            </AppText>
            <AppText variant="body1" align="center" color="textSecondary">
              캐릭터가 곧 찾아올 거예요!
            </AppText>
            <AppText variant="caption" align="center" color="textSecondary" style={styles.comingSoon}>
              열심히 기록하고 성장시켜보세요 💪
            </AppText>
          </View>
        </AppCard>

        {/* Today's Progress */}
        <AppCard variant="elevated" elevation="sm" style={styles.progressCard}>
          <AppText variant="h3" style={styles.sectionTitle}>
            📊 오늘의 진행 상황
          </AppText>

          {/* 체중 */}
          <View style={styles.progressItem}>
            <View style={styles.progressRow}>
              <AppText variant="body1">⚖️ 체중</AppText>
              <AppText variant="body2" color="weight">
                {todayRecord.weight ? `${todayRecord.weight.toFixed(1)}kg` : '미기록'}
              </AppText>
            </View>
            {weightRemaining !== null && todayRecord.weight && (
              <AppText variant="caption" color="textSecondary" style={styles.weightGoal}>
                목표까지 {weightRemaining > 0 ? `${weightRemaining.toFixed(1)}kg 남음` : '목표 달성! 🎉'}
              </AppText>
            )}
          </View>

          {/* 수분 섭취 */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <AppText variant="body1">💧 수분 섭취</AppText>
              <AppText variant="body2" color="water">
                {todayRecord.water}ml / {settings.dailyWaterGoal}ml
              </AppText>
            </View>
            <AppProgressBar
              progress={todayRecord.water / settings.dailyWaterGoal}
              colorTheme="water"
              height={8}
            />
          </View>

          {/* 식단 기록 */}
          <View style={styles.progressItem}>
            <AppText variant="body1" style={styles.progressLabel}>
              🍽️ 식단 기록
            </AppText>
            <View style={styles.mealStatus}>
              <View style={[styles.mealBadge, mealStatus.breakfast && styles.mealBadgeActive]}>
                <AppText variant="caption" color={mealStatus.breakfast ? 'white' : 'textSecondary'}>
                  {mealStatus.breakfast ? '✅' : '⭕'} 아침
                </AppText>
              </View>
              <View style={[styles.mealBadge, mealStatus.lunch && styles.mealBadgeActive]}>
                <AppText variant="caption" color={mealStatus.lunch ? 'white' : 'textSecondary'}>
                  {mealStatus.lunch ? '✅' : '⭕'} 점심
                </AppText>
              </View>
              <View style={[styles.mealBadge, mealStatus.dinner && styles.mealBadgeActive]}>
                <AppText variant="caption" color={mealStatus.dinner ? 'white' : 'textSecondary'}>
                  {mealStatus.dinner ? '✅' : '⭕'} 저녁
                </AppText>
              </View>
            </View>
            {mealPhotos.length > 0 && (
              <View style={styles.mealPhotos}>
                {mealPhotos.slice(0, 4).map((photo, index) => (
                  <Image 
                    key={index} 
                    source={{ uri: photo }} 
                    style={styles.mealPhoto}
                  />
                ))}
                {mealPhotos.length > 4 && (
                  <View style={[styles.mealPhoto, styles.mealPhotoMore]}>
                    <AppText variant="caption" color="white">
                      +{mealPhotos.length - 4}
                    </AppText>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* 운동 */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <AppText variant="body1">🏃 운동</AppText>
              <AppText variant="body2" color="exercise">
                {exerciseTime}분 ({exerciseCount}회)
              </AppText>
            </View>
            <AppProgressBar
              progress={exerciseProgress}
              colorTheme="exercise"
              height={8}
            />
          </View>

          {/* 단식 */}
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <AppText variant="body1">⏱️ 단식</AppText>
              <AppText variant="body2" color="fasting">
                {fastingStatus 
                  ? `진행 중 (${fastingProgress.hours}h / ${settings.fastingDuration}h)` 
                  : '완료/시작 전'}
              </AppText>
            </View>
            {fastingStatus && (
              <AppProgressBar
                progress={fastingProgress.progress}
                colorTheme="fasting"
                height={8}
              />
            )}
          </View>
        </AppCard>

        {/* Weekly Summary */}
        <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
          <AppCard variant="elevated" elevation="sm" style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <AppText variant="h3">📈 이번 주 요약</AppText>
              <AppText variant="body2" color="primary">
                자세히 보기 →
              </AppText>
            </View>
            
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <AppText variant="h2" color="primary">{streak}일</AppText>
                <AppText variant="caption" color="textSecondary">연속 기록</AppText>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryItem}>
                <AppText variant="h2" color="primary">
                  {Math.round((todayRecord.water / settings.dailyWaterGoal) * 100)}%
                </AppText>
                <AppText variant="caption" color="textSecondary">오늘 수분</AppText>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryItem}>
                <AppText variant="h2" color="primary">{exerciseCount}회</AppText>
                <AppText variant="caption" color="textSecondary">오늘 운동</AppText>
              </View>
            </View>
          </AppCard>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  ddayCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  ddayContent: {
    alignItems: 'center',
  },
  ddayProgress: {
    marginVertical: spacing.md,
  },
  motivationalText: {
    marginTop: spacing.sm,
  },
  characterCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  characterContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  characterEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  comingSoon: {
    marginTop: spacing.xs,
  },
  progressCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  progressItem: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    marginBottom: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightGoal: {
    marginTop: spacing.xs,
  },
  mealStatus: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  mealBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mealBadgeActive: {
    backgroundColor: colors.meal,
    borderColor: colors.meal,
  },
  mealPhotos: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  mealPhoto: {
    width: 50,
    height: 50,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.surface,
  },
  mealPhotoMore: {
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
});

export default HomeScreen;
