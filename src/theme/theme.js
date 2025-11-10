/**
 * DietMate 통합 테마
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

/**
 * react-native-paper용 커스텀 테마
 */
export const paperTheme = {
  colors: {
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.black,
    secondaryContainer: colors.surface,
    tertiary: colors.pink,
    error: colors.error,
    errorContainer: '#FFEBEE',
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surface,
    surfaceDisabled: colors.divider,
    onPrimary: colors.white,
    onPrimaryContainer: colors.text,
    onSecondary: colors.white,
    onSecondaryContainer: colors.text,
    onTertiary: colors.white,
    onError: colors.white,
    onErrorContainer: colors.error,
    onBackground: colors.text,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    onSurfaceDisabled: colors.textDisabled,
    outline: colors.border,
    outlineVariant: colors.divider,
    inverseSurface: colors.black,
    inverseOnSurface: colors.white,
    inversePrimary: colors.primaryLight,
    shadow: colors.black,
    scrim: colors.overlay,
    backdrop: colors.overlay,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surface,
      level3: colors.surface,
      level4: colors.surface,
      level5: colors.surface,
    },
  },
  roundness: spacing.borderRadius.md,
};

/**
 * 통합 테마 객체
 */
export const theme = {
  colors,
  typography,
  spacing,
  paperTheme,
};

export default theme;

