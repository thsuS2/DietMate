import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';

/**
 * 라인 차트 컴포넌트 (추이 표시용)
 * 
 * @param {array} data - { labels: ['월', '화', ...], datasets: [{ data: [50, 45, ...] }] }
 * @param {string} colorTheme - 'water' | 'meal' | 'exercise' | 'weight'
 * @param {string} title - 차트 제목
 * @param {number} width - 차트 너비
 * @param {number} height - 차트 높이
 * @param {string} suffix - 단위 (예: 'kg', 'ml')
 * @param {style} style - 추가 스타일
 */
const AppLineChart = ({
  data,
  colorTheme = 'primary',
  title,
  width = Dimensions.get('window').width - 32,
  height = 220,
  suffix = '',
  style,
}) => {
  const themeColor = getCategoryColor(colorTheme);

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${hexToRgb(themeColor)}, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: spacing.borderRadius.lg,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: themeColor,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.divider,
      strokeWidth: 1,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {title && <AppText variant="h4" style={styles.title}>{title}</AppText>}
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={suffix}
        withInnerLines
        withOuterLines
        withVerticalLabels
        withHorizontalLabels
        withShadow={false}
      />
    </View>
  );
};

// Hex to RGB 헬퍼
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

export default AppLineChart;

