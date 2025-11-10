import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

/**
 * 공통 텍스트 컴포넌트
 * 
 * @param {string} variant - 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'button' | 'overline'
 * @param {string} color - 텍스트 색상 (colors 객체 키 또는 hex)
 * @param {string} align - 'left' | 'center' | 'right'
 * @param {boolean} bold - 굵게
 * @param {style} style - 추가 스타일
 * @param {ReactNode} children - 텍스트 내용
 */
const AppText = ({
  variant = 'body1',
  color = 'text',
  align = 'left',
  bold = false,
  style,
  children,
  ...props
}) => {
  const textColor = colors[color] || color;
  const variantStyle = typography[variant] || typography.body1;

  return (
    <Text
      style={[
        styles.text,
        variantStyle,
        { color: textColor, textAlign: align },
        bold && { fontWeight: typography.fontWeight.bold },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text,
  },
});

export default AppText;

