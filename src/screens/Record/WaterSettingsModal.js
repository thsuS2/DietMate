import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Portal, Dialog, Button, TextInput, Text } from 'react-native-paper';

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
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel} style={styles.dialog}>
        <Dialog.Title>⚙️ 수분 섭취 설정</Dialog.Title>
        <Dialog.Content>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>숏컷 버튼 설정</Text>
            
            {/* 숏컷 1 */}
            <View style={styles.shortcutSection}>
              <Text style={styles.shortcutLabel}>숏컷 1</Text>
              <TextInput
                label="라벨"
                value={shortcut1Label}
                onChangeText={setShortcut1Label}
                mode="outlined"
                style={styles.input}
                maxLength={10}
              />
              <TextInput
                label="양 (ml)"
                value={shortcut1Amount}
                onChangeText={setShortcut1Amount}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* 숏컷 2 */}
            <View style={styles.shortcutSection}>
              <Text style={styles.shortcutLabel}>숏컷 2</Text>
              <TextInput
                label="라벨"
                value={shortcut2Label}
                onChangeText={setShortcut2Label}
                mode="outlined"
                style={styles.input}
                maxLength={10}
              />
              <TextInput
                label="양 (ml)"
                value={shortcut2Amount}
                onChangeText={setShortcut2Amount}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            {/* 일일 목표 */}
            <View style={styles.goalSection}>
              <Text style={styles.sectionTitle}>일일 목표량</Text>
              <TextInput
                label="목표 (ml)"
                value={dailyGoal}
                onChangeText={setDailyGoal}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>취소</Button>
          <Button onPress={handleSave} mode="contained">저장</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  content: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  shortcutSection: {
    marginBottom: 20,
  },
  shortcutLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  goalSection: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default WaterSettingsModal;

