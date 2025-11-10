import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppCard, AppText } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const WalletScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>💰 가계부</AppText>
        <AppText variant="body1" color="textSecondary" style={styles.description}>
          배고픔으로 인한 감정적 소비를 방지하세요.
        </AppText>

        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.cardTitle}>
            📝 소비 기록
          </AppText>
          <AppText variant="body2" color="textSecondary">
            날짜, 금액, 이유를 기록하여 소비 패턴을 파악하세요.
          </AppText>
        </AppCard>

        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.cardTitle}>
            📊 주간 통계
          </AppText>
          <AppText variant="body2" color="textSecondary">
            감정적 소비를 카테고리별로 분석합니다.
          </AppText>
        </AppCard>

        <AppCard variant="filled" style={styles.infoCard}>
          <AppText variant="body2" color="textSecondary" align="center">
            곧 가계부 기능이 추가됩니다! 🚀
          </AppText>
        </AppCard>
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
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.walletLight,
    borderWidth: 1,
    borderColor: colors.wallet,
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
  },
});

export default WalletScreen;

