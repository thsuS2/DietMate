import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 관련 헬퍼 함수들
 */

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

/**
 * 날짜를 한글 형식으로 변환 (예: 2025년 11월 5일)
 */
export const formatDateKorean = (date) => {
  return format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko });
};

/**
 * 날짜를 요일 포함 형식으로 변환 (예: 11월 5일 (화))
 */
export const formatDateWithDay = (date) => {
  return format(new Date(date), 'MM월 dd일 (E)', { locale: ko });
};

/**
 * 시간을 HH:mm 형식으로 변환
 */
export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm');
};

/**
 * 이번 주의 시작일과 종료일 반환
 */
export const getThisWeek = () => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // 월요일 시작
  const end = endOfWeek(today, { weekStartsOn: 1 });
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

/**
 * 지난 주의 시작일과 종료일 반환
 */
export const getLastWeek = () => {
  const today = new Date();
  const lastWeek = subWeeks(today, 1);
  const start = startOfWeek(lastWeek, { weekStartsOn: 1 });
  const end = endOfWeek(lastWeek, { weekStartsOn: 1 });
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

/**
 * 다음 주의 시작일과 종료일 반환
 */
export const getNextWeek = () => {
  const today = new Date();
  const nextWeek = addWeeks(today, 1);
  const start = startOfWeek(nextWeek, { weekStartsOn: 1 });
  const end = endOfWeek(nextWeek, { weekStartsOn: 1 });
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

/**
 * 오프셋을 기준으로 주간 범위 반환 (0: 이번주, -1: 지난주, 1: 다음주)
 */
export const getWeekByOffset = (offset = 0) => {
  const today = new Date();
  const targetWeek = addWeeks(today, offset);
  const start = startOfWeek(targetWeek, { weekStartsOn: 1 });
  const end = endOfWeek(targetWeek, { weekStartsOn: 1 });
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

/**
 * 날짜를 짧은 형식으로 변환 (예: 2025.11.10)
 */
export const formatDateShort = (date) => {
  return format(new Date(date), 'yyyy.MM.dd');
};

/**
 * 오늘이 특정 주간 범위에 포함되는지 확인
 */
export const isCurrentWeek = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return today >= start && today <= end;
};

/**
 * 특정 주의 모든 날짜 배열 반환
 */
export const getWeekDays = (startDate, endDate) => {
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });
  
  return days.map(day => formatDate(day));
};

/**
 * 두 날짜 사이의 일수 계산
 */
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * D-Day 계산 (목표일까지 남은 일수)
 */
export const getDday = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 경과일 계산 (시작일부터 오늘까지)
 */
export const getDaysElapsed = (startDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 시간대별 인사말 반환
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '좋은 밤이에요!';
  if (hour < 12) return '좋은 아침이에요!';
  if (hour < 18) return '좋은 오후예요!';
  if (hour < 22) return '좋은 저녁이에요!';
  return '좋은 밤이에요!';
};

/**
 * 간헐적 단식 종료 시간 계산
 */
export const getFastingEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = (hours + duration) % 24;
  return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * 현재 단식 중인지 확인
 */
export const isFasting = (startTime, duration) => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = (startTotalMinutes + duration * 60) % (24 * 60);
  
  if (startTotalMinutes < endTotalMinutes) {
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
  } else {
    return currentTotalMinutes >= startTotalMinutes || currentTotalMinutes < endTotalMinutes;
  }
};

export default {
  getTodayString,
  formatDate,
  formatDateKorean,
  formatDateWithDay,
  formatTime,
  getThisWeek,
  getLastWeek,
  getNextWeek,
  getWeekByOffset,
  formatDateShort,
  isCurrentWeek,
  getWeekDays,
  getDaysBetween,
  getDday,
  getDaysElapsed,
  getGreeting,
  getFastingEndTime,
  isFasting,
};

