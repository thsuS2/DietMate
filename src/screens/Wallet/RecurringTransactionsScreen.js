import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import useWalletStore from '../../store/useWalletStore';
import { AppCard, AppText, AppButton, AppRadioButton, AppModal, AppInput, AppCheckbox } from '../../components/common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getTodayString } from '../../utils/date';

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: '매월', icon: '📅' },
  { value: 'weekly', label: '매주', icon: '🗓️' },
  { value: 'daily', label: '매일', icon: '☀️' },
];

const DAYS_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

const createBlankForm = (overrides = {}) => ({
  name: '',
  type: 'expense',
  amount: '',
  frequency: 'monthly',
  interval: '1',
  dayOfMonth: '1',
  daysOfWeek: ['1'],
  time: '09:00',
  startDate: getTodayString(),
  endDate: '',
  primaryCategory: null,
  category: null,
  memo: '',
  autoCreate: true,
  ...overrides,
});

const RecurringTransactionFormModal = ({
  visible,
  onClose,
  defaultValues,
  onSubmit,
  categories,
}) => {
  const [form, setForm] = useState(createBlankForm());

  const buildFormState = useCallback((values) => {
    const base = createBlankForm();
    const ensurePrimary = (type) => {
      const primaryCandidate = categories.find((cat) => cat.type === type && cat.isParent);
      return primaryCandidate ? primaryCandidate.id : null;
    };

    if (values) {
      const type = values.type || 'expense';
      const categoryInfo = categories.find((cat) => cat.id === values.category);
      const primaryFromCategory = categoryInfo?.parentId || (categoryInfo?.isParent ? categoryInfo.id : null);
      const fallbackPrimary = ensurePrimary(type);

      return createBlankForm({
        ...values,
        type,
        amount: values.amount ? String(values.amount) : '',
        interval: values.interval ? String(values.interval) : '1',
        dayOfMonth: values.dayOfMonth ? String(values.dayOfMonth) : '1',
        daysOfWeek: Array.isArray(values.daysOfWeek) && values.daysOfWeek.length
          ? values.daysOfWeek.map((day) => String(day))
          : ['1'],
        startDate: values.startDate || getTodayString(),
        endDate: values.endDate || '',
        memo: values.memo || '',
        autoCreate: values.autoCreate !== undefined ? values.autoCreate : true,
        primaryCategory: primaryFromCategory || fallbackPrimary,
        category: values.category || primaryFromCategory || fallbackPrimary,
      });
    }

    const defaultType = 'expense';
    const defaultPrimary = ensurePrimary(defaultType);
    return createBlankForm({
      type: defaultType,
      primaryCategory: defaultPrimary,
      category: defaultPrimary,
    });
  }, [categories]);

  useEffect(() => {
    setForm(buildFormState(defaultValues));
  }, [buildFormState, defaultValues, visible]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeChange = (nextType) => {
    const primaryCandidate = categories.find((cat) => cat.type === nextType && cat.isParent);
    setForm((prev) => ({
      ...prev,
      type: nextType,
      primaryCategory: primaryCandidate?.id || null,
      category: primaryCandidate?.id || null,
    }));
  };

  const handlePrimarySelect = (categoryId) => {
    setForm((prev) => {
      const childIds = categories
        .filter((cat) => cat.parentId === categoryId)
        .map((cat) => cat.id);
      const canKeepChild = childIds.includes(prev.category);
      return {
        ...prev,
        primaryCategory: categoryId,
        category: canKeepChild ? prev.category : categoryId,
      };
    });
  };

  const handleSecondarySelect = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      category: categoryId,
    }));
  };

  const sanitizeNumberString = (value) => value.replace(/[^0-9]/g, '');

  const handleNumericChange = (key) => (text) => {
    const sanitized = sanitizeNumberString(text);
    setForm((prev) => ({
      ...prev,
      [key]: sanitized,
    }));
  };

  const handleSubmit = () => {
    if (!form.name) {
      Alert.alert('입력 필요', '템플릿 이름을 입력해주세요.');
      return;
    }
    if (!form.category) {
      Alert.alert('입력 필요', '카테고리를 선택해주세요.');
      return;
    }
    const amount = parseInt(String(form.amount).replace(/[^0-9]/g, ''), 10) || 0;
    if (amount <= 0) {
      Alert.alert('입력 오류', '금액을 올바르게 입력해주세요.');
      return;
    }

    onSubmit({
      ...form,
      amount,
      interval: Math.max(1, parseInt(form.interval, 10) || 1),
      dayOfMonth: Math.min(31, Math.max(1, parseInt(form.dayOfMonth, 10) || 1)),
      daysOfWeek: Array.isArray(form.daysOfWeek) ? form.daysOfWeek.map((d) => parseInt(d, 10)) : [1],
      startDate: form.startDate || getTodayString(),
      endDate: form.endDate || null,
    });
  };

  const primaryCategories = useMemo(() => (
    categories.filter((cat) => cat.type === form.type && cat.isParent)
  ), [categories, form.type]);

  const secondaryCategories = useMemo(() => {
    if (!form.primaryCategory) {
      return [];
    }
    return categories.filter((cat) => cat.parentId === form.primaryCategory);
  }, [categories, form.primaryCategory]);

  const primaryCategoryInfo = useMemo(() => (
    categories.find((cat) => cat.id === form.primaryCategory)
  ), [categories, form.primaryCategory]);

  useEffect(() => {
    if (primaryCategories.length === 0) {
      return;
    }
    if (!form.primaryCategory || !primaryCategories.some((cat) => cat.id === form.primaryCategory)) {
      const firstPrimary = primaryCategories[0].id;
      setForm((prev) => ({
        ...prev,
        primaryCategory: firstPrimary,
        category: firstPrimary,
      }));
    }
  }, [form.primaryCategory, primaryCategories]);

  useEffect(() => {
    if (!form.primaryCategory) {
      return;
    }
    if (form.category === form.primaryCategory) {
      return;
    }
    const isValidSecondary = secondaryCategories.some((cat) => cat.id === form.category);
    if (!isValidSecondary) {
      setForm((prev) => ({
        ...prev,
        category: prev.primaryCategory,
      }));
    }
  }, [form.category, form.primaryCategory, secondaryCategories]);

  const toggleDayOfWeek = (day) => {
    const strDay = String(day);
    setForm((prev) => {
      const exists = prev.daysOfWeek.includes(strDay);
      const nextDays = exists
        ? prev.daysOfWeek.filter((d) => d !== strDay)
        : [...prev.daysOfWeek, strDay].sort((a, b) => Number(a) - Number(b));
      return {
        ...prev,
        daysOfWeek: nextDays.length > 0 ? nextDays : [strDay],
      };
    });
  };

  const formatAmountText = (value) => {
    const numeric = value.replace(/[^0-9]/g, '');
    return numeric ? Number(numeric).toLocaleString() : '';
  };

  return (
    <AppModal visible={visible} onClose={onClose} title="반복 거래 템플릿" size="large">
      <ScrollView style={styles.modalContent}>
        <AppInput
          label="템플릿 이름"
          placeholder="예: 월세, 넷플릭스 구독"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <View style={styles.radioGroup}>
          <AppRadioButton
            label="지출"
            checked={form.type === 'expense'}
            onChange={() => handleTypeChange('expense')}
          />
          <AppRadioButton
            label="수입"
            checked={form.type === 'income'}
            onChange={() => handleTypeChange('income')}
          />
        </View>

        <AppText variant="h4" style={styles.sectionTitle}>
          카테고리
        </AppText>
        {primaryCategories.length === 0 ? (
          <AppText variant="body2" color="error">
            사용할 수 있는 카테고리가 없습니다. 카테고리를 먼저 추가해주세요.
          </AppText>
        ) : (
          <View style={styles.categorySection}>
            <AppText variant="caption" color="textSecondary" style={styles.categoryHelper}>
              1차 카테고리 선택
            </AppText>
            <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
              {primaryCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    form.primaryCategory === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => handlePrimarySelect(cat.id)}
                >
                  <AppText variant="body2">
                    {cat.icon} {cat.name}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {secondaryCategories.length > 0 ? (
              <>
                <AppText variant="caption" color="textSecondary" style={styles.categoryHelper}>
                  2차 카테고리 (선택)
                </AppText>
                <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
                  {primaryCategoryInfo && (
                    <TouchableOpacity
                      key={`${primaryCategoryInfo.id}-primary`}
                      style={[
                        styles.categoryChip,
                        form.category === primaryCategoryInfo.id && styles.categoryChipActive,
                      ]}
                      onPress={() => handleSecondarySelect(primaryCategoryInfo.id)}
                    >
                      <AppText variant="body2">
                        {primaryCategoryInfo.icon} {primaryCategoryInfo.name} (1차)
                      </AppText>
                    </TouchableOpacity>
                  )}
                  {secondaryCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        form.category === cat.id && styles.categoryChipActive,
                      ]}
                      onPress={() => handleSecondarySelect(cat.id)}
                    >
                      <AppText variant="body2">
                        {cat.icon} {cat.name}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <AppText variant="caption" color="textSecondary" style={styles.categoryHelper}>
                  선택하지 않으면 1차 카테고리로 저장됩니다.
                </AppText>
              </>
            ) : (
              <AppText variant="caption" color="textSecondary" style={styles.categoryHelper}>
                2차 카테고리가 없으면 1차만 선택해도 저장됩니다.
              </AppText>
            )}
          </View>
        )}

        <AppInput
          label="금액"
          placeholder="0"
          type="number"
          value={form.amount ? formatAmountText(form.amount) : ''}
          onChangeText={handleNumericChange('amount')}
        />

        <AppInput
          label="간격 (반복 주기)"
          placeholder="1"
          type="number"
          value={form.interval}
          onChangeText={handleNumericChange('interval')}
        />

        <AppText variant="h4" style={styles.sectionTitle}>
          주기
        </AppText>
        <View style={styles.radioRow}>
          {FREQUENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.frequencyButton,
                form.frequency === option.value && styles.frequencyButtonActive,
              ]}
              onPress={() => handleChange('frequency', option.value)}
            >
              <AppText variant="body1">
                {option.icon} {option.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText variant="body2" color="textSecondary" style={styles.helperText}>
          {form.frequency === 'monthly'
            ? '매월 특정 날짜(dayOfMonth)에 생성됩니다.'
            : form.frequency === 'weekly'
            ? '선택한 요일에 생성됩니다. (0 일요일 ~ 6 토요일)'
            : '매일 생성되며 간격(일)을 활용해 조정할 수 있습니다.'}
        </AppText>

        {form.frequency === 'monthly' && (
          <AppInput
            label="생성 일자 (1~31)"
            placeholder="1"
            type="number"
            value={form.dayOfMonth}
            onChangeText={handleNumericChange('dayOfMonth')}
          />
        )}

        {form.frequency === 'weekly' && (
          <View style={styles.daySelector}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  form.daysOfWeek.includes(String(day)) && styles.dayChipActive,
                ]}
                onPress={() => toggleDayOfWeek(day)}
              >
                <AppText variant="body2">{DAYS_LABEL[day]}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <AppInput
          label="자동 생성 시간 (HH:mm)"
          placeholder="09:00"
          value={form.time}
          onChangeText={(text) => handleChange('time', text)}
        />

        <AppInput
          label="시작일 (YYYY-MM-DD)"
          placeholder={getTodayString()}
          value={form.startDate}
          onChangeText={(text) => handleChange('startDate', text)}
        />

        <AppInput
          label="종료일 (선택)"
          placeholder="미설정 시 빈 칸"
          value={form.endDate}
          onChangeText={(text) => handleChange('endDate', text)}
        />

        <AppInput
          label="메모 (선택)"
          placeholder="템플릿 설명, 메모 등"
          value={form.memo}
          onChangeText={(text) => handleChange('memo', text)}
          multiline
          numberOfLines={3}
        />

        <AppCheckbox
          label="자동으로 거래 생성"
          checked={form.autoCreate}
          onChange={(checked) => handleChange('autoCreate', checked)}
        />

        <View style={styles.buttonRow}>
          <AppButton variant="outlined" colorTheme="primary" onPress={onClose}>
            취소
          </AppButton>
          <AppButton variant="contained" colorTheme="primary" onPress={handleSubmit}>
            저장
          </AppButton>
        </View>
      </ScrollView>

    </AppModal>
  );
};

const RecurringTransactionsScreen = () => {
  const {
    getRecurringTemplates,
    addRecurringTemplate,
    updateRecurringTemplate,
    deleteRecurringTemplate,
    generateRecurringTransactions,
    categories,
  } = useWalletStore();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = getRecurringTemplates();
  const isFocused = useIsFocused();

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});
  }, [categories]);

  const getScheduleSummary = (template) => {
    switch (template.frequency) {
      case 'daily':
        return `매일 (간격 ${template.interval}일)`;
      case 'weekly': {
        const days = Array.isArray(template.daysOfWeek) ? template.daysOfWeek : [];
        const labels = days.map((day) => DAYS_LABEL[day] ?? day).join(', ');
        return `매주 ${labels || '요일 미지정'} (간격 ${template.interval}주)`;
      }
      case 'monthly':
      default:
        return `매월 ${template.dayOfMonth}일 (간격 ${template.interval}개월)`;
    }
  };

  useEffect(() => {
    if (isFocused) {
      handleGenerate({ silent: true });
    }
  }, [isFocused, handleGenerate]);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (templateId) => {
    Alert.alert('삭제 확인', '선택한 반복 거래 템플릿을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteRecurringTemplate(templateId);
        },
      },
    ]);
  };

  const handleSubmit = async (data) => {
    if (isEditing && selectedTemplate) {
      await updateRecurringTemplate(selectedTemplate.id, data);
    } else {
      await addRecurringTemplate(data);
    }
    setModalVisible(false);
    setSelectedTemplate(null);
    setIsEditing(false);
    await handleGenerate();
  };

  const handleGenerate = useCallback(async ({ silent } = {}) => {
    try {
      setIsGenerating(true);
      const generated = await generateRecurringTransactions();
      if (!silent) {
        if (generated.length > 0) {
          Alert.alert('자동 생성', `반복 거래 ${generated.length}건이 등록되었습니다.`);
        } else {
          Alert.alert('자동 생성', '새로 생성된 반복 거래가 없습니다.');
        }
      }
    } finally {
      setIsGenerating(false);
    }
  }, [generateRecurringTransactions]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard variant="elevated" elevation="sm" style={styles.infoCard}>
          <AppText variant="h3">🔁 반복 거래 관리</AppText>
          <AppText variant="body2" color="textSecondary" style={styles.helperText}>
            월세, 구독료, 급여 등 반복되는 거래를 템플릿으로 관리하고 자동으로 생성할 수 있습니다.
          </AppText>
        </AppCard>

        {templates.length === 0 ? (
          <AppCard variant="outlined" style={styles.emptyCard}>
            <AppText variant="body1" align="center" color="textSecondary">
              아직 등록된 반복 거래가 없습니다.
            </AppText>
            <AppText variant="caption" align="center" color="textSecondary">
              + 버튼을 눌러 템플릿을 추가해보세요.
            </AppText>
          </AppCard>
        ) : (
          templates.map((template) => {
            const categoryInfo = categoryMap[template.category];
            return (
              <AppCard key={template.id} variant="elevated" elevation="xs" style={styles.templateCard}>
                <View style={styles.templateHeader}>
                  <AppText variant="h4">{template.name}</AppText>
                  <View style={styles.templateActions}>
                    <TouchableOpacity onPress={() => handleEdit(template)}>
                      <AppText variant="body2" color="primary">
                        수정
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(template.id)}>
                      <AppText variant="body2" color="error">
                        삭제
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
                <AppText variant="body2" color="textSecondary">
                  {template.type === 'income' ? '수입' : '지출'} · {template.amount.toLocaleString()}원
                </AppText>
                <AppText variant="body2" color="textSecondary">
                  카테고리 {categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : '미지정'}
                </AppText>
                <AppText variant="body2" color="textSecondary">
                  {getScheduleSummary(template)}
                </AppText>
                <AppText variant="body2" color="textSecondary">
                  시작일 {template.startDate}
                </AppText>
                {template.endDate && (
                  <AppText variant="body2" color="textSecondary">
                    종료일 {template.endDate}
                  </AppText>
                )}
                <AppText variant="caption" color="textSecondary" style={styles.autoStatus}>
                  자동 생성 {template.autoCreate ? 'ON' : 'OFF'}
                </AppText>
              </AppCard>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <AppText variant="h1" color="white">
          +
        </AppText>
      </TouchableOpacity>

      <AppButton
        variant="contained"
        colorTheme="primary"
        style={styles.generateButton}
        onPress={() => handleGenerate()}
        loading={isGenerating}
      >
        반복 거래 즉시 생성
      </AppButton>

      <RecurringTransactionFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTemplate(null);
          setIsEditing(false);
        }}
        defaultValues={selectedTemplate}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  helperText: {
    marginTop: spacing.xs,
  },
  categorySection: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  categoryHelper: {
    marginTop: spacing.xs,
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  templateCard: {
    marginBottom: spacing.sm,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  templateActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  dayChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dayChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg * 2,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButton: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  modalContent: {
    flex: 1,
    gap: spacing.sm,
  },
  sectionTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  chipContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  categoryChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  radioRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  frequencyButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  autoStatus: {
    marginTop: spacing.xs,
  },
});

export default RecurringTransactionsScreen;

