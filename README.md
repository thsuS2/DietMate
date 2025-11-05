🩵 DietMate (React Native CLI ver.)

집중 감량 & 유지기 관리용 다이어트 종합 비서 앱
“記錄이 습관이 되고, 습관이 결과를 만든다.”

📱 프로젝트 개요

DietMate는 체중 감량을 목표로 하는 사용자를 위한
기록형 다이어트 종합 관리 앱입니다.

초기 버전은 로컬 데이터 기반(AsyncStorage) 으로 동작하며,
추후 Supabase를 통한 클라우드 동기화와
게이미피케이션 시스템이 추가될 예정입니다.

🎯 주요 목표

3개월 집중 감량 → 이후 유지 루틴 형성

식단, 운동, 수면, 수분, 소비 패턴을 하나의 앱에서 통합 관리

감정적 소비 억제를 위한 가계부 연동

오프라인 우선(로컬) 구조로 설계, 이후 서버 업로드 확장

🧩 기술 스택
구분	기술
Framework	React Native (CLI)
Language	JavaScript (ES6+)
State Management	Zustand
Storage (임시)	AsyncStorage
Database (확장 예정)	Supabase
UI Library	Styled Components
Chart / Graph	react-native-svg + victory-native
Notification	react-native-push-notification
Image Picker	react-native-image-picker
🧠 핵심 기능
1. 기록 기능
항목	설명
식단 기록	- 사진 선택
- 아침/점심/저녁 선택
- 식사시간 기록
- 식사 내용 텍스트 입력
운동 기록	- 직접 입력 + 걸음수 연동(HealthKit / Google Fit 연동 예정)
- 운동 종류 / 시간 / 강도
몸무게 기록	- 날짜별 입력 / 차트로 추이 시각화
수분 섭취	- 1컵 단위 추가 / 하루 목표 설정
메모(일기)	- 감정, 컨디션, 식사 이유 등 자유 기록
2. 통계 / 대시보드
항목	설명
주간 요약	- 식단, 운동, 수분, 체중 추이 그래프
- 주간 평균 비교
날짜별 상세 보기	- 특정 날짜의 기록 전체 조회
달력 뷰(추후)	- 기록 여부 / 식단 점수 시각화 예정
3. 간헐적 단식 관리
항목	설명
시작시간 세팅	- 예: 오후 8시 시작 / 오전 12시까지 단식 유지
알림 기능	- “단식 시작 10분 전” 알림
- “식사 종료 시간 알림” 제공
4. 알림 기능
항목	설명
기록 알림	- “오늘 기록했나요?” 자기 전 푸시
단식 알림	- 단식 시작 / 종료시간 알림
루틴 알림(추후)	- 수분 섭취 리마인더 / 아침 체중 측정 등
5. 가계부
항목	설명
소비 기록	- 날짜, 금액, 항목 입력
소비 이유	- 감정적 소비 예방을 위한 메모
주간 통계	- “배고픔에 의한 소비” 카테고리화
6. 설정
항목	설명
다이어트 기간 설정	- 달력으로 다이어트 기간, 목표 설정
사용자 현재 상태 설정	- 사용자 최초 상태 설정 가능
🎮 향후 확장 계획
기능	설명
게이미피케이션	캐릭터, 경험치, 체력 시스템 도입 → 기록률 기반 성장
AI 피드백 챗봇	기록 데이터를 기반으로 한 맞춤 피드백
Supabase 연동	사용자 계정 / 클라우드 백업 / 통계 공유
건강 데이터 연동	Google Fit, Samsung Health, Apple HealthKit 연동
📂 폴더 구조 (RN CLI)
DietMate/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── charts/
│   ├── screens/
│   │   ├── Record/
│   │   ├── Stats/
│   │   ├── Fasting/
│   │   ├── Wallet/
│   │   └── Settings/
│   ├── store/
│   │   └── useRecordStore.js
│   ├── utils/
│   │   ├── storage.js
│   │   ├── date.js
│   │   └── notify.js
│   └── AppNavigator.js
├── App.js
├── package.json
└── README.md

💾 로컬 데이터 구조
{
  records: {
    "2025-11-03": {
      meals: [
        { type: "breakfast", time: "08:30", content: "계란 2개, 커피", photo: "file://..." },
        { type: "dinner", time: "18:00", content: "닭가슴살, 샐러드" }
      ],
      exercise: { type: "걷기", duration: 40, steps: 8500 },
      weight: 61.2,
      water: 1400,
      memo: "기분 좋음, 단식 유지 성공"
    }
  },
  settings: {
    fastingStart: "20:00",
    fastingDuration: 16,
    notifications: true
  },
  wallet: [
    { date: "2025-11-03", amount: 9000, reason: "스트레스로 간식 구입" }
  ]
}

🧱 개발 일정
단계	기간	목표
1단계 (11~12월)	로컬 기반 기록 + 알림 + 통계 MVP 완성	
2단계 (1~2월)	Supabase 연동 + 계정 시스템 추가	
3단계 (3월)	캐릭터/레벨/경험치 시스템 추가	
4단계 (4~5월)	Google Fit 연동 + 정식 배포 준비	
💡 설치 & 실행
# 1. 프로젝트 생성
npx react-native init DietMate

# 2. 디렉토리 이동
cd DietMate

# 3. 필수 패키지 설치
npm install zustand @react-native-async-storage/async-storage styled-components \
react-native-svg victory-native react-native-push-notification react-native-image-picker

# 4. Android 실행
npx react-native run-android

# 5. iOS 실행
npx react-native run-ios

⚙️ 향후 데이터 연동 구조
React Native
    ↓
Zustand (state)
    ↓
AsyncStorage ↔ Supabase (sync)
    ↓
Notification / Chart

✨ 비전

DietMate는 단순한 다이어트 기록 앱이 아니라,
**‘습관 데이터 기반 자기관리 도구’**로 발전할 예정입니다.

“기록하는 사람은 실패하지 않는다.”