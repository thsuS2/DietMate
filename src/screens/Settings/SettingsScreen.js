import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import useSettingsStore from '../../store/useSettingsStore';
import useWalletStore from '../../store/useWalletStore';
import { scheduleAllNotifications, cancelAllNotifications } from '../../utils/notify';
import { AppCard, AppText, AppButton, AppInput, AppModal, AppSelectBox } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const SettingsScreen = () => {
  const { settings, updateSettings, setDietPeriod, setUserInfo, setFastingTime } = useSettingsStore();
  const { budget, setBudget } = useWalletStore();

  // 모달 상태
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  const [fastingModalVisible, setFastingModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  // 임시 입력값
  const [tempValues, setTempValues] = useState({});

  // BMI 계산
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '-';
    if (bmi < 18.5) return '저체중';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중';
    return '비만';
  };

  const currentBMI = calculateBMI(settings.currentWeight, settings.height);

  // 프로필 저장
  const handleSaveProfile = async () => {
    await setUserInfo({
      currentWeight: parseFloat(tempValues.currentWeight) || settings.currentWeight,
      height: parseFloat(tempValues.height) || settings.height,
      age: parseInt(tempValues.age) || settings.age,
      gender: tempValues.gender || settings.gender,
    });
    await updateSettings({
      targetWeight: parseFloat(tempValues.targetWeight) || settings.targetWeight,
    });
    setProfileModalVisible(false);
    setTempValues({});
  };

  // 다이어트 기간 저장
  const handleSaveDiet = async () => {
    await setDietPeriod(
      tempValues.dietStartDate || settings.dietStartDate,
      tempValues.dietEndDate || settings.dietEndDate,
      parseFloat(tempValues.targetWeight) || settings.targetWeight
    );
    setDietModalVisible(false);
    setTempValues({});
  };

  // 목표 저장
  const handleSaveGoals = async () => {
    await updateSettings({
      dailyWaterGoal: parseInt(tempValues.dailyWaterGoal) || settings.dailyWaterGoal,
      dailyStepsGoal: parseInt(tempValues.dailyStepsGoal) || settings.dailyStepsGoal,
    });
    setGoalsModalVisible(false);
    setTempValues({});
  };

  // 단식 설정 저장
  const handleSaveFasting = async () => {
    await setFastingTime(
      tempValues.fastingStart || settings.fastingStart,
      parseInt(tempValues.fastingDuration) || settings.fastingDuration
    );
    
    // 알림 재스케줄링
    if (settings.notifications && settings.fastingReminderEnabled) {
      await scheduleAllNotifications(settings);
    }
    
    setFastingModalVisible(false);
    setTempValues({});
  };

  // 예산 저장
  const handleSaveBudget = async () => {
    await setBudget(
      parseInt(tempValues.monthlyBudget?.replace(/,/g, '')) || budget.monthly,
      budget.categories
    );
    setBudgetModalVisible(false);
    setTempValues({});
  };

  // 알림 설정 저장
  const handleSaveNotification = async () => {
    await updateSettings({
      notifications: tempValues.notifications ?? settings.notifications,
      recordReminderTime: tempValues.recordReminderTime || settings.recordReminderTime,
      fastingReminderEnabled: tempValues.fastingReminderEnabled ?? settings.fastingReminderEnabled,
    });
    
    // 알림 재스케줄링
    await scheduleAllNotifications(settings);
    
    setNotificationModalVisible(false);
    setTempValues({});
  };

  // 알림 전체 ON/OFF 핸들러
  const handleNotificationToggle = async (value) => {
    await updateSettings({ notifications: value });
    
    if (value) {
      // 알림 켜면 스케줄링
      await scheduleAllNotifications(settings);
    } else {
      // 알림 끄면 모두 취소
      await cancelAllNotifications();
    }
  };

  // 데이터 초기화
  const handleDataReset = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터가 삭제됩니다.\n정말 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            // TODO: 전체 데이터 초기화 로직
            Alert.alert('알림', '데이터가 초기화되었습니다.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            👤 프로필
          </AppText>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                currentWeight: settings.currentWeight?.toString() || '',
                targetWeight: settings.targetWeight?.toString() || '',
                height: settings.height?.toString() || '',
                age: settings.age?.toString() || '',
                gender: settings.gender || '',
              });
              setProfileModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">체중 / 목표</AppText>
              <AppText variant="caption" color="textSecondary">
                {settings.currentWeight ? `현재 ${settings.currentWeight}kg` : '미설정'} / 
                {settings.targetWeight ? ` 목표 ${settings.targetWeight}kg` : ' 미설정'}
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>

          {currentBMI && (
            <View style={styles.bmiInfo}>
              <AppText variant="body2" color="textSecondary">
                BMI: {currentBMI} ({getBMICategory(currentBMI)})
              </AppText>
            </View>
          )}
        </AppCard>

        {/* Diet Settings */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            📊 다이어트 설정
          </AppText>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                dietStartDate: settings.dietStartDate || '',
                dietEndDate: settings.dietEndDate || '',
                targetWeight: settings.targetWeight?.toString() || '',
              });
              setDietModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">다이어트 기간</AppText>
              <AppText variant="caption" color="textSecondary">
                {settings.dietStartDate || '미설정'} ~ {settings.dietEndDate || '미설정'}
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* Goals */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            🎯 목표 설정
          </AppText>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                dailyWaterGoal: settings.dailyWaterGoal?.toString() || '2000',
                dailyStepsGoal: settings.dailyStepsGoal?.toString() || '10000',
              });
              setGoalsModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">일일 목표</AppText>
              <AppText variant="caption" color="textSecondary">
                수분 {settings.dailyWaterGoal}ml / 운동 30분 / 걸음 {settings.dailyStepsGoal}
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* Fasting Settings */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            ⏱️ 단식 설정
          </AppText>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                fastingStart: settings.fastingStart || '20:00',
                fastingDuration: settings.fastingDuration?.toString() || '16',
              });
              setFastingModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">간헐적 단식</AppText>
              <AppText variant="caption" color="textSecondary">
                {settings.fastingStart} 시작 / {settings.fastingDuration}시간
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* Budget Settings */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            💰 예산 설정
          </AppText>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                monthlyBudget: budget.monthly?.toLocaleString('ko-KR') || '2000000',
              });
              setBudgetModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">월별 총 예산</AppText>
              <AppText variant="caption" color="textSecondary">
                {budget.monthly.toLocaleString()}원
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* Notification Settings */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            🔔 알림 설정
          </AppText>
          
          <View style={styles.settingItem}>
            <AppText variant="body1">알림 전체</AppText>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.notifications ? colors.primary : colors.textDisabled}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setTempValues({
                recordReminderTime: settings.recordReminderTime || '22:00',
                fastingReminderEnabled: settings.fastingReminderEnabled ?? true,
              });
              setNotificationModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <AppText variant="body1">알림 시간 설정</AppText>
              <AppText variant="caption" color="textSecondary">
                기록 알림: {settings.recordReminderTime}
              </AppText>
            </View>
            <AppText variant="body2" color="primary">→</AppText>
          </TouchableOpacity>
        </AppCard>

        {/* App Info */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            ℹ️ 앱 정보
          </AppText>
          
          <View style={styles.settingItem}>
            <AppText variant="body1">버전</AppText>
            <AppText variant="body2" color="textSecondary">1.0.0</AppText>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDataReset}
          >
            <AppText variant="body1" color="error" align="center">
              데이터 초기화
            </AppText>
          </TouchableOpacity>
        </AppCard>
      </ScrollView>

      {/* Profile Edit Modal */}
      <AppModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        title="프로필 설정"
        size="large"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="현재 체중 (kg)"
            value={tempValues.currentWeight}
            onChangeText={(text) => setTempValues({ ...tempValues, currentWeight: text })}
            keyboardType="decimal-pad"
            placeholder="65.5"
          />
          <AppInput
            label="목표 체중 (kg)"
            value={tempValues.targetWeight}
            onChangeText={(text) => setTempValues({ ...tempValues, targetWeight: text })}
            keyboardType="decimal-pad"
            placeholder="60.0"
          />
          <AppInput
            label="키 (cm)"
            value={tempValues.height}
            onChangeText={(text) => setTempValues({ ...tempValues, height: text })}
            keyboardType="number-pad"
            placeholder="165"
          />
          <AppInput
            label="나이"
            value={tempValues.age}
            onChangeText={(text) => setTempValues({ ...tempValues, age: text })}
            keyboardType="number-pad"
            placeholder="25"
          />
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setProfileModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveProfile}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>

      {/* Diet Period Modal */}
      <AppModal
        visible={dietModalVisible}
        onClose={() => setDietModalVisible(false)}
        title="다이어트 기간 설정"
        size="medium"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="시작일 (YYYY-MM-DD)"
            value={tempValues.dietStartDate}
            onChangeText={(text) => setTempValues({ ...tempValues, dietStartDate: text })}
            placeholder="2025-11-01"
          />
          <AppInput
            label="목표일 (YYYY-MM-DD)"
            value={tempValues.dietEndDate}
            onChangeText={(text) => setTempValues({ ...tempValues, dietEndDate: text })}
            placeholder="2025-12-31"
          />
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setDietModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveDiet}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>

      {/* Goals Modal */}
      <AppModal
        visible={goalsModalVisible}
        onClose={() => setGoalsModalVisible(false)}
        title="목표 설정"
        size="medium"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="수분 섭취 목표 (ml)"
            value={tempValues.dailyWaterGoal}
            onChangeText={(text) => setTempValues({ ...tempValues, dailyWaterGoal: text })}
            keyboardType="number-pad"
            placeholder="2000"
          />
          <AppInput
            label="걸음 수 목표"
            value={tempValues.dailyStepsGoal}
            onChangeText={(text) => setTempValues({ ...tempValues, dailyStepsGoal: text })}
            keyboardType="number-pad"
            placeholder="10000"
          />
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setGoalsModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveGoals}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>

      {/* Fasting Modal */}
      <AppModal
        visible={fastingModalVisible}
        onClose={() => setFastingModalVisible(false)}
        title="단식 설정"
        size="medium"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="시작 시간 (HH:mm)"
            value={tempValues.fastingStart}
            onChangeText={(text) => setTempValues({ ...tempValues, fastingStart: text })}
            placeholder="20:00"
          />
          <AppSelectBox
            label="단식 시간"
            options={[
              { label: '12시간', value: '12' },
              { label: '14시간', value: '14' },
              { label: '16시간', value: '16' },
              { label: '18시간', value: '18' },
              { label: '20시간', value: '20' },
            ]}
            selectedValue={tempValues.fastingDuration || settings.fastingDuration.toString()}
            onValueChange={(value) => setTempValues({ ...tempValues, fastingDuration: value })}
          />
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setFastingModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveFasting}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>

      {/* Budget Modal */}
      <AppModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        title="예산 설정"
        size="small"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="월별 총 예산 (원)"
            value={tempValues.monthlyBudget}
            onChangeText={(text) => {
              const numbers = text.replace(/[^0-9]/g, '');
              const formatted = numbers ? parseInt(numbers, 10).toLocaleString('ko-KR') : '';
              setTempValues({ ...tempValues, monthlyBudget: formatted });
            }}
            keyboardType="number-pad"
            placeholder="2,000,000"
          />
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setBudgetModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveBudget}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>

      {/* Notification Modal */}
      <AppModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        title="알림 설정"
        size="medium"
      >
        <View style={styles.modalContent}>
          <AppInput
            label="기록 알림 시간 (HH:mm)"
            value={tempValues.recordReminderTime}
            onChangeText={(text) => setTempValues({ ...tempValues, recordReminderTime: text })}
            placeholder="22:00"
          />
          
          <View style={styles.switchRow}>
            <AppText variant="body1">단식 알림</AppText>
            <Switch
              value={tempValues.fastingReminderEnabled ?? settings.fastingReminderEnabled}
              onValueChange={(value) => setTempValues({ ...tempValues, fastingReminderEnabled: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={(tempValues.fastingReminderEnabled ?? settings.fastingReminderEnabled) ? colors.primary : colors.textDisabled}
            />
          </View>
          
          <View style={styles.modalButtons}>
            <AppButton
              variant="outlined"
              colorTheme="primary"
              onPress={() => setNotificationModalVisible(false)}
              style={styles.modalButton}
            >
              취소
            </AppButton>
            <AppButton
              variant="contained"
              colorTheme="primary"
              onPress={handleSaveNotification}
              style={styles.modalButton}
            >
              저장
            </AppButton>
          </View>
        </View>
      </AppModal>
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
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingLeft: {
    flex: 1,
  },
  bmiInfo: {
    paddingTop: spacing.sm,
  },
  dangerButton: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.sm,
  },
  modalContent: {
    paddingVertical: spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});

export default SettingsScreen;
