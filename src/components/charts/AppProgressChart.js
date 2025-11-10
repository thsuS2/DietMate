import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';

/**
 * 프로그레스 차트 컴포넌트 (링 차트 - 목표 달성률)
 * 
 * @param {array} data - { labels: ['수분', '운동', '식단'], data: [0.6, 0.8, 0.5] }
 * @param {array} colorThemes - ['water', 'exercise', 'meal']
 * @param {string} title - 차트 제목
 * @param {number} width - 차트 너비
 * @param {number} height - 차트 높이
 * @param {style} style - 추가 스타일
 */
const AppProgressChart = ({
  data,
  colorThemes = ['primary'],
  title,
  width = Dimensions.get('window').width - 32,
  height = 220,
  style,
}) => {
  // 여러 색상 지원
  const chartColors = colorThemes.map(theme => getCategoryColor(theme));

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1, index = 0) => {
      const color = chartColors[index] || chartColors[0];
      return `rgba(${hexToRgb(color)}, ${opacity})`;
    },
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 2,
    style: {
      borderRadius: spacing.borderRadius.lg,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {title && <AppText variant="h4" style={styles.title}>{title}</AppText>}
      <ProgressChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        strokeWidth={12}
        radius={32}
        hideLegend={false}
        style={styles.chart}
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

export default AppProgressChart;

