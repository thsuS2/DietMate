import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppModal, AppText, AppButton, AppRadioButton } from '../../components/common';
import useWalletStore from '../../store/useWalletStore';
import { getTodayString, formatTime } from '../../utils/date';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const TransactionAddModal = ({ visible, onClose }) => {
  const { addTransaction, categories, getCategoriesByType } = useWalletStore();

  // 상태
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(formatTime(new Date()));

  // 카테고리 필터링
  const availableCategories = getCategoriesByType(type);

  // 초기화
  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory(null);
    setMemo('');
    setDate(getTodayString());
    setTime(formatTime(new Date()));
  };

  // 저장
  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('금액을 입력해주세요');
      return;
    }

    if (!category) {
      alert('카테고리를 선택해주세요');
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount.replace(/,/g, '')),
      category,
      memo,
      date,
      time,
    };

    await addTransaction(transaction);
    resetForm();
    onClose();
  };

  // 금액 포맷팅
  const formatAmount = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return parseInt(numbers, 10).toLocaleString('ko-KR');
  };

  const handleAmountChange = (text) => {
    setAmount(formatAmount(text));
  };

  // 타입 변경
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(null); // 카테고리 초기화
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="수입/지출 추가"
      size="large"
    >
      <ScrollView style={styles.content}>
        {/* 수입/지출 선택 */}
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            유형
          </AppText>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActiveIncome,
              ]}
              onPress={() => handleTypeChange('income')}
            >
              <AppText
                variant="body1"
                color={type === 'income' ? 'white' : 'textSecondary'}
                bold={type === 'income'}
              >
                💰 수입
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActiveExpense,
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              <AppText
                variant="body1"
                color={type === 'expense' ? 'white' : 'textSecondary'}
                bold={type === 'expense'}
              >
                💸 지출
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 금액 입력 */}
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            금액
          </AppText>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              keyboardType="number-pad"
              maxLength={15}
            />
            <AppText variant="h3" color="textSecondary">
              원
            </AppText>
          </View>
        </View>

        {/* 카테고리 선택 */}
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            카테고리
          </AppText>
          <View style={styles.categoryGrid}>
            {availableCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: category === cat.id ? cat.color : colors.surface,
                    borderColor: cat.color,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <AppText variant="h2">{cat.icon}</AppText>
                <AppText
                  variant="caption"
                  color={category === cat.id ? 'white' : 'text'}
                  align="center"
                >
                  {cat.name}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 메모 */}
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            메모 (선택)
          </AppText>
          <TextInput
            style={styles.memoInput}
            value={memo}
            onChangeText={setMemo}
            placeholder="메모를 입력하세요"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 날짜/시간 */}
        <View style={styles.section}>
          <AppText variant="h4" style={styles.sectionTitle}>
            날짜 및 시간
          </AppText>
          <View style={styles.dateTimeRow}>
            <AppText variant="body1" color="text">
              📅 {date}
            </AppText>
            <AppText variant="body1" color="text">
              🕐 {time}
            </AppText>
          </View>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonRow}>
          <AppButton
            variant="outlined"
            colorTheme="primary"
            onPress={onClose}
            style={styles.button}
          >
            취소
          </AppButton>
          <AppButton
            variant="contained"
            colorTheme="primary"
            onPress={handleSave}
            style={styles.button}
          >
            저장
          </AppButton>
        </View>
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  typeButtonActiveIncome: {
    backgroundColor: colors.walletIncome,
    borderColor: colors.walletIncome,
  },
  typeButtonActiveExpense: {
    backgroundColor: colors.wallet,
    borderColor: colors.wallet,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
    padding: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
  },
});

export default TransactionAddModal;

