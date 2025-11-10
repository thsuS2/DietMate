import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { formatDateKorean, getTodayString } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import { AppButton, AppCard, AppText, AppInput } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const MemoRecordScreen = () => {
  const [memo, setMemo] = useState('');
  const today = getTodayString();

  // Zustand 스토어
  const { getRecordByDate, addMemo } = useRecordStore();

  // 오늘의 메모
  const todayRecord = getRecordByDate(today);

  // 컴포넌트 마운트 시 저장된 메모 불러오기
  useEffect(() => {
    if (todayRecord.memo) {
      setMemo(todayRecord.memo);
    }
  }, [todayRecord.memo]);

  // 메모 저장
  const handleSaveMemo = async () => {
    await addMemo(today, memo);
  };

  // 글자 수
  const charCount = memo.length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">📝 메모</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.date}>
            {formatDateKorean(today)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 메모 입력 카드 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            ✍️ 오늘의 일기
          </AppText>
          <AppText variant="body2" color="textSecondary" style={styles.description}>
            오늘의 감정, 컨디션, 식사 이유 등을 자유롭게 기록하세요.
          </AppText>
          
          <AppInput
            value={memo}
            onChangeText={setMemo}
            placeholder="오늘 하루는 어떠셨나요?&#10;다이어트를 하면서 느낀 점을 기록해보세요."
            multiline
            numberOfLines={10}
            maxLength={1000}
            style={styles.memoInput}
          />

          <View style={styles.footer}>
            <AppText variant="caption" color="textSecondary">
              {charCount} / 1,000자
            </AppText>
            <AppButton
              variant="contained"
              colorTheme="primary"
              icon="content-save"
              onPress={handleSaveMemo}
              size="small"
            >
              저장
            </AppButton>
          </View>
        </AppCard>

        {/* 저장된 메모 미리보기 */}
        {todayRecord.memo && todayRecord.memo !== memo && (
          <AppCard variant="filled" style={styles.savedCard}>
            <AppText variant="body2" color="textSecondary" style={styles.savedLabel}>
              💾 저장된 메모
            </AppText>
            <AppText variant="body1" style={styles.savedMemo}>
              {todayRecord.memo}
            </AppText>
          </AppCard>
        )}

        {/* 팁 카드 */}
        <AppCard variant="outlined" style={styles.tipCard}>
          <AppText variant="body2" color="textSecondary">
            💡 <AppText variant="body2" bold>TIP:</AppText> 매일 기록하면 나의 패턴을 발견할 수 있어요!
          </AppText>
          <AppText variant="caption" color="textSecondary" style={styles.tipText}>
            • 오늘 기분은 어땠나요?{'\n'}
            • 다이어트가 힘든 순간이 있었나요?{'\n'}
            • 무엇이 도움이 되었나요?{'\n'}
            • 내일의 다짐을 적어보세요.
          </AppText>
        </AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
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
  currentWeight: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.md,
  },
  memoInput: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedCard: {
    backgroundColor: colors.memoLight,
    borderWidth: 1,
    borderColor: colors.memo,
  },
  savedLabel: {
    marginBottom: spacing.sm,
  },
  savedMemo: {
    lineHeight: 24,
  },
  tipCard: {
    borderColor: colors.primary,
  },
  tipText: {
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});

export default MemoRecordScreen;

