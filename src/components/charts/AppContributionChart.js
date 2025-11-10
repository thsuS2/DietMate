import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';

/**
 * 기여도 차트 컴포넌트 (GitHub 스타일 히트맵 - 기록 빈도)
 * 
 * @param {array} data - [{ date: '2025-11-01', count: 3 }, ...]
 * @param {string} colorTheme - 'water' | 'meal' | 'exercise' | 'weight' | 'primary'
 * @param {string} title - 차트 제목
 * @param {number} width - 차트 너비
 * @param {number} height - 차트 높이
 * @param {function} onDayPress - 날짜 클릭 핸들러
 * @param {style} style - 추가 스타일
 */
const AppContributionChart = ({
  data,
  colorTheme = 'primary',
  title,
  width = Dimensions.get('window').width - 32,
  height = 220,
  onDayPress,
  style,
}) => {
  const themeColor = getCategoryColor(colorTheme);

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => `rgba(${hexToRgb(themeColor)}, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: spacing.borderRadius.lg,
    },
  };

  // 최근 3개월 날짜 범위 계산
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  return (
    <View style={[styles.container, style]}>
      {title && <AppText variant="h4" style={styles.title}>{title}</AppText>}
      <ContributionGraph
        values={data}
        endDate={endDate}
        numDays={90}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        onDayPress={onDayPress}
        tooltipDataAttrs={(value) => ({
          fill: themeColor,
        })}
      />
    </View>
  );
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: spacing.borderRadius.lg,
  },
});

export default AppContributionChart;

