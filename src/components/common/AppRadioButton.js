import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 라디오 버튼 컴포넌트
 * 
 * @param {array} options - [{ label: '아침', value: 'breakfast' }, ...]
 * @param {string} selectedValue - 선택된 값
 * @param {function} onChange - 변경 핸들러
 * @param {string} colorTheme - 'primary' | 'water' | 'meal' | ...
 * @param {string} direction - 'row' | 'column'
 * @param {style} style - 추가 스타일
 */
const AppRadioButton = ({
  options = [],
  selectedValue,
  onChange,
  colorTheme = 'primary',
  direction = 'row',
  style,
}) => {
  const themeColor = getCategoryColor(colorTheme);

  return (
    <View style={[styles.container, direction === 'row' ? styles.row : styles.column, style]}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              direction === 'row' && styles.optionRow,
            ]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, isSelected && { borderColor: themeColor }]}>
              {isSelected && (
                <View style={[styles.radioInner, { backgroundColor: themeColor }]} />
              )}
            </View>
            <Text style={[styles.label, isSelected && { color: themeColor }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionRow: {
    marginRight: spacing.lg,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    ...typography.body1,
    color: colors.text,
    marginLeft: spacing.sm,
  },
});

export default AppRadioButton;

