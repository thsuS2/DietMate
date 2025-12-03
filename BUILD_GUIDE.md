# 🔨 DietMate 빌드 가이드

> Android 앱을 빌드하고 실행하기 위한 상세 가이드입니다.

---

## 📋 사전 요구사항

### 1. 개발 환경 확인
```bash
# Node.js 버전 확인
node --version  # v18 이상 필요

# npm 버전 확인
npm --version  # v11.4.2 이상 필요

# React Native CLI 확인
npx react-native --version
```

### 2. Android 개발 환경
- **Android Studio**: 최신 버전 설치
- **Android SDK**: API 35 (Android 15)
- **JDK**: 17 이상
- **Android NDK**: 자동 설치됨

### 3. 환경 변수 설정
`~/.zshrc` 또는 `~/.bash_profile`에 추가:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

---

## 🚀 빌드 및 실행 절차

### Step 1: 프로젝트 디렉토리로 이동
```bash
cd /Users/jisoo/Soo/DietMate
```

### Step 2: 의존성 확인
```bash
# node_modules가 설치되어 있는지 확인
ls node_modules

# 없으면 설치
npm install
```

### Step 3: Android 에뮬레이터 준비

#### 3.1 에뮬레이터 확인
```bash
# 연결된 디바이스 확인
adb devices

# 예상 출력:
# List of devices attached
# emulator-5554	device
```

#### 3.2 에뮬레이터 실행 (없는 경우)
1. Android Studio 실행
2. **Tools** → **Device Manager**
3. `Pixel_9_Pro_XL_2 (API 35)` 에뮬레이터 선택
4. **▶️ Play** 버튼 클릭

**⚠️ 중요**: 다른 에뮬레이터(`Pixel_7_api_34` 등)가 실행 중이면 **반드시 종료**하세요!

### Step 4: Metro 번들러 실행

**터미널 1**에서:
```bash
cd /Users/jisoo/Soo/DietMate
npm start -- --port 8082
```

**성공 시 출력**:
```
                 ######                ######               
               ###     ####        ####     ###             
             ##           ###    ###           ##           
            ##               ####               ##          
          ##                                   ##           
         ##                                     ##          
        ##                                       ##         
       ##                                         ##        
      ##                                           ##       
     ##                                             ##      
    ##                                               ##     
   ##                                                 ##    
  ##                                                   ##   
 ##                                                     ##  
##                                                       ##
                                                          
                  Welcome to Metro!
                  
 Metro is running on port 8082
```

### Step 5: Android 앱 빌드 및 실행

**터미널 2**에서:
```bash
cd /Users/jisoo/Soo/DietMate
npx react-native run-android --device=emulator-5554 --port 8082
```

**⚠️ 중요**: 
- `--device=emulator-5554` 플래그를 **반드시** 사용
- `--port 8082` 플래그로 Metro 번들러 포트 지정

**빌드 성공 시**:
```
BUILD SUCCESSFUL in 2m 30s
...
Installed on 1 device.
```

**✅ 확인**: "Installed on 1 device"가 보여야 합니다. "Installed on 2 devices"가 나오면 문제입니다!

---

## 🔍 빌드 문제 해결

### 문제 1: "No devices found"
**원인**: 에뮬레이터가 실행되지 않음

**해결**:
```bash
# 에뮬레이터 목록 확인
adb devices

# 에뮬레이터가 없으면 Android Studio에서 실행
```

### 문제 2: "Installed on 2 devices"
**원인**: 여러 에뮬레이터가 동시에 실행 중

**해결**:
1. 다른 에뮬레이터 종료
2. `adb devices`로 하나만 남았는지 확인
3. 다시 빌드

### 문제 3: Metro 번들러 연결 실패
**원인**: 포트 충돌 또는 Metro 번들러 미실행

**해결**:
```bash
# 포트 8082 확인
lsof -ti:8082

# 사용 중이면 종료
lsof -ti:8082 | xargs kill -9

# Metro 번들러 재시작
npm start -- --port 8082 --reset-cache
```

### 문제 4: NDK 버전 불일치
**원인**: Android NDK 버전 충돌

**해결**:
```bash
# android/local.properties 삭제
rm android/local.properties

# Android Studio가 자동으로 올바른 NDK 다운로드
# 다시 빌드
```

### 문제 5: Gradle 빌드 실패
**원인**: 캐시 문제 또는 의존성 문제

**해결**:
```bash
# Android 빌드 캐시 정리
cd android
./gradlew clean
cd ..

# node_modules 재설치
rm -rf node_modules
npm install

# 다시 빌드
```

### 문제 6: "Unable to resolve module"
**원인**: 의존성 미설치 또는 Metro 캐시 문제

**해결**:
```bash
# node_modules 재설치
rm -rf node_modules
npm install

# Metro 캐시 초기화
npm start -- --reset-cache
```

---

## 📱 앱 실행 확인

### 1. 앱이 정상적으로 실행되는지 확인
- 스플래시 화면 표시
- 홈 화면 로드
- 하단 탭 네비게이션 표시

### 2. 각 탭 확인
- **홈**: 대시보드 표시
- **기록**: 6개 서브탭 표시
- **통계**: 주간 차트 표시
- **가계부**: 거래 목록 표시
- **설정**: 설정 항목 표시

### 3. 기본 기능 테스트
- 기록 추가/저장
- 데이터 표시
- 화면 전환

---

## 🔄 빠른 재빌드

이미 한 번 빌드한 경우:

```bash
# Metro 번들러만 재시작 (터미널 1)
npm start -- --port 8082

# 앱만 재빌드 (터미널 2)
npx react-native run-android --device=emulator-5554 --port 8082
```

또는 앱에서 **R키 2번** 또는 **흔들기 → Reload**로 빠르게 새로고침 가능

---

## 🛠️ 개발 모드 vs 프로덕션 빌드

### 개발 모드 (현재)
- Metro 번들러 필요
- Hot Reload 지원
- 디버깅 가능
- 느린 시작 속도

### 프로덕션 빌드 (배포용)
```bash
cd android
./gradlew assembleRelease
```
- APK 파일 생성: `android/app/build/outputs/apk/release/app-release.apk`
- Metro 번들러 불필요
- 빠른 시작 속도
- 디버깅 불가

---

## 📊 빌드 시간 참고

- **첫 빌드**: 3-5분 (의존성 다운로드 포함)
- **증분 빌드**: 30초-2분
- **Hot Reload**: 즉시 (1-2초)

---

## ✅ 빌드 체크리스트

빌드 전:
- [ ] 에뮬레이터가 실행 중인가? (`adb devices`)
- [ ] 하나의 에뮬레이터만 실행 중인가?
- [ ] Metro 번들러가 실행 중인가? (포트 8082)
- [ ] `node_modules`가 설치되어 있는가?

빌드 중:
- [ ] 빌드 로그에서 에러가 없는가?
- [ ] "BUILD SUCCESSFUL" 메시지가 나오는가?
- [ ] "Installed on 1 device"가 표시되는가?

빌드 후:
- [ ] 앱이 정상적으로 실행되는가?
- [ ] 모든 탭이 표시되는가?
- [ ] 기본 기능이 작동하는가?

---

## 🆘 추가 도움말

### 로그 확인
```bash
# Android 로그 실시간 확인
adb logcat

# React Native 로그만 확인
npx react-native log-android
```

### 앱 재설치
```bash
# 앱 제거 후 재설치
adb uninstall com.dietmate
npx react-native run-android --device=emulator-5554 --port 8082
```

### 완전 초기화
```bash
# 모든 캐시 및 빌드 파일 삭제
rm -rf node_modules
rm -rf android/app/build
rm -rf android/build
rm android/local.properties
npm install
cd android && ./gradlew clean && cd ..
```

---

**마지막 업데이트**: 2025년 11월 13일  
**작성자**: AI Assistant

