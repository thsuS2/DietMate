import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppModal, AppInput, AppButton, AppText } from '../../components/common';
import { spacing } from '../../theme/spacing';

const WaterSettingsModal = ({ visible, onDismiss, onSave, initialShortcuts, initialGoal }) => {
  const [shortcut1Label, setShortcut1Label] = useState(initialShortcuts[0]?.label || '컵');
  const [shortcut1Amount, setShortcut1Amount] = useState(String(initialShortcuts[0]?.amount || 200));
  const [shortcut2Label, setShortcut2Label] = useState(initialShortcuts[1]?.label || '텀블러');
  const [shortcut2Amount, setShortcut2Amount] = useState(String(initialShortcuts[1]?.amount || 500));
  const [dailyGoal, setDailyGoal] = useState(String(initialGoal || 2000));

  const handleSave = () => {
    const shortcuts = [
      { label: shortcut1Label, amount: parseInt(shortcut1Amount) || 200 },
      { label: shortcut2Label, amount: parseInt(shortcut2Amount) || 500 },
    ];
    const goal = parseInt(dailyGoal) || 2000;

    onSave(shortcuts, goal);
    onDismiss();
  };

  const handleCancel = () => {
    // 원래 값으로 되돌리기
    setShortcut1Label(initialShortcuts[0]?.label || '컵');
    setShortcut1Amount(String(initialShortcuts[0]?.amount || 200));
    setShortcut2Label(initialShortcuts[1]?.label || '텀블러');
    setShortcut2Amount(String(initialShortcuts[1]?.amount || 500));
    setDailyGoal(String(initialGoal || 2000));
    onDismiss();
  };

  return (
    <AppModal
      visible={visible}
      onClose={handleCancel}
      title="⚙️ 수분 섭취 설정"
      size="medium"
    >
      <View style={styles.content}>
        <AppText variant="h4" style={styles.sectionTitle}>
          숏컷 버튼 설정
        </AppText>
        
        {/* 숏컷 1 */}
        <View style={styles.shortcutSection}>
          <AppText variant="body2" color="textSecondary" style={styles.shortcutLabel}>
            숏컷 1
          </AppText>
          <AppInput
            label="라벨"
            value={shortcut1Label}
            onChangeText={setShortcut1Label}
            placeholder="예: 컵"
            maxLength={10}
          />
          <AppInput
            label="양 (ml)"
            value={shortcut1Amount}
            onChangeText={setShortcut1Amount}
            type="number"
            placeholder="예: 200"
          />
        </View>

        {/* 숏컷 2 */}
        <View style={styles.shortcutSection}>
          <AppText variant="body2" color="textSecondary" style={styles.shortcutLabel}>
            숏컷 2
          </AppText>
          <AppInput
            label="라벨"
            value={shortcut2Label}
            onChangeText={setShortcut2Label}
            placeholder="예: 텀블러"
            maxLength={10}
          />
          <AppInput
            label="양 (ml)"
            value={shortcut2Amount}
            onChangeText={setShortcut2Amount}
            type="number"
            placeholder="예: 500"
          />
        </View>

        {/* 일일 목표 */}
        <View style={styles.goalSection}>
          <AppText variant="h4" style={styles.sectionTitle}>
            일일 목표량
          </AppText>
          <AppInput
            label="목표 (ml)"
            value={dailyGoal}
            onChangeText={setDailyGoal}
            type="number"
            placeholder="예: 2000"
          />
        </View>

        {/* 버튼들 */}
        <View style={styles.actions}>
          <AppButton
            variant="outlined"
            colorTheme="black"
            onPress={handleCancel}
            style={styles.actionButton}
          >
            취소
          </AppButton>
          <AppButton
            variant="contained"
            colorTheme="water"
            onPress={handleSave}
            style={styles.actionButton}
          >
            저장
          </AppButton>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  shortcutSection: {
    marginBottom: spacing.lg,
  },
  shortcutLabel: {
    marginBottom: spacing.sm,
  },
  goalSection: {
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});

export default WaterSettingsModal;
