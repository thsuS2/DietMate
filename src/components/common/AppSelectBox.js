import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, getCategoryColor } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 셀렉트 박스 컴포넌트 (드롭다운)
 * 
 * @param {array} options - [{ label: '아침', value: 'breakfast' }, ...]
 * @param {string} selectedValue - 선택된 값
 * @param {function} onChange - 변경 핸들러
 * @param {string} placeholder - placeholder
 * @param {string} label - 라벨
 * @param {string} colorTheme - 'primary' | 'water' | 'meal' | ...
 * @param {boolean} disabled - 비활성화
 * @param {style} style - 추가 스타일
 */
const AppSelectBox = ({
  options = [],
  selectedValue,
  onChange,
  placeholder = '선택하세요',
  label,
  colorTheme = 'primary',
  disabled = false,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const themeColor = getCategoryColor(colorTheme);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (value) => {
    onChange(value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectBox,
          disabled && styles.selectBoxDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            !selectedOption && styles.placeholder,
          ]}
        >
          {displayText}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={disabled ? colors.textDisabled : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* 옵션 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: colors.surface },
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && { color: themeColor, fontWeight: '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={20} color={themeColor} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.buttonPadding,
  },
  selectBoxDisabled: {
    backgroundColor: colors.surface,
  },
  text: {
    ...typography.body1,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textDisabled,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxHeight: 400,
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    ...spacing.shadow.lg,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  optionText: {
    ...typography.body1,
    color: colors.text,
  },
});

export default AppSelectBox;

