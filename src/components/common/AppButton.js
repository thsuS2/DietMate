import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 버튼 컴포넌트
 * 
 * @param {string} variant - 'contained' | 'outlined' | 'text'
 * @param {string} colorTheme - 'primary' | 'water' | 'meal' | 'exercise' | 'weight' | 'black'
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {string} icon - MaterialCommunityIcons 이름
 * @param {boolean} disabled - 비활성화
 * @param {boolean} loading - 로딩 상태
 * @param {function} onPress - 클릭 핸들러
 * @param {style} style - 추가 스타일
 * @param {ReactNode} children - 버튼 텍스트
 */
const AppButton = ({
  variant = 'contained',
  colorTheme = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  onPress,
  style,
  children,
}) => {
  const themeColors = {
    primary: colors.primary,
    water: colors.water,
    meal: colors.meal,
    exercise: colors.exercise,
    weight: colors.weight,
    black: colors.black,
  };

  const buttonColor = themeColors[colorTheme] || colors.primary;

  const getBackgroundColor = () => {
    if (disabled) return colors.divider;
    if (variant === 'contained') return buttonColor;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textDisabled;
    if (variant === 'contained') return colors.white;
    return buttonColor;
  };

  const getBorderColor = () => {
    if (disabled) return colors.border;
    if (variant === 'outlined') return buttonColor;
    return 'transparent';
  };

  const sizeStyles = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 32,
    },
    medium: {
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.lg,
      minHeight: 44,
    },
    large: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      minHeight: 52,
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Icon
              name={icon}
              size={size === 'small' ? 16 : 20}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }, typography.button]}>
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;

