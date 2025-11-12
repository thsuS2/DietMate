# 🚀 DietMate 개발 진행 상황 (Progress Report)

> **⚠️ 중요: 이 문서는 항상 최신 상태로 유지해야 합니다!**
> 
> **작업 규칙**: 
> - 새로운 기능을 구현할 때마다 이 파일을 업데이트하세요
> - 미구현 항목이 완성되면 ✅로 변경하세요
> - 새로운 이슈나 개선사항이 발견되면 추가하세요
> - 커밋 전에 이 파일을 먼저 업데이트하세요
> - 다음 AI 에게 작업을 인계할 때 이 파일을 기준으로 합니다

---

## 📌 프로젝트 개요

**프로젝트명**: DietMate (다이어트 메이트)  
**목적**: 집중 다이어트 플랜 종합 비서 앱  
**플랫폼**: Android (React Native CLI)  
**개발 시작일**: 2025년 11월 4일  
**현재 상태**: **MVP 완성** (v1.0)

---

## 🎯 핵심 컨셉

다이어트를 위한 종합 기록 및 관리 앱으로:
1. **기록**: 식단, 운동, 체중, 수분, 메모, 단식
2. **통계**: 주간 분석 및 차트 시각화
3. **가계부**: 배고픔으로 인한 충동 소비 방지
4. **알림**: 기록 습관 형성 지원
5. **게이미피케이션** (추후): 캐릭터, 레벨, 경험치

---

## 🛠️ 기술 스택

### Core
- **React Native**: 0.76.6 (CLI, Metro)
- **Node.js**: v18+
- **npm**: v11.4.2+

### 상태 관리 & 저장
- **Zustand**: 상태 관리
- **AsyncStorage**: 로컬 데이터 저장

### UI & 스타일
- **커스텀 디자인 시스템**: colors, typography, spacing
- **react-native-paper**: 일부 base 컴포넌트
- **react-native-vector-icons**: 아이콘

### 네비게이션
- **@react-navigation/native**
- **@react-navigation/bottom-tabs**: 하단 탭
- **@react-navigation/native-stack**: Stack 네비게이션
- **@react-navigation/material-top-tabs**: Record 상단 탭

### 차트
- **react-native-chart-kit**: Line/Bar/Pie/Progress 차트
- **react-native-svg**: SVG 렌더링

### 기타
- **@notifee/react-native**: 푸시 알림
- **react-native-image-picker**: 이미지 선택
- **date-fns**: 날짜 처리
- **axios**: API 호출 (준비)

---

## 🎨 디자인 시스템

### 색상 테마
- **Primary**: Pink (#FFC0CB) - 친근하고 단호한 느낌
- **Base**: Black & White - 깔끔하고 모던
- **카테고리별 색상**:
  - 💧 수분: Blue
  - 🍽️ 식단: Pink/Orange
  - 🏃 운동: Green
  - ⚖️ 체중: Purple/Pink
  - 📝 메모: Yellow/Beige
  - ⏱️ 단식: Purple
  - 💰 가계부: Pink

### 공통 컴포넌트
- `AppButton`, `AppCard`, `AppInput`, `AppText`
- `AppProgressBar`, `AppRadioButton`, `AppCheckbox`
- `AppModal`, `AppSelectBox`, `AppListItem`
- `AppLineChart`, `AppBarChart`, `AppProgressChart`, `AppContributionChart`

---

## 📁 폴더 구조

```
DietMate/
├── src/
│   ├── components/
│   │   ├── common/        # 공통 UI 컴포넌트
│   │   └── charts/        # 차트 컴포넌트
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── Home/          # 홈 화면
│   │   ├── Record/        # 기록 (6개 서브탭)
│   │   ├── Stats/         # 통계
│   │   ├── Wallet/        # 가계부 (3개 화면)
│   │   ├── Fasting/       # (Record 탭에 통합됨)
│   │   └── Settings/      # 설정
│   ├── store/
│   │   ├── useRecordStore.js
│   │   ├── useSettingsStore.js
│   │   └── useWalletStore.js
│   ├── theme/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── theme.js
│   └── utils/
│       ├── date.js
│       ├── notify.js
│       └── storage.js
├── .Work/                 # 일일 작업 로그
├── .Letter/               # 반성문 (실수 시)
└── PROGRESS.md           # 👈 이 파일!
```

---

## ✅ 구현 완료된 기능 (v1.0)

### 1. 🏠 홈 화면 (HomeScreen)
- [x] 시간대별 인사말 (아침/오후/저녁/밤)
- [x] 오늘 날짜 표시
- [x] D-Day 카드 (다이어트 진행률, 동기부여 메시지)
- [x] 캐릭터 섹션 (Placeholder - 게이미피케이션 준비)
- [x] 오늘의 진행 상황:
  - 체중 (목표까지 남은 kg)
  - 수분 섭취 (진행률 바)
  - 식단 기록 (배지 + 사진 50x50pt)
  - 운동 (진행률 바)
  - 단식 (진행률 바 + 경과 시간)
- [x] 주간 요약 (연속 기록 일수)
- [x] 통계 화면으로 이동 링크

### 2. 📝 기록 탭 (RecordScreen) - 6개 서브탭
#### 2.1 💧 수분 섭취 (WaterRecordScreen)
- [x] 오늘 섭취량 표시 및 진행률
- [x] 숏컷 버튼 (컵, 텀블러 등)
- [x] 기록 히스토리 (시간, 양, 라벨)
- [x] 설정 모달 (목표량, 숏컷 커스터마이징)

#### 2.2 🍽️ 식단 (MealRecordScreen)
- [x] 식사 유형 선택 (아침/점심/저녁/간식)
- [x] 사진 선택 (react-native-image-picker)
- [x] 식사 내용 입력 (multiline)
- [x] 시간 자동 기록
- [x] 오늘의 식사 목록 표시

#### 2.3 🏃 운동 (ExerciseRecordScreen)
- [x] 운동 종류 선택 (SelectBox)
- [x] 운동 시간 입력 (분)
- [x] 강도 선택 (낮음/보통/높음)
- [x] 오늘의 운동 목록 표시 (총 시간 계산)

#### 2.4 ⚖️ 체중 (WeightRecordScreen)
- [x] 체중 입력
- [x] 최근 기록 5개 표시
- [x] 체중 추이 라인 차트 (7일)

#### 2.5 📝 메모 (MemoRecordScreen)
- [x] 자유 형식 일기 입력 (multiline)
- [x] 오늘의 메모 표시
- [x] KeyboardAvoidingView

#### 2.6 ⏱️ 단식 (FastingScreen)
- [x] 단식 시작 시간 설정
- [x] 단식 기간 설정 (12/14/16/18/20시간)
- [x] 실시간 진행 상태 표시
- [x] 진행률 바 및 남은 시간
- [x] 단식 시작/종료 상태 표시

### 3. 📊 통계 탭 (StatsScreen)
- [x] 주간 요약 카드 4개 (수분/운동/몸무게/기록률)
- [x] 4가지 차트:
  - 수분 섭취 바 차트
  - 몸무게 추이 라인 차트
  - 운동 시간 바 차트
  - 목표 달성률 프로그레스 차트
- [x] **무한 주간 네비게이션** (← 날짜 범위 →)
  - 월요일 기준 주간 단위
  - 과거 무제한 탐색
  - 현재 주에서 다음주 버튼 비활성화
- [x] 날짜별 기록 그리드 (7일)
- [x] 날짜 클릭 시 상세 모달
- [x] 수분 목표 달성률: 평균 비율 기반 계산

### 4. 💰 가계부 탭 (WalletScreen)
#### 4.1 메인 화면
- [x] 일관된 헤더 (headerRight 설정 버튼)
- [x] **자산 관리 카드** (총 자산 표시, 관리 화면 이동)
- [x] 예산 카드 (월별 예산 진행률)
- [x] 기간 선택 (오늘/이번주/이번달)
- [x] 도넛 차트 (1차 카테고리별 지출 비율)
- [x] 카테고리 목록 (금액, 비율)
- [x] 거래 내역 (날짜별 그룹핑)
- [x] 플로팅 액션 버튼 (+)

#### 4.2 계층적 카테고리 시스템
- [x] **수입 카테고리** (1차 + 2차):
  - 💰 수입
    - 💵 월급
    - 🏦 이자
    - 🎁 상여
    - 📈 투자
    - 💸 기타소득

- [x] **지출 카테고리** (1차, 2차는 사용자 추가):
  - 🎁 특별지출
  - 🍽️ 식비
  - 🏠 생활비
  - 🎬 문화생활
  - 💳 변동지출
  - 💕 데이트
  - 📌 고정지출

#### 4.3 TransactionAddModal
- [x] 수입/지출 타입 선택
- [x] 금액 입력 (자동 콤마 포맷팅)
- [x] 2단계 카테고리 선택 (1차 필수, 2차 선택)
- [x] 메모 입력
- [x] 날짜/시간 표시

#### 4.4 CategorySettingsScreen
- [x] 수입/지출 카테고리 계층 구조 표시
- [x] 2차 카테고리 추가 기능
- [x] 카테고리 삭제 (확인 다이얼로그)
- [x] 시각적 계층 표시

#### 4.5 AssetManagementScreen (자산 관리)
- [x] 총 자산 표시
- [x] 4가지 자산 타입 (은행/현금/카드/적금)
- [x] 타입별 그룹핑 및 합계
- [x] 자산 추가/삭제
- [x] 타입별 아이콘 및 색상

### 5. ⚙️ 설정 탭 (SettingsScreen)
- [x] 프로필 섹션 (체중, 목표 체중, 키, 나이, BMI 계산)
- [x] 다이어트 설정 (시작일, 목표일)
- [x] 목표 설정 (수분, 걸음 수)
- [x] 단식 설정 (시작 시간, 기간)
- [x] 예산 설정 (월별 총 예산)
- [x] 알림 설정 (전체 ON/OFF, 시간 설정)
- [x] 앱 정보 (버전 1.0.0, 데이터 초기화)

### 6. 🔔 알림 시스템
- [x] Notifee 기반 푸시 알림
- [x] 기록 알림 (설정 시간, 기본 22:00)
- [x] 단식 시작 알림 (10분 전)
- [x] 단식 종료 알림
- [x] 설정 변경 시 자동 재스케줄링
- [x] 알림 ON/OFF 시 즉시 취소/등록

---

## ⏳ 미구현 기능 (banking.md 기반)

### 가계부 추가 기능
- [ ] **반복 거래 등록**
  - 월세, 구독료, 급여 등 자동 생성
  - 반복 패턴 설정 (매월/매주/매일)
  - 자동 거래 생성 로직
  
- [ ] **상세 통계 화면**
  - 월간 리포트 (자동 생성)
  - 월별 비교 막대 차트
  - 트렌드 분석 (증가/감소 추이)
  - 예산 초과 알림
  - TOP 3 지출 카테고리

- [ ] **카테고리별 예산 설정**
  - 각 1차 카테고리별로 예산 할당
  - 카테고리별 예산 대비 사용률
  - 예산 초과 경고

### 게이미피케이션 (추후)
- [ ] 캐릭터 시스템 (이미지, 레벨, 이름)
- [ ] 경험치 시스템 (기록 시 획득)
- [ ] 체력 시스템 (미기록 시 감소)
- [ ] 레벨업 시스템
- [ ] 캐릭터 성장 애니메이션

### 추가 개선 사항
- [ ] 데이터 백업/복원 기능
- [ ] 날짜 선택 (@react-native-community/datetimepicker)
- [ ] 스와이프로 거래 삭제
- [ ] 거래 상세/수정 모달
- [ ] 차트 터치 인터랙션
- [ ] 로딩 인디케이터 개선

---

## 📂 주요 파일 설명

### Store (Zustand)
- **`useRecordStore.js`** (264줄)
  - 모든 기록 데이터 관리 (meals, exercises, weight, water, memo)
  - `addWater()`, `addMeal()`, `addExercise()`, `addWeight()`, `addMemo()`
  - `getWeeklyStats()`: 주간 통계 계산
  - `getWeeklyRecords()`: 주간 기록 조회

- **`useSettingsStore.js`** (142줄)
  - 앱 설정 관리
  - 단식, 알림, 다이어트 기간, 목표 등
  - `setDietPeriod()`, `setFastingTime()`, `updateSettings()`

- **`useWalletStore.js`** (433줄)
  - 가계부 데이터 관리
  - 거래 CRUD, 카테고리 관리, 예산 설정, 자산 관리
  - 계층적 카테고리 지원 (1차/2차)
  - `getGroupedStatistics()`: 1차 카테고리 그룹핑 통계

### Utils
- **`date.js`** (232줄)
  - 날짜 포맷팅, 주간 계산, D-Day, 인사말 등
  - `getWeekByOffset()`, `getDaysElapsed()`, `getGreeting()`

- **`notify.js`** (233줄)
  - Notifee 기반 알림 관리
  - `scheduleAllNotifications()`: 통합 스케줄링
  - 기록/단식 알림 예약

- **`storage.js`**
  - AsyncStorage 헬퍼 함수

### Theme
- **`colors.js`**: 전체 색상 팔레트
- **`typography.js`**: 폰트 스타일
- **`spacing.js`**: 간격 시스템
- **`theme.js`**: 통합 테마

---

## 🚨 작업 시 주의사항

### 1. 사용자 규칙 (반드시 준수!)
1. **요구사항 분석** → 2. **구현 전략 제시 후 사용자 응답 대기** → 3. **승인 후 구현** → 4. **`.Work` 디렉토리에 날짜별 MD 기록**

### 2. 코드 작성 규칙
- 항상 한글로 응답
- step by step으로 천천히 구현
- 기존 디자인 시스템 컴포넌트 활용
- 카테고리별 색상 테마 적용

### 3. 빌드 규칙
- **중요**: 빌드 시 `--device=emulator-5554` 사용 (Pixel_9_Pro_XL_2만!)
- Pixel_7_api_34는 다른 앱 테스트 중이므로 절대 사용 금지
- 포트: `--port 8082`

### 4. Git 규칙
- 원격 저장소: `git@github-personal:thsuS2/DietMate.git` (SSH)
- 기능 완성 시 커밋
- 커밋 메시지는 영어로 (feat/fix/refactor/docs)

### 5. 실수 시 규칙
- 사용자 지시를 제대로 따르지 못한 경우: `.Letter` 디렉토리에 반성문 5천자 이상 작성
- 기존 `.Letter` 파일들을 참고하여 같은 실수 반복하지 않기

---

## 🐛 알려진 이슈 및 해결 방법

### 1. 빌드 관련
- **NDK 버전 문제**: 손상된 NDK 삭제 시 자동 재다운로드
- **애니메이션 라이브러리**: 제거됨 (복잡도 감소)
- **알림 라이브러리**: Notifee 사용 (push-notification 제거)
- **차트 라이브러리**: react-native-chart-kit 사용 (victory-native 제거)

### 2. SSH 관련
- `~/.ssh/config`에서 `github-personal` 호스트 사용
- private key 권한: `chmod 600 ~/keys/id_ed25519_personal`

### 3. npm 캐시
- 프로젝트 로컬 캐시 사용: `export npm_config_cache=/Users/jisoo/Soo/.npm-temp-cache`

---

## 📊 현재 코드 통계 (2025-11-10 기준)

### Git 커밋 내역
```
1. feat: Implement all record features (Meal/Exercise/Weight/Memo/Fasting)
2. feat: Implement Statistics screen with weekly charts
3. feat: Add infinite week navigation to Statistics screen
4. fix: Change water goal rate calculation to average-based ratio
5. feat: Implement Home screen with dashboard
6. refactor: Improve Home screen progress section
7. feat: Implement Wallet (ledger) feature with budget management
8. feat: Add hierarchical category system to Wallet
9. feat: Implement comprehensive Settings screen
10. feat: Implement notification scheduling system
11. feat: Add asset management feature to Wallet
```

### 코드량
- **총 파일 수**: 약 40개
- **총 라인 수**: 약 6,500줄
- **화면 수**: 17개
- **컴포넌트**: 15개 (common 11개, charts 4개)

---

## 🎯 다음 작업 우선순위

### 우선순위 1: 가계부 고도화
1. **반복 거래 기능** (banking.md 2번째 미구현)
   - 반복 거래 템플릿 생성
   - 자동 생성 로직
   - 관리 화면

2. **상세 통계** (banking.md 3번째 미구현)
   - 월간 리포트 화면
   - 월별 비교 차트
   - 예산 초과 알림

### 우선순위 2: UX 개선
- 날짜 선택기 (DateTimePicker)
- 거래 수정/삭제 기능
- 스와이프 제스처
- 로딩 상태 개선

### 우선순위 3: 게이미피케이션
- 캐릭터 시스템
- 레벨/경험치/체력
- 홈 화면 캐릭터 섹션 완성

---

## 💡 개발 팁

### 1. 디자인 시스템 활용
모든 새로운 화면은 기존 공통 컴포넌트를 최대한 활용하세요:
```javascript
import { AppCard, AppText, AppButton, AppProgressBar } from '../../components/common';
import { AppLineChart, AppBarChart } from '../../components/charts';
```

### 2. 색상 테마
카테고리별로 색상을 지정하여 일관성 유지:
```javascript
import { colors } from '../../theme/colors';
// colors.water, colors.meal, colors.exercise, colors.weight, etc.
```

### 3. 상태 관리
- Zustand store에서 데이터 가져오기
- 변경 시 store 함수 호출 → 자동으로 AsyncStorage에 저장

### 4. 날짜 처리
```javascript
import { getTodayString, formatDateKorean, getWeekByOffset } from '../../utils/date';
```

---

## 📝 .Work 파일 규칙

매일 작업 후 `.Work/YYYY-MM-DD.md` 파일에 다음 내용 기록:
1. 오늘의 목표
2. 완료된 작업 (상세)
3. 발생한 에러 및 해결 방법
4. 코드 통계
5. Git 커밋 내역
6. 다음 작업 계획
7. 오늘의 요약

---

## 🔄 이 파일(PROGRESS.md) 업데이트 시점

다음과 같은 경우 **반드시 이 파일을 업데이트**하세요:

1. ✅ **새로운 기능 완성 시**
   - "미구현 기능"에서 "구현 완료" 섹션으로 이동
   - 상세 내용 추가

2. 📊 **통계 업데이트 시**
   - 커밋 수, 라인 수, 파일 수 업데이트

3. 🐛 **새로운 이슈 발견 시**
   - "알려진 이슈 및 해결 방법"에 추가

4. 🎯 **우선순위 변경 시**
   - "다음 작업 우선순위" 섹션 업데이트

5. 📁 **파일 구조 변경 시**
   - "폴더 구조" 섹션 업데이트

6. 🚨 **중요한 주의사항 추가 시**
   - "작업 시 주의사항" 섹션에 추가

---

## 🎉 MVP 완성 체크리스트

### Core Features
- [x] 홈 대시보드
- [x] 기록 (6개 카테고리)
- [x] 통계 (차트 + 주간 네비게이션)
- [x] 가계부 (거래 관리 + 카테고리 + 자산)
- [x] 설정 (모든 개인화 설정)
- [x] 알림 (자동 스케줄링)

### 디자인 시스템
- [x] 색상 시스템
- [x] 타이포그래피
- [x] 간격 시스템
- [x] 공통 컴포넌트 11개
- [x] 차트 컴포넌트 4개

### 빌드 & 배포
- [x] Android 빌드 성공
- [x] 에뮬레이터 테스트 (Pixel_9_Pro_XL_2)
- [ ] 실제 기기 테스트
- [ ] APK 릴리즈 빌드
- [ ] Google Play 배포

---

## 📞 다음 AI에게 전달 사항

### 이 프로젝트를 이어받으시는 AI에게:

1. **먼저 이 파일(PROGRESS.md)을 정독하세요**
2. **`.Work/2025-11-XX.md` 파일을 확인**하여 최근 작업 내용 파악
3. **`.Letter` 디렉토리**를 확인하여 과거 실수 방지
4. **사용자 규칙 4단계**를 반드시 따르세요
5. **빌드 시 emulator-5554만 사용**하세요
6. **작업 후 이 파일(PROGRESS.md)을 업데이트**하세요

### 추천 작업 흐름
```
1. PROGRESS.md 읽기
2. 미구현 기능 확인
3. 사용자에게 구현 전략 제시
4. 승인 후 구현
5. 빌드 & 테스트 (--device=emulator-5554)
6. Git 커밋 & 푸시
7. .Work 파일 업데이트
8. PROGRESS.md 업데이트
```

---

## 📚 참고 문서

- **README.md**: 프로젝트 초기 기획 및 목표
- **Data.md**: 데이터 구조 설계
- **banking.md**: 가계부 기능 기획서
- **.Work/**: 일일 작업 로그
- **.Letter/**: 반성문 (실수 기록)

---

## 🏆 현재 상태 요약

**DietMate v1.0 MVP는 완성되었습니다!** 🎊

- ✅ 모든 핵심 기능 구현 완료
- ✅ 디자인 시스템 완성
- ✅ 알림 시스템 작동
- ✅ Android 빌드 성공
- ✅ 실제 사용 가능한 상태

**다음 단계는 가계부 고도화 (반복 거래, 상세 통계) 또는 게이미피케이션 추가입니다.**

---

**최종 업데이트**: 2025년 11월 10일  
**작성자**: AI Assistant  
**버전**: v1.0 MVP Complete  
**상태**: ✅ Ready for Enhancement

