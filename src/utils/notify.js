import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

/**
 * 알림 관련 헬퍼 함수들
 */

/**
 * 알림 초기 설정
 */
export const initNotifications = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },

    // (optional) Called when the user fails to register for remote notifications
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: Platform.OS === 'ios',
  });

  // Create default channel (Android)
  PushNotification.createChannel(
    {
      channelId: 'dietmate-default',
      channelName: 'DietMate 기본 알림',
      channelDescription: '다이어트 기록 및 단식 알림',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

/**
 * 즉시 알림 표시
 */
export const showNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'dietmate-default',
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};

/**
 * 예약 알림 설정 (특정 시간)
 */
export const scheduleNotification = (id, title, message, hour, minute) => {
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  
  // 이미 지난 시간이면 다음날로 설정
  if (date < new Date()) {
    date.setDate(date.getDate() + 1);
  }

  PushNotification.localNotificationSchedule({
    id,
    channelId: 'dietmate-default',
    title,
    message,
    date,
    repeatType: 'day', // 매일 반복
    playSound: true,
    soundName: 'default',
  });
};

/**
 * 기록 알림 설정 (자기 전)
 */
export const scheduleRecordReminder = (hour, minute) => {
  scheduleNotification(
    'record-reminder',
    '오늘 기록하셨나요? 📝',
    '오늘의 식단, 운동, 몸무게를 기록해보세요!',
    hour,
    minute
  );
};

/**
 * 단식 시작 알림 설정
 */
export const scheduleFastingStartReminder = (hour, minute) => {
  // 10분 전에 알림
  const reminderMinute = minute - 10;
  const reminderHour = reminderMinute < 0 ? hour - 1 : hour;
  const finalMinute = reminderMinute < 0 ? 60 + reminderMinute : reminderMinute;

  scheduleNotification(
    'fasting-start',
    '단식 시작 10분 전입니다! ⏰',
    '곧 단식이 시작됩니다. 마지막 식사를 준비하세요!',
    reminderHour,
    finalMinute
  );
};

/**
 * 단식 종료 알림 설정
 */
export const scheduleFastingEndReminder = (hour, minute) => {
  scheduleNotification(
    'fasting-end',
    '단식 종료! 🎉',
    '단식이 종료되었습니다. 건강한 식사를 시작하세요!',
    hour,
    minute
  );
};

/**
 * 수분 섭취 알림 설정 (2시간마다)
 */
export const scheduleWaterReminder = () => {
  const hours = [10, 12, 14, 16, 18, 20]; // 물 마시기 알림 시간
  
  hours.forEach((hour, index) => {
    scheduleNotification(
      `water-reminder-${index}`,
      '물 마실 시간이에요! 💧',
      '수분 섭취를 잊지 마세요!',
      hour,
      0
    );
  });
};

/**
 * 특정 알림 취소
 */
export const cancelNotification = (id) => {
  PushNotification.cancelLocalNotification(id);
};

/**
 * 모든 알림 취소
 */
export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

/**
 * 알림 권한 요청
 */
export const requestNotificationPermissions = () => {
  PushNotification.requestPermissions();
};

export default {
  initNotifications,
  showNotification,
  scheduleNotification,
  scheduleRecordReminder,
  scheduleFastingStartReminder,
  scheduleFastingEndReminder,
  scheduleWaterReminder,
  cancelNotification,
  cancelAllNotifications,
  requestNotificationPermissions,
};

