import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import { formatDateKorean, getTodayString } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import useSettingsStore from '../../store/useSettingsStore';
import WaterSettingsModal from './WaterSettingsModal';
import { AppButton, AppCard, AppText, AppProgressBar } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const WaterRecordScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const today = getTodayString();

  // Zustand 스토어
  const { getRecordByDate, addWater } = useRecordStore();
  const { settings, setWaterShortcuts, setDailyWaterGoal } = useSettingsStore();

  // 오늘의 수분 섭취량
  const todayRecord = getRecordByDate(today);
  const currentWater = todayRecord.water || 0;
  const dailyGoal = settings.dailyWaterGoal || 2000;
  const progress = Math.min(currentWater / dailyGoal, 1);
  const waterShortcuts = settings.waterShortcuts || [
    { label: '컵', amount: 200 },
    { label: '텀블러', amount: 500 },
  ];

  // 오늘의 수분 기록 내역
  const waterHistory = todayRecord.waterHistory || [];

  // 물 추가 핸들러
  const handleAddWater = async (amount, label) => {
    await addWater(today, amount, label);
  };

  // 설정 저장 핸들러
  const handleSaveSettings = async (shortcuts, goal) => {
    await setWaterShortcuts(shortcuts);
    await setDailyWaterGoal(goal);
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">💧 수분 섭취</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.date}>
            {formatDateKorean(today)}
          </AppText>
        </View>
        <IconButton
          icon="cog"
          size={24}
          iconColor={colors.text}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* 진행률 카드 */}
        <AppCard variant="elevated" elevation="md" style={styles.card}>
          <AppText variant="h1" align="center" style={styles.amountText} color="water">
            {currentWater.toLocaleString()} ml / {dailyGoal.toLocaleString()} ml
          </AppText>
          <AppProgressBar
            progress={progress}
            colorTheme="water"
            height={12}
            showPercentage
          />
        </AppCard>

        {/* 숏컷 버튼들 */}
        <View style={styles.shortcutsContainer}>
          {waterShortcuts.map((shortcut, index) => (
            <AppButton
              key={index}
              variant="contained"
              colorTheme="water"
              icon="water"
              onPress={() => handleAddWater(shortcut.amount, shortcut.label)}
              style={styles.shortcutButton}
            >
              +{shortcut.amount}ml ({shortcut.label})
            </AppButton>
          ))}
        </View>

        {/* 기록 내역 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.historyTitle}>
            📝 오늘의 기록
          </AppText>
          {waterHistory.length === 0 ? (
            <AppText variant="body2" color="textSecondary" align="center" style={styles.emptyText}>
              아직 기록이 없습니다. 물을 마시고 기록해보세요! 💧
            </AppText>
          ) : (
            <FlatList
              data={waterHistory.slice().reverse()}
              keyExtractor={(item, index) => `${item.time}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <AppText variant="body2" color="textSecondary">
                    {item.time}
                  </AppText>
                  <AppText variant="body1" color="water" bold>
                    +{item.amount}ml {item.label && `(${item.label})`}
                  </AppText>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </AppCard>

        {/* 목표 달성 메시지 */}
        {progress >= 1 && (
          <AppCard variant="filled" style={styles.achievementCard}>
            <AppText variant="body1" align="center" color="water" bold>
              🎉 오늘의 수분 목표를 달성했습니다!
            </AppText>
          </AppCard>
        )}
      </ScrollView>

      {/* 설정 모달 */}
      <WaterSettingsModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSaveSettings}
        initialShortcuts={waterShortcuts}
        initialGoal={dailyGoal}
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
  amountText: {
    marginBottom: spacing.md,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  shortcutButton: {
    flex: 1,
  },
  historyTitle: {
    marginBottom: spacing.md,
  },
  emptyText: {
    paddingVertical: spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  achievementCard: {
    backgroundColor: colors.waterLight,
    borderWidth: 1,
    borderColor: colors.water,
    paddingVertical: spacing.md,
  },
});

export default WaterRecordScreen;
