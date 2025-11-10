import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 체크박스 컴포넌트
 * 
 * @param {boolean} checked - 체크 상태
 * @param {function} onChange - 변경 핸들러
 * @param {string} label - 라벨
 * @param {string} colorTheme - 'primary' | 'water' | 'meal' | ...
 * @param {boolean} disabled - 비활성화
 * @param {style} style - 추가 스타일
 */
const AppCheckbox = ({
  checked = false,
  onChange,
  label,
  colorTheme = 'primary',
  disabled = false,
  style,
}) => {
  const themeColor = getCategoryColor(colorTheme);

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checked && { backgroundColor: themeColor, borderColor: themeColor },
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Icon name="check" size={16} color={colors.white} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
  },
  label: {
    ...typography.body1,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
});

export default AppCheckbox;

