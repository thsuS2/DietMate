import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Button, Card, ProgressBar, IconButton } from 'react-native-paper';
import { formatDateKorean, getTodayString, formatTime } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import useSettingsStore from '../../store/useSettingsStore';
import WaterSettingsModal from './WaterSettingsModal';

const WaterRecordScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const today = getTodayString();

  // Zustand 스토어
  const { records, addWater, getRecordByDate } = useRecordStore();
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

  // 오늘의 수분 기록 내역 (역순)
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
          <Text style={styles.title}>💧 수분 섭취</Text>
          <Text style={styles.date}>{formatDateKorean(today)}</Text>
        </View>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* 진행률 카드 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.amountText}>
              {currentWater.toLocaleString()} ml / {dailyGoal.toLocaleString()} ml
            </Text>
            <ProgressBar
              progress={progress}
              color="#2196F3"
              style={styles.progressBar}
            />
            <Text style={styles.percentText}>
              {Math.round(progress * 100)}% 달성
            </Text>
          </Card.Content>
        </Card>

        {/* 숏컷 버튼들 */}
        <View style={styles.shortcutsContainer}>
          {waterShortcuts.map((shortcut, index) => (
            <Button
              key={index}
              mode="contained"
              onPress={() => handleAddWater(shortcut.amount, shortcut.label)}
              style={styles.shortcutButton}
              icon="water"
              contentStyle={styles.shortcutButtonContent}
            >
              +{shortcut.amount}ml ({shortcut.label})
            </Button>
          ))}
        </View>

        {/* 기록 내역 */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.historyTitle}>📝 오늘의 기록</Text>
            {waterHistory.length === 0 ? (
              <Text style={styles.emptyText}>
                아직 기록이 없습니다. 물을 마시고 기록해보세요! 💧
              </Text>
            ) : (
              <FlatList
                data={waterHistory.slice().reverse()}
                keyExtractor={(item, index) => `${item.time}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Text style={styles.historyTime}>{item.time}</Text>
                    <Text style={styles.historyAmount}>
                      +{item.amount}ml {item.label && `(${item.label})`}
                    </Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </Card.Content>
        </Card>

        {/* 목표 달성 메시지 */}
        {progress >= 1 && (
          <Card style={[styles.card, styles.achievementCard]}>
            <Card.Content>
              <Text style={styles.achievementText}>
                🎉 오늘의 수분 목표를 달성했습니다!
              </Text>
            </Card.Content>
          </Card>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2196F3',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  percentText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  shortcutButton: {
    flex: 1,
    borderRadius: 8,
  },
  shortcutButtonContent: {
    paddingVertical: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  achievementCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  achievementText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
});

export default WaterRecordScreen;

