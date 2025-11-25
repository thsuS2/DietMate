/**
 * 로깅 유틸리티
 * 개발 환경에서만 로그 출력
 */

const isDev = __DEV__;

const logger = {
  /**
   * 일반 로그
   */
  log: (...args) => {
    if (isDev) {
      console.log('[DietMate]', ...args);
    }
  },

  /**
   * 경고 로그
   */
  warn: (...args) => {
    if (isDev) {
      console.warn('[DietMate]', ...args);
    }
  },

  /**
   * 에러 로그
   * 프로덕션에서도 중요한 에러는 추적 가능하도록 유지 (필요시)
   */
  error: (message, error = null) => {
    if (isDev) {
      console.error(`[DietMate Error] ${message}`, error || '');
    }
    // 프로덕션에서도 에러 추적이 필요하면 여기에 Sentry 등 추가
  },

  /**
   * 정보 로그
   */
  info: (...args) => {
    if (isDev) {
      console.info('[DietMate]', ...args);
    }
  },
};

export default logger;

