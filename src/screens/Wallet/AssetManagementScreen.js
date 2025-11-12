import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import useWalletStore from '../../store/useWalletStore';
import { AppCard, AppText, AppButton, AppModal } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ASSET_TYPES = [
  { type: 'bank', name: '은행', icon: '🏦', color: '#3498DB' },
  { type: 'cash', name: '현금', icon: '💵', color: '#27AE60' },
  { type: 'card', name: '카드', icon: '💳', color: '#9B59B6' },
  { type: 'savings', name: '적금', icon: '💰', color: '#E67E22' },
];

const AssetManagementScreen = ({ navigation }) => {
  const { assets, addAsset, updateAsset, deleteAsset, getTotalAssets } = useWalletStore();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // 총 자산
  const totalAssets = getTotalAssets();

  // 타입별 그룹핑
  const groupedAssets = ASSET_TYPES.map(assetType => ({
    ...assetType,
    items: assets.filter(a => a.type === assetType.type),
    total: assets
      .filter(a => a.type === assetType.type)
      .reduce((sum, a) => sum + (a.balance || 0), 0),
  }));

  // 자산 추가 핸들러
  const handleAddAsset = () => {
    setEditingAsset(null);
    setAddModalVisible(true);
  };

  // 자산 삭제
  const handleDeleteAsset = (assetId, assetName) => {
    Alert.alert(
      '자산 삭제',
      `'${assetName}' 자산을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteAsset(assetId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 총 자산 카드 */}
        <AppCard variant="elevated" elevation="md" style={styles.totalCard}>
          <AppText variant="body2" color="textSecondary" align="center">
            총 자산
          </AppText>
          <AppText variant="h1" color="primary" align="center" style={styles.totalAmount}>
            {totalAssets.toLocaleString()}원
          </AppText>
        </AppCard>

        {/* 자산 타입별 */}
        {groupedAssets.map((group) => (
          <AppCard key={group.type} variant="elevated" elevation="sm" style={styles.card}>
            <View style={styles.typeHeader}>
              <View style={styles.typeLeft}>
                <View style={[styles.typeIcon, { backgroundColor: group.color }]}>
                  <AppText variant="h3">{group.icon}</AppText>
                </View>
                <AppText variant="h4">{group.name}</AppText>
              </View>
              <AppText variant="h4" color="primary">
                {group.total.toLocaleString()}원
              </AppText>
            </View>

            {/* 자산 목록 */}
            {group.items.length > 0 ? (
              group.items.map((asset) => (
                <View key={asset.id} style={styles.assetItem}>
                  <View style={styles.assetLeft}>
                    <AppText variant="body1">{asset.name}</AppText>
                    {asset.memo && (
                      <AppText variant="caption" color="textSecondary">
                        {asset.memo}
                      </AppText>
                    )}
                  </View>
                  <View style={styles.assetRight}>
                    <AppText variant="body1" bold>
                      {asset.balance.toLocaleString()}원
                    </AppText>
                    <TouchableOpacity
                      onPress={() => handleDeleteAsset(asset.id, asset.name)}
                      style={styles.deleteButton}
                    >
                      <MaterialCommunityIcons name="close" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <AppText variant="caption" color="textSecondary" align="center" style={styles.emptyText}>
                등록된 {group.name}이 없습니다
              </AppText>
            )}

            {/* 추가 버튼 */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditingAsset({ type: group.type });
                setAddModalVisible(true);
              }}
            >
              <AppText variant="caption" color="primary">
                + {group.name} 추가
              </AppText>
            </TouchableOpacity>
          </AppCard>
        ))}
      </ScrollView>

      {/* 자산 추가/수정 모달 */}
      <AssetModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingAsset(null);
        }}
        asset={editingAsset}
      />
    </View>
  );
};

// 자산 추가/수정 모달
const AssetModal = ({ visible, onClose, asset }) => {
  const { addAsset } = useWalletStore();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [memo, setMemo] = useState('');

  const assetType = ASSET_TYPES.find(t => t.type === asset?.type) || ASSET_TYPES[0];

  const handleSave = async () => {
    if (!name) {
      alert('이름을 입력해주세요');
      return;
    }

    if (!balance || parseFloat(balance.replace(/,/g, '')) <= 0) {
      alert('잔액을 입력해주세요');
      return;
    }

    const newAsset = {
      name,
      balance: parseFloat(balance.replace(/,/g, '')),
      memo,
      type: asset?.type || 'bank',
      icon: assetType.icon,
      color: assetType.color,
    };

    await addAsset(newAsset);
    setName('');
    setBalance('');
    setMemo('');
    onClose();
  };

  const formatAmount = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return parseInt(numbers, 10).toLocaleString('ko-KR');
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={`${assetType.name} 추가`}
      size="medium"
    >
      <View style={styles.modalContent}>
        <View style={styles.typeDisplay}>
          <AppText variant="h2">{assetType.icon}</AppText>
          <AppText variant="h4">{assetType.name}</AppText>
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="자산 이름 (예: 국민은행 주거래)"
        />

        <TextInput
          style={styles.input}
          value={balance}
          onChangeText={(text) => setBalance(formatAmount(text))}
          placeholder="잔액"
          keyboardType="number-pad"
        />

        <TextInput
          style={[styles.input, styles.memoInput]}
          value={memo}
          onChangeText={setMemo}
          placeholder="메모 (선택)"
          multiline
        />

        <View style={styles.modalButtons}>
          <AppButton
            variant="outlined"
            colorTheme="primary"
            onPress={onClose}
            style={styles.modalButton}
          >
            취소
          </AppButton>
          <AppButton
            variant="contained"
            colorTheme="primary"
            onPress={handleSave}
            style={styles.modalButton}
          >
            저장
          </AppButton>
        </View>
      </View>
    </AppModal>
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
  totalCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.lg,
  },
  totalAmount: {
    marginTop: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
  },
  typeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  assetLeft: {
    flex: 1,
  },
  assetRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyText: {
    paddingVertical: spacing.md,
  },
  addButton: {
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  modalContent: {
    paddingVertical: spacing.sm,
  },
  typeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  memoInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default AssetManagementScreen;

