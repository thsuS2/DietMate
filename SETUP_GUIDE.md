# 🚀 DietMate 개발 환경 설정 가이드

> 다른 PC에서 프로젝트를 clone하여 이어서 개발할 때 필요한 설정 가이드입니다.

---

## 📋 목차

1. [필수 사전 요구사항](#필수-사전-요구사항)
2. [프로젝트 클론](#프로젝트-클론)
3. [환경 설정](#환경-설정)
4. [의존성 설치](#의존성-설치)
5. [빌드 및 실행](#빌드-및-실행)
6. [개발 환경 설정](#개발-환경-설정)
7. [주요 파일 구조](#주요-파일-구조)
8. [문제 해결](#문제-해결)

---

## 필수 사전 요구사항

### 1. Node.js & npm
- **Node.js**: v18 이상
- **npm**: v11.4.2 이상
- 확인 방법:
  ```bash
  node --version
  npm --version
  ```

### 2. React Native CLI
```bash
npm install -g react-native-cli
```

### 3. Android 개발 환경
- **Android Studio**: 최신 버전
- **Android SDK**: API 35 (Android 15)
- **Android NDK**: 자동 설치됨
- **Java Development Kit (JDK)**: 17 이상

### 4. 환경 변수 설정
다음 환경 변수를 `~/.zshrc` 또는 `~/.bash_profile`에 추가:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

### 5. Git & SSH 설정
- **Git**: 설치되어 있어야 함
- **SSH 키**: GitHub 접근용 SSH 키 설정 필요
  - `~/.ssh/config`에 `github-personal` 호스트 설정 확인
  - SSH 키 권한: `chmod 600 ~/keys/id_ed25519_personal`

---

## 프로젝트 클론

### 1. 저장소 클론
```bash
git clone git@github-personal:thsuS2/DietMate.git
cd DietMate
```

### 2. 브랜치 확인
```bash
git branch
# main 브랜치에서 작업합니다
```

---

## 환경 설정

### 1. npm 캐시 설정 (선택사항)
프로젝트 로컬 캐시 사용 (다른 프로젝트와 충돌 방지):
```bash
export npm_config_cache=$(pwd)/.npm-temp-cache
```

### 2. Watchman 설치 (macOS 권장)
```bash
brew install watchman
```

---

## 의존성 설치

### 1. npm 패키지 설치
```bash
npm install
```

### 2. Android 의존성 설치
```bash
cd android
./gradlew clean
cd ..
```

### 3. Metro 번들러 캐시 초기화 (필요시)
```bash
npm start -- --reset-cache
```

---

## 빌드 및 실행

### 1. Android 에뮬레이터 준비
- **에뮬레이터**: `Pixel_9_Pro_XL_2 (API 35)` 사용
- Android Studio에서 에뮬레이터 생성 및 실행
- 에뮬레이터가 실행 중인지 확인:
  ```bash
  adb devices
  # emulator-5554	device 가 보여야 함
  ```

### 2. Metro 번들러 실행
터미널 1:
```bash
npm start -- --port 8082
```

### 3. Android 앱 빌드 및 실행
터미널 2:
```bash
npx react-native run-android --device=emulator-5554 --port 8082
```

**⚠️ 중요**: 
- `--device=emulator-5554` 플래그를 **반드시** 사용하여 지정된 에뮬레이터에만 빌드
- 다른 에뮬레이터(`Pixel_7_api_34` 등)가 실행 중이면 먼저 종료

---

## 개발 환경 설정

### 1. 에디터 설정
- **VS Code** 또는 **Cursor** 권장
- React Native 확장 프로그램 설치

### 2. 린터 설정
```bash
npm run lint
```

### 3. 테스트 실행
```bash
npm test
```

---

## 주요 파일 구조

```
DietMate/
├── src/
│   ├── components/          # 공통 컴포넌트
│   │   ├── common/          # 버튼, 카드, 입력 등
│   │   └── charts/          # 차트 컴포넌트
│   ├── screens/             # 화면 컴포넌트
│   │   ├── Home/            # 홈 화면
│   │   ├── Record/          # 기록 화면
│   │   ├── Stats/           # 통계 화면
│   │   ├── Wallet/          # 가계부 화면
│   │   └── Settings/        # 설정 화면
│   ├── store/               # Zustand 상태 관리
│   │   ├── useRecordStore.js
│   │   ├── useSettingsStore.js
│   │   └── useWalletStore.js
│   ├── utils/               # 유틸리티 함수
│   │   ├── date.js          # 날짜 처리
│   │   ├── logger.js        # 로깅
│   │   ├── notify.js        # 알림
│   │   └── storage.js       # AsyncStorage
│   ├── theme/               # 디자인 시스템
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── theme.js
│   └── navigation/          # 네비게이션
│       └── AppNavigator.js
├── android/                  # Android 네이티브 코드
├── ios/                     # iOS 네이티브 코드 (현재 미사용)
├── App.tsx                  # 앱 진입점
├── package.json             # 의존성 목록
├── PROGRESS.md              # 프로젝트 진행 상황
├── AIRule.md                # 개발 규칙
└── SETUP_GUIDE.md           # 이 파일
```

---

## 문제 해결

### 1. 빌드 오류
```bash
# Android 빌드 캐시 정리
cd android
./gradlew clean
cd ..

# node_modules 재설치
rm -rf node_modules
npm install

# Metro 캐시 초기화
npm start -- --reset-cache
```

### 2. 에뮬레이터 연결 문제
```bash
# ADB 재시작
adb kill-server
adb start-server
adb devices
```

### 3. NDK 버전 불일치
- Android Studio에서 자동으로 올바른 NDK 버전을 다운로드합니다
- `android/local.properties` 파일 삭제 후 재빌드

### 4. 의존성 충돌
```bash
# package-lock.json 삭제 후 재설치
rm package-lock.json
npm install
```

### 5. Metro 번들러 포트 충돌
```bash
# 포트 8082가 사용 중인 경우
lsof -ti:8082 | xargs kill -9
npm start -- --port 8082
```

---

## 개발 규칙

### 1. Git 커밋 규칙
- **커밋 메시지**: Conventional Commits 규칙 준수
  - `feat`: 새로운 기능
  - `fix`: 버그 수정
  - `refactor`: 코드 리팩토링
  - `docs`: 문서 수정
  - `style`: 코드 스타일 변경
  - `chore`: 빌드 시스템, 패키지 매니저 설정

### 2. 작업 흐름
1. 작업 시작 전 `PROGRESS.md` 확인
2. 기능 구현
3. 테스트 및 검증
4. `PROGRESS.md` 업데이트
5. Git 커밋 및 푸시

### 3. 코드 스타일
- **언어**: 사용자 소통은 한글, 코드는 영어
- **컴포넌트**: `src/components/common/`의 공통 컴포넌트 활용
- **디자인 시스템**: `src/theme/`의 색상, 타이포그래피, 간격 사용
- **로깅**: `console.log/error` 대신 `logger.log/error` 사용

### 4. 문서 관리
- **`.Work/YYYY-MM-DD.md`**: 일일 작업 로그
- **`PROGRESS.md`**: 프로젝트 진행 상황 (커밋 전 업데이트 필수)
- **`AIRule.md`**: 개발 규칙 및 절차

---

## 추가 리소스

- **프로젝트 진행 상황**: `PROGRESS.md`
- **개발 규칙**: `AIRule.md`
- **코드 리뷰 결과**: `CODE_REVIEW.md`
- **가계부 기능 명세**: `banking.md`

---

## 다음 단계

1. `PROGRESS.md`를 확인하여 현재 진행 상황 파악
2. `AIRule.md`를 읽고 개발 규칙 숙지
3. 첫 빌드 및 실행 테스트
4. 작업 시작 전 `.Work/YYYY-MM-DD.md` 파일 생성

---

**마지막 업데이트**: 2025년 11월 13일  
**작성자**: AI Assistant

