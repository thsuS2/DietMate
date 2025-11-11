import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { Platform } from 'react-native';

/**
 * 알림 관련 헬퍼 함수들 (Notifee)
 */

/**
 * 알림 초기 설정
 */
export const initNotifications = async () => {
  // 알림 권한 요청
  await notifee.requestPermission();

  // Android 기본 채널 생성
  await notifee.createChannel({
    id: 'dietmate-default',
    name: 'DietMate 기본 알림',
    description: '다이어트 기록 및 단식 알림',
    importance: 4, // High
    sound: 'default',
    vibration: true,
  });

  console.log('Notifee initialized successfully');
};

/**
 * 즉시 알림 표시
 */
export const showNotification = async (title, message) => {
  await notifee.displayNotification({
    title,
    body: message,
    android: {
      channelId: 'dietmate-default',
      sound: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
};

/**
 * 예약 알림 설정 (특정 시간)
 */
export const scheduleNotification = async (id, title, message, hour, minute) => {
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  
  // 이미 지난 시간이면 다음날로 설정
  if (date < new Date()) {
    date.setDate(date.getDate() + 1);
  }

  // 매일 반복되는 트리거 생성
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body: message,
      android: {
        channelId: 'dietmate-default',
        sound: 'default',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger
  );
};

/**
 * 기록 알림 설정 (자기 전)
 */
export const scheduleRecordReminder = async (hour, minute) => {
  await scheduleNotification(
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
export const scheduleFastingStartReminder = async (hour, minute) => {
  // 10분 전에 알림
  const reminderMinute = minute - 10;
  const reminderHour = reminderMinute < 0 ? hour - 1 : hour;
  const finalMinute = reminderMinute < 0 ? 60 + reminderMinute : reminderMinute;

  await scheduleNotification(
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
export const scheduleFastingEndReminder = async (hour, minute) => {
  await scheduleNotification(
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
export const scheduleWaterReminder = async () => {
  const hours = [10, 12, 14, 16, 18, 20]; // 물 마시기 알림 시간
  
  for (let index = 0; index < hours.length; index++) {
    await scheduleNotification(
      `water-reminder-${index}`,
      '물 마실 시간이에요! 💧',
      '수분 섭취를 잊지 마세요!',
      hours[index],
      0
    );
  }
};

/**
 * 특정 알림 취소
 */
export const cancelNotification = async (id) => {
  await notifee.cancelNotification(id);
};

/**
 * 모든 알림 취소
 */
export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
};

/**
 * 알림 권한 요청
 */
export const requestNotificationPermissions = async () => {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1; // 1 = authorized
};

/**
 * 수분 알림만 취소
 */
export const cancelWaterReminders = async () => {
  const hours = [10, 12, 14, 16, 18, 20];
  for (let index = 0; index < hours.length; index++) {
    await cancelNotification(`water-reminder-${index}`);
  }
};

/**
 * 모든 알림 스케줄링 (통합 함수)
 */
export const scheduleAllNotifications = async (settings) => {
  if (!settings || !settings.notifications) {
    // 알림이 꺼져있으면 모두 취소
    await cancelAllNotifications();
    return;
  }

  try {
    // 1. 기록 알림
    if (settings.recordReminderTime) {
      const [hour, minute] = settings.recordReminderTime.split(':').map(Number);
      await scheduleRecordReminder(hour, minute);
      console.log(`기록 알림 설정: ${hour}:${minute}`);
    }

    // 2. 단식 알림
    if (settings.fastingReminderEnabled && settings.fastingStart && settings.fastingDuration) {
      const [startHour, startMinute] = settings.fastingStart.split(':').map(Number);
      
      // 단식 시작 알림
      await scheduleFastingStartReminder(startHour, startMinute);
      console.log(`단식 시작 알림 설정: ${startHour}:${startMinute - 10}`);
      
      // 단식 종료 알림
      const endHour = (startHour + settings.fastingDuration) % 24;
      await scheduleFastingEndReminder(endHour, startMinute);
      console.log(`단식 종료 알림 설정: ${endHour}:${startMinute}`);
    }

    // 3. 수분 알림 (선택적)
    // 현재는 비활성화, 추후 설정 추가 시 활성화
    // await scheduleWaterReminder();

    console.log('모든 알림 스케줄링 완료');
  } catch (error) {
    console.error('알림 스케줄링 실패:', error);
  }
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
  cancelWaterReminders,
  requestNotificationPermissions,
  scheduleAllNotifications,
};

