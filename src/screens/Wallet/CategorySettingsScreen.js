import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import useWalletStore from '../../store/useWalletStore';
import { AppCard, AppText, AppButton, AppModal } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CategorySettingsScreen = ({ navigation }) => {
  const { 
    categories,
    getParentCategories,
    getChildCategories,
    addCategory,
    deleteCategory,
  } = useWalletStore();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null); // 어느 1차에 2차 추가할지

  // 수입/지출 1차 카테고리
  const incomeCategories = getParentCategories('income');
  const expenseCategories = getParentCategories('expense');

  // 카테고리 추가 핸들러
  const handleAddCategory = (parentId = null) => {
    setEditingParent(parentId);
    setAddModalVisible(true);
  };

  // 카테고리 삭제
  const handleDeleteCategory = (categoryId, categoryName) => {
    Alert.alert(
      '카테고리 삭제',
      `'${categoryName}' 카테고리를 삭제하시겠습니까?\n관련 거래 내역은 유지됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteCategory(categoryId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 수입 카테고리 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            💰 수입 카테고리
          </AppText>

          {incomeCategories.map((parent) => {
            const children = getChildCategories(parent.id);
            return (
              <View key={parent.id} style={styles.categoryGroup}>
                {/* 1차 카테고리 */}
                <View style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[styles.categoryIcon, { backgroundColor: parent.color }]}
                    >
                      <AppText variant="body1">{parent.icon}</AppText>
                    </View>
                    <AppText variant="body1" bold>
                      {parent.name}
                    </AppText>
                  </View>
                </View>

                {/* 2차 카테고리들 */}
                {children.map((child) => (
                  <View key={child.id} style={styles.childCategoryItem}>
                    <View style={styles.categoryLeft}>
                      <View style={styles.childIndicator} />
                      <View
                        style={[styles.categoryIconSmall, { backgroundColor: child.color }]}
                      >
                        <AppText variant="caption">{child.icon}</AppText>
                      </View>
                      <AppText variant="body2">{child.name}</AppText>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(child.id, child.name)}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* 2차 추가 버튼 */}
                <TouchableOpacity
                  style={styles.addChildButton}
                  onPress={() => handleAddCategory(parent.id)}
                >
                  <AppText variant="caption" color="primary">
                    + 상세 분류 추가
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}
        </AppCard>

        {/* 지출 카테고리 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            💸 지출 카테고리
          </AppText>

          {expenseCategories.map((parent) => {
            const children = getChildCategories(parent.id);
            return (
              <View key={parent.id} style={styles.categoryGroup}>
                {/* 1차 카테고리 */}
                <View style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[styles.categoryIcon, { backgroundColor: parent.color }]}
                    >
                      <AppText variant="body1">{parent.icon}</AppText>
                    </View>
                    <AppText variant="body1" bold>
                      {parent.name}
                    </AppText>
                  </View>
                </View>

                {/* 2차 카테고리들 */}
                {children.map((child) => (
                  <View key={child.id} style={styles.childCategoryItem}>
                    <View style={styles.categoryLeft}>
                      <View style={styles.childIndicator} />
                      <View
                        style={[styles.categoryIconSmall, { backgroundColor: child.color }]}
                      >
                        <AppText variant="caption">{child.icon}</AppText>
                      </View>
                      <AppText variant="body2">{child.name}</AppText>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(child.id, child.name)}
                    >
                      <MaterialCommunityIcons name="close" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* 2차 추가 버튼 */}
                <TouchableOpacity
                  style={styles.addChildButton}
                  onPress={() => handleAddCategory(parent.id)}
                >
                  <AppText variant="caption" color="primary">
                    + 상세 분류 추가
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}
        </AppCard>
      </ScrollView>

      {/* 2차 카테고리 추가 모달 */}
      <CategoryAddModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingParent(null);
        }}
        parentId={editingParent}
      />
    </View>
  );
};

// 카테고리 추가 모달
const CategoryAddModal = ({ visible, onClose, parentId }) => {
  const { categories, addCategory } = useWalletStore();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const parent = categories.find(c => c.id === parentId);

  const handleSave = async () => {
    if (!name) {
      alert('이름을 입력해주세요');
      return;
    }

    const newCategory = {
      id: `${parentId}_${Date.now()}`,
      name,
      icon: icon || '💸',
      type: parent?.type || 'expense',
      color: parent?.color || colors.walletEtc,
      parentId,
    };

    await addCategory(newCategory);
    setName('');
    setIcon('');
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="상세 분류 추가"
      size="small"
    >
      <View style={styles.modalContent}>
        <AppText variant="body2" color="textSecondary" style={styles.modalHint}>
          {parent?.name} 하위 카테고리
        </AppText>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="카테고리 이름"
        />

        <TextInput
          style={styles.input}
          value={icon}
          onChangeText={setIcon}
          placeholder="아이콘 (예: 🍔)"
          maxLength={2}
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
            추가
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
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  categoryGroup: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconSmall: {
    width: 32,
    height: 32,
    borderRadius: spacing.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
  },
  childIndicator: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginRight: spacing.xs,
  },
  addChildButton: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.xl,
  },
  modalContent: {
    paddingVertical: spacing.sm,
  },
  modalHint: {
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
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

export default CategorySettingsScreen;

