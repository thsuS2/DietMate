import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';

/**
 * 바 차트 컴포넌트 (비교 표시용)
 * 
 * @param {array} data - { labels: ['월', '화', ...], datasets: [{ data: [50, 45, ...] }] }
 * @param {string} colorTheme - 'water' | 'meal' | 'exercise' | 'weight'
 * @param {string} title - 차트 제목
 * @param {number} width - 차트 너비
 * @param {number} height - 차트 높이
 * @param {string} suffix - 단위
 * @param {boolean} showValues - 값 표시 여부
 * @param {style} style - 추가 스타일
 */
const AppBarChart = ({
  data,
  colorTheme = 'primary',
  title,
  width = Dimensions.get('window').width - 32,
  height = 220,
  suffix = '',
  showValues = true,
  style,
}) => {
  const themeColor = getCategoryColor(colorTheme);

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${hexToRgb(themeColor)}, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: spacing.borderRadius.lg,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.divider,
      strokeWidth: 1,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={[styles.container, style]}>
      {title && <AppText variant="h4" style={styles.title}>{title}</AppText>}
      <BarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix={suffix}
        withInnerLines
        withVerticalLabels
        withHorizontalLabels
        showValuesOnTopOfBars={showValues}
        fromZero
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

export default AppBarChart;

