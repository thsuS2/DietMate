import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

/**
 * 공통 카드 컴포넌트
 * 
 * @param {string} variant - 'elevated' | 'outlined' | 'filled'
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {string} elevation - 'none' | 'sm' | 'md' | 'lg'
 * @param {style} style - 추가 스타일
 * @param {ReactNode} children - 카드 내용
 */
const AppCard = ({
  variant = 'elevated',
  padding = 'md',
  elevation = 'md',
  style,
  children,
}) => {
  const paddingValues = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.white,
      borderRadius: spacing.borderRadius.lg,
      padding: paddingValues[padding],
    };

    if (variant === 'elevated') {
      return {
        ...baseStyle,
        ...spacing.shadow[elevation],
      };
    }

    if (variant === 'outlined') {
      return {
        ...baseStyle,
        borderWidth: 1,
        borderColor: colors.border,
      };
    }

    if (variant === 'filled') {
      return {
        ...baseStyle,
        backgroundColor: colors.surface,
      };
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});

export default AppCard;

