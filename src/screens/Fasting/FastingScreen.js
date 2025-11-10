import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppCard, AppText, AppButton, AppProgressBar, AppSelectBox } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import useSettingsStore from '../../store/useSettingsStore';
import { getFastingEndTime, isFasting } from '../../utils/date';

const FastingScreen = () => {
  const { settings, setFastingTime } = useSettingsStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fastingStart = settings.fastingStart || '20:00';
  const fastingDuration = settings.fastingDuration || 16;
  const fastingEnd = getFastingEndTime(fastingStart, fastingDuration);
  const isCurrentlyFasting = isFasting(fastingStart, fastingDuration);

  // 단식 시작 시간 옵션
  const startTimeOptions = [
    { label: '저녁 6시 (18:00)', value: '18:00' },
    { label: '저녁 7시 (19:00)', value: '19:00' },
    { label: '저녁 8시 (20:00)', value: '20:00' },
    { label: '저녁 9시 (21:00)', value: '21:00' },
    { label: '저녁 10시 (22:00)', value: '22:00' },
  ];

  // 단식 시간 옵션
  const durationOptions = [
    { label: '12시간', value: '12' },
    { label: '14시간', value: '14' },
    { label: '16시간', value: '16' },
    { label: '18시간', value: '18' },
  ];

  // 단식 시작 시간 변경
  const handleChangeStartTime = async (time) => {
    await setFastingTime(time, fastingDuration);
  };

  // 단식 시간 변경
  const handleChangeDuration = async (duration) => {
    await setFastingTime(fastingStart, parseInt(duration));
  };

  // 현재 시간 표시
  const currentTimeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`;

  // 진행률 계산 (대략적)
  const calculateProgress = () => {
    if (!isCurrentlyFasting) return 0;
    
    const now = currentTime;
    const [startH, startM] = fastingStart.split(':').map(Number);
    const [endH, endM] = fastingEnd.split(':').map(Number);
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    // 다음날로 넘어가는 경우
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
      if (currentMinutes < startMinutes) {
        return (currentMinutes + 24 * 60 - startMinutes) / (fastingDuration * 60);
      }
    }
    
    return Math.min((currentMinutes - startMinutes) / (fastingDuration * 60), 1);
  };

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">⏰ 간헐적 단식</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.currentTime}>
            현재 시각: {currentTimeString}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 단식 상태 카드 */}
        <AppCard 
          variant="elevated" 
          elevation="md" 
          style={[
            styles.card, 
            isCurrentlyFasting ? styles.fastingActiveCard : styles.fastingInactiveCard
          ]}
        >
          <AppText variant="h3" align="center" color={isCurrentlyFasting ? 'fasting' : 'textSecondary'}>
            {isCurrentlyFasting ? '🟣 단식 중' : '⚪️ 식사 가능'}
          </AppText>
          <AppText variant="body1" color="textSecondary" align="center" style={styles.statusText}>
            {isCurrentlyFasting 
              ? `${fastingEnd}까지 단식 중` 
              : `${fastingStart}부터 단식 시작`
            }
          </AppText>
          
          {isCurrentlyFasting && (
            <AppProgressBar
              progress={progress}
              colorTheme="fasting"
              height={16}
              showPercentage
              style={styles.progressBar}
            />
          )}
        </AppCard>

        {/* 단식 시간 설정 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            ⚙️ 단식 시간 설정
          </AppText>

          <AppSelectBox
            label="단식 시작 시간"
            options={startTimeOptions}
            selectedValue={fastingStart}
            onChange={handleChangeStartTime}
            colorTheme="fasting"
          />

          <AppSelectBox
            label="단식 지속 시간"
            options={durationOptions}
            selectedValue={String(fastingDuration)}
            onChange={handleChangeDuration}
            colorTheme="fasting"
          />

          <View style={styles.infoBox}>
            <AppText variant="body2" color="textSecondary">
              📅 단식 시간: {fastingStart} ~ {fastingEnd}
            </AppText>
            <AppText variant="body2" color="textSecondary">
              ⏱️ 단식 시간: {fastingDuration}시간
            </AppText>
          </View>
        </AppCard>

        {/* 알림 설정 안내 */}
        <AppCard variant="outlined" style={styles.notificationCard}>
          <AppText variant="h4" style={styles.cardTitle}>
            🔔 알림 설정
          </AppText>
          <AppText variant="body2" color="textSecondary">
            • 단식 시작 10분 전 알림{'\n'}
            • 단식 종료 시 알림{'\n'}
            {'\n'}
            알림 기능은 설정 탭에서 활성화할 수 있습니다.
          </AppText>
        </AppCard>

        {/* 팁 카드 */}
        <AppCard variant="filled" style={styles.tipCard}>
          <AppText variant="body2" bold style={styles.tipTitle}>
            💡 간헐적 단식 팁
          </AppText>
          <AppText variant="caption" color="textSecondary">
            • 16:8 방식이 가장 일반적입니다 (16시간 단식, 8시간 식사){'\n'}
            • 단식 중에는 물, 블랙커피, 차는 가능합니다{'\n'}
            • 처음에는 12시간부터 시작해보세요{'\n'}
            • 몸 상태를 잘 체크하며 진행하세요
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
  currentTime: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  fastingActiveCard: {
    backgroundColor: colors.fastingLight,
    borderWidth: 2,
    borderColor: colors.fasting,
  },
  fastingInactiveCard: {
    backgroundColor: colors.surface,
  },
  statusText: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  progressBar: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginTop: spacing.md,
  },
  notificationCard: {
    borderColor: colors.fasting,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  tipCard: {
    backgroundColor: colors.fastingLight,
    borderWidth: 1,
    borderColor: colors.fasting,
  },
  tipTitle: {
    marginBottom: spacing.sm,
  },
});

export default FastingScreen;
