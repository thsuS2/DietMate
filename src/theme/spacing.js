/**
 * DietMate 간격 시스템
 * 4px 기반 스케일
 */

export const spacing = {
  // ========================================
  // Base Spacing (4px 기반)
  // ========================================
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 16,     // 16px (기본)
  lg: 24,     // 24px
  xl: 32,     // 32px
  xxl: 48,    // 48px
  xxxl: 64,   // 64px

  // ========================================
  // Specific Use Cases
  // ========================================
  cardPadding: 16,
  screenPadding: 16,
  sectionSpacing: 24,
  listItemSpacing: 12,
  buttonPadding: 12,
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
  },

  // ========================================
  // Border Radius
  // ========================================
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // ========================================
  // Shadows (elevation)
  // ========================================
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 3.84,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4.65,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.30,
      shadowRadius: 10.32,
      elevation: 8,
    },
  },
};

export default spacing;

