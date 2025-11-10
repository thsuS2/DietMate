import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { formatDateKorean, getTodayString } from '../../utils/date';
import useRecordStore from '../../store/useRecordStore';
import { AppButton, AppCard, AppText, AppInput, AppRadioButton } from '../../components/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const MealRecordScreen = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [mealContent, setMealContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const today = getTodayString();

  // Zustand 스토어
  const { getRecordByDate, addMeal } = useRecordStore();

  // 오늘의 식단 기록
  const todayRecord = getRecordByDate(today);
  const meals = todayRecord.meals || [];

  // 식사 타입 옵션
  const mealTypeOptions = [
    { label: '🌅 아침', value: 'breakfast' },
    { label: '🌞 점심', value: 'lunch' },
    { label: '🌙 저녁', value: 'dinner' },
    { label: '🍪 간식', value: 'snack' },
  ];

  // 사진 선택
  const handleSelectPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('오류', '사진을 선택할 수 없습니다.');
          return;
        }
        if (response.assets && response.assets[0]) {
          setPhoto(response.assets[0].uri);
        }
      }
    );
  };

  // 사진 제거
  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  // 식단 저장
  const handleSaveMeal = async () => {
    if (!mealContent.trim()) {
      Alert.alert('알림', '식사 내용을 입력해주세요.');
      return;
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const meal = {
      type: mealType,
      time: timeString,
      content: mealContent,
      photo: photo || null,
      timestamp: now.toISOString(),
    };

    await addMeal(today, meal);
    
    // 입력 필드 초기화
    setMealContent('');
    setPhoto(null);
    // 식사 타입은 유지 (같은 식사에 추가할 수 있도록)
  };

  // 식사 타입 표시 텍스트
  const getMealTypeText = (type) => {
    const map = {
      breakfast: '🌅 아침',
      lunch: '🌞 점심',
      dinner: '🌙 저녁',
      snack: '🍪 간식',
    };
    return map[type] || type;
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">🍽️ 식단</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.date}>
            {formatDateKorean(today)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 식단 입력 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 식단 기록하기
          </AppText>

          {/* 식사 타입 선택 */}
          <AppText variant="body2" style={styles.label}>
            식사 타입
          </AppText>
          <AppRadioButton
            options={mealTypeOptions}
            selectedValue={mealType}
            onChange={setMealType}
            colorTheme="meal"
            direction="row"
            style={styles.radioGroup}
          />

          {/* 사진 선택 */}
          <AppText variant="body2" style={styles.label}>
            사진 (선택)
          </AppText>
          {photo ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={handleRemovePhoto}
              >
                <Icon name="close-circle" size={30} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoPlaceholder}
              onPress={handleSelectPhoto}
            >
              <Icon name="camera-plus" size={40} color={colors.textDisabled} />
              <AppText variant="body2" color="textSecondary" style={styles.photoText}>
                사진 추가하기
              </AppText>
            </TouchableOpacity>
          )}

          {/* 식사 내용 */}
          <AppInput
            label="식사 내용"
            value={mealContent}
            onChangeText={setMealContent}
            placeholder="예: 현미밥, 닭가슴살, 샐러드"
            multiline
            numberOfLines={3}
          />

          <AppButton
            variant="contained"
            colorTheme="meal"
            icon="plus"
            onPress={handleSaveMeal}
            disabled={!mealContent.trim()}
          >
            저장
          </AppButton>
        </AppCard>

        {/* 오늘의 식단 기록 */}
        <AppCard variant="elevated" elevation="sm" style={styles.card}>
          <AppText variant="h4" style={styles.sectionTitle}>
            📝 오늘의 기록
          </AppText>
          {meals.length === 0 ? (
            <AppText variant="body2" color="textSecondary" align="center" style={styles.emptyText}>
              아직 기록이 없습니다. 식단을 기록해보세요! 🍽️
            </AppText>
          ) : (
            <FlatList
              data={meals.slice().reverse()}
              keyExtractor={(item, index) => `${item.time}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.mealItem}>
                  {item.photo && (
                    <Image source={{ uri: item.photo }} style={styles.mealPhoto} />
                  )}
                  <View style={styles.mealInfo}>
                    <View style={styles.mealHeader}>
                      <AppText variant="body1" bold>
                        {getMealTypeText(item.type)}
                      </AppText>
                      <AppText variant="caption" color="textSecondary">
                        {item.time}
                      </AppText>
                    </View>
                    <AppText variant="body2" color="textSecondary" style={styles.mealContent}>
                      {item.content}
                    </AppText>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  date: {
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  label: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  radioGroup: {
    marginBottom: spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: spacing.borderRadius.lg,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    borderRadius: 15,
  },
  photoPlaceholder: {
    height: 150,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: spacing.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoText: {
    marginTop: spacing.sm,
  },
  emptyText: {
    paddingVertical: spacing.lg,
  },
  mealItem: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  mealPhoto: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.md,
    marginRight: spacing.md,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  mealContent: {
    lineHeight: 20,
  },
});

export default MealRecordScreen;

