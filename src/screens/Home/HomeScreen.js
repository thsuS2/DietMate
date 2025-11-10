import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppCard, AppText } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1" align="center" style={styles.title}>
          🩵 DietMate
        </AppText>
        <AppText variant="h3" align="center" color="textSecondary" style={styles.subtitle}>
          집중 다이어트 종합 비서
        </AppText>
        
        <AppCard variant="filled" style={styles.quoteCard}>
          <AppText variant="body1" align="center" color="primary" style={styles.quote}>
            "記錄이 습관이 되고, 습관이 결과를 만든다."
          </AppText>
        </AppCard>

        <View style={styles.infoSection}>
          <AppCard variant="elevated" elevation="sm" style={styles.infoCard}>
            <AppText variant="h4">📝 기록하기</AppText>
            <AppText variant="body2" color="textSecondary" style={styles.infoText}>
              식단, 운동, 수분, 몸무게를 매일 기록하세요.
            </AppText>
          </AppCard>

          <AppCard variant="elevated" elevation="sm" style={styles.infoCard}>
            <AppText variant="h4">📊 통계 보기</AppText>
            <AppText variant="body2" color="textSecondary" style={styles.infoText}>
              주간 통계로 나의 진행 상황을 확인하세요.
            </AppText>
          </AppCard>

          <AppCard variant="elevated" elevation="sm" style={styles.infoCard}>
            <AppText variant="h4">⏰ 간헐적 단식</AppText>
            <AppText variant="body2" color="textSecondary" style={styles.infoText}>
              단식 시간을 설정하고 관리하세요.
            </AppText>
          </AppCard>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  quoteCard: {
    width: '100%',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  quote: {
    fontStyle: 'italic',
  },
  infoSection: {
    width: '100%',
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoText: {
    marginTop: spacing.sm,
  },
});

export default HomeScreen;
