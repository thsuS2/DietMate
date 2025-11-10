import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 진행률 바 컴포넌트
 * 
 * @param {number} progress - 진행률 (0~1)
 * @param {string} colorTheme - 'water' | 'meal' | 'exercise' | 'weight' | 'primary'
 * @param {number} height - 바 높이
 * @param {boolean} showPercentage - 퍼센트 표시 여부
 * @param {string} label - 라벨 텍스트
 * @param {style} style - 추가 스타일
 */
const AppProgressBar = ({
  progress = 0,
  colorTheme = 'primary',
  height = 12,
  showPercentage = true,
  label,
  style,
}) => {
  const barColor = getCategoryColor(colorTheme);
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2 },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>

      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  track: {
    width: '100%',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  percentage: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});

export default AppProgressBar;

