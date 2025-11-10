/**
 * DietMate 타이포그래피 시스템
 */

export const typography = {
  // ========================================
  // Font Sizes
  // ========================================
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },

  // ========================================
  // Font Weights
  // ========================================
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // ========================================
  // Line Heights
  // ========================================
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  // ========================================
  // Text Styles (조합)
  // ========================================
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
};

export default typography;

