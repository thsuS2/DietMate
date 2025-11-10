import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 입력 컴포넌트
 * 
 * @param {string} label - 라벨
 * @param {string} placeholder - placeholder
 * @param {string} value - 값
 * @param {function} onChangeText - 변경 핸들러
 * @param {string} type - 'text' | 'number' | 'email' | 'password'
 * @param {string} error - 에러 메시지
 * @param {boolean} disabled - 비활성화
 * @param {number} maxLength - 최대 길이
 * @param {boolean} multiline - 여러 줄 입력
 * @param {number} numberOfLines - 줄 수
 * @param {style} style - 추가 스타일
 */
const AppInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  error,
  disabled = false,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  const keyboardType = {
    text: 'default',
    number: 'numeric',
    email: 'email-address',
    password: 'default',
  }[type] || 'default';

  const secureTextEntry = type === 'password';

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { height: numberOfLines * 40, textAlignVertical: 'top' },
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.buttonPadding,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    color: colors.textDisabled,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default AppInput;

