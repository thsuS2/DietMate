/**
 * DietMate 색상 시스템
 * 블랙 & 화이트 & 핑크 테마
 */

export const colors = {
  // ========================================
  // Base Colors (기본)
  // ========================================
  black: '#000000',
  white: '#FFFFFF',
  pink: '#FFC0CB',

  // ========================================
  // Primary (메인 - 핑크 계열)
  // ========================================
  primary: '#FFC0CB',           // 메인 핑크
  primaryDark: '#FFB6C1',       // 진한 핑크
  primaryLight: '#FFE4E9',      // 연한 핑크

  // ========================================
  // Category Colors (기록 항목별)
  // ========================================
  water: '#64B5F6',             // 💧 수분 - 밝은 블루
  waterDark: '#42A5F5',
  waterLight: '#90CAF9',

  meal: '#FFB6C1',              // 🍽️ 식단 - 라이트 핑크
  mealDark: '#FF91A4',
  mealLight: '#FFD6E0',

  exercise: '#81C784',          // 🏃 운동 - 밝은 그린
  exerciseDark: '#66BB6A',
  exerciseLight: '#A5D6A7',

  weight: '#F48FB1',            // ⚖️ 몸무게 - 핑크
  weightDark: '#EC407A',
  weightLight: '#F8BBD0',

  memo: '#FFD54F',              // 📝 메모 - 밝은 옐로우
  memoDark: '#FFCA28',
  memoLight: '#FFE082',

  fasting: '#CE93D8',           // ⏰ 단식 - 라이트 퍼플
  fastingDark: '#BA68C8',
  fastingLight: '#E1BEE7',

  wallet: '#FFB74D',            // 💰 가계부 - 오렌지
  walletDark: '#FFA726',
  walletLight: '#FFCC80',

  // ========================================
  // Status Colors (상태)
  // ========================================
  success: '#4CAF50',           // 성공
  warning: '#FF9800',           // 경고
  error: '#F44336',             // 에러
  info: '#2196F3',              // 정보

  // ========================================
  // Neutral (중립 - 최소화)
  // ========================================
  background: '#FFFFFF',        // 메인 배경
  surface: '#FAFAFA',           // 카드 배경
  border: '#E0E0E0',            // 테두리
  divider: '#F5F5F5',           // 구분선

  // ========================================
  // Text (텍스트)
  // ========================================
  text: '#000000',              // 메인 텍스트
  textSecondary: '#616161',     // 보조 텍스트
  textDisabled: '#BDBDBD',      // 비활성 텍스트

  // ========================================
  // Overlay (오버레이)
  // ========================================
  overlay: 'rgba(0, 0, 0, 0.5)', // 모달 백드롭
};

/**
 * 카테고리별 색상 가져오기
 */
export const getCategoryColor = (category) => {
  const colorMap = {
    water: colors.water,
    meal: colors.meal,
    exercise: colors.exercise,
    weight: colors.weight,
    memo: colors.memo,
    fasting: colors.fasting,
    wallet: colors.wallet,
  };
  return colorMap[category] || colors.primary;
};

/**
 * 카테고리별 그라데이션 색상 세트
 */
export const getCategoryGradient = (category) => {
  const gradientMap = {
    water: [colors.waterLight, colors.water, colors.waterDark],
    meal: [colors.mealLight, colors.meal, colors.mealDark],
    exercise: [colors.exerciseLight, colors.exercise, colors.exerciseDark],
    weight: [colors.weightLight, colors.weight, colors.weightDark],
    memo: [colors.memoLight, colors.memo, colors.memoDark],
    fasting: [colors.fastingLight, colors.fasting, colors.fastingDark],
    wallet: [colors.walletLight, colors.wallet, colors.walletDark],
  };
  return gradientMap[category] || [colors.primaryLight, colors.primary, colors.primaryDark];
};

export default colors;

