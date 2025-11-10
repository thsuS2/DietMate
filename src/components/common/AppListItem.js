import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

/**
 * 공통 리스트 아이템 컴포넌트
 * 
 * @param {string} title - 제목
 * @param {string} subtitle - 부제목
 * @param {string} leftIcon - 왼쪽 아이콘
 * @param {string} rightIcon - 오른쪽 아이콘 (기본: chevron-right)
 * @param {function} onPress - 클릭 핸들러
 * @param {boolean} showDivider - 구분선 표시
 * @param {style} style - 추가 스타일
 */
const AppListItem = ({
  title,
  subtitle,
  leftIcon,
  rightIcon = 'chevron-right',
  onPress,
  showDivider = true,
  style,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.container,
        showDivider && styles.divider,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon name={leftIcon} size={24} color={colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {(rightIcon || onPress) && (
          <Icon
            name={rightIcon}
            size={20}
            color={colors.textDisabled}
            style={styles.rightIcon}
          />
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  leftIconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
});

export default AppListItem;

