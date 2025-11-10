import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 모달 컴포넌트
 * 
 * @param {boolean} visible - 모달 표시 여부
 * @param {function} onClose - 닫기 핸들러
 * @param {string} title - 모달 제목
 * @param {string} size - 'small' | 'medium' | 'large' | 'full'
 * @param {boolean} showCloseButton - 닫기 버튼 표시 여부
 * @param {ReactNode} children - 모달 내용
 * @param {style} style - 추가 스타일
 */
const AppModal = ({
  visible = false,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  children,
  style,
}) => {
  const sizeStyles = {
    small: { maxHeight: '40%' },
    medium: { maxHeight: '60%' },
    large: { maxHeight: '80%' },
    full: { maxHeight: '95%' },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={[styles.modal, sizeStyles[size], style]}>
          {/* 헤더 */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* 내용 */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.xl,
    ...spacing.shadow.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});

export default AppModal;

