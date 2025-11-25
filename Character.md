🧍‍♀️ DietMate 캐릭터 시스템 설계서
📌 개요

DietMate는 사용자의 기록 습관 형성과 체계적 관리 경험을 돕는 다이어트 메이트 앱이다.
본 문서는 캐릭터의 “성장, 상태, 경험치, 시각화” 기능을 로컬 환경에서 구현하기 위한 구조와 정책을 정의한다.

🧩 목표

사용자가 기록과 루틴 실천을 할 때마다 캐릭터가 성장하도록 설계

체중감량 과정과 캐릭터의 진화를 시각적 피드백으로 제공

서버 없이 로컬스토리지(AsyncStorage) 만으로 상태 저장 및 관리

캐릭터의 상태를 기반으로 앱 내 동기부여 메시지, UI 변화, 애니메이션과 연동

🧠 캐릭터 개념

캐릭터는 사용자의 “의지”를 시각화한 자기화 버전 메이트(Avatar)

직접 꾸미거나 성장시킬 수 있으며, 체력·의지·컨디션 수치가 실제 루틴 달성률과 연결됨

캐릭터 성장 = 사용자 루틴의 시각적 보상

⚙️ 데이터 구조 (로컬 저장용)
{
  "character": {
    "name": "Jisu",
    "level": 8,
    "exp": 350,
    "expToNext": 500,
    "hp": 78,
    "will": 60,
    "condition": 85,
    "streak": 5,
    "titles": ["꾸준러 Lv3"],
    "skins": ["default", "trainer_mint"],
    "lastActionAt": "2025-11-13T07:00:00Z"
  }
}


저장 위치: AsyncStorage 키 → "dietmate_character"

초기값은 앱 첫 실행 시 자동 생성

상태 변경 시점: 식단 기록 / 운동 완료 / 수분 기록 / 수면 기록 등 루틴 액션 후

🧮 경험치 및 상태 계산
경험치(EXP)
액션	EXP	보너스
식단 기록 (도시락/식사)	+15	연속 3일 +10
운동 완료 (헬스/홈트)	+20	연속 5일 +20
수분 2L 달성	+5	-
수면 7시간 이상	+10	-
야식 참기	+8	-
루틴 7일 연속	+100	스킨 해금

일일 EXP 최대치: 250
레벨업 공식:

expToNext = 100 * (level ^ 1.15)

상태 변화
상태	조건	변화
HP(체력)	운동/수면으로 회복	운동 스킵 시 -10
WILL(의지)	루틴 유지 시 +5	식단 미기록 시 -5
CONDITION(컨디션)	수면 및 수분 달성 시 +10	3일 미달성 시 -10
🧰 주요 함수 (React Native)
characterStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dietmate_character';

export const getCharacter = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initCharacter();
};

export const saveCharacter = async (character) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(character));
};

export const addExp = async (amount) => {
  const char = await getCharacter();
  const expToNext = Math.round(100 * Math.pow(char.level, 1.15));
  char.exp += amount;

  while (char.exp >= expToNext) {
    char.exp -= expToNext;
    char.level += 1;
    // 레벨업 보상
    char.hp = Math.min(100, char.hp + 10);
    char.will = Math.min(100, char.will + 10);
  }

  await saveCharacter(char);
  return char;
};

function initCharacter() {
  const base = {
    name: 'Me',
    level: 1,
    exp: 0,
    expToNext: 100,
    hp: 70,
    will: 50,
    condition: 70,
    streak: 0,
    titles: [],
    skins: ['default'],
  };
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(base));
  return base;
}

🎮 캐릭터 레벨 구간 및 시각 변화
레벨 범위	시각적 변화	설명
Lv 1–10	기본 포즈 / 귀여운 이미지	초반 적응기
Lv 11–20	자세 교정, 표정 밝아짐	꾸준함 시작
Lv 21–35	슬림해진 라인, 운동복 착용	체형 변화 시각화
Lv 36–50	드레스핏 완성, 아우라 효과	목표 달성 상징

아바타 이미지는 PNG/SVG 프레임으로 관리, 레벨 구간에 따라 자동 교체.

🪞 캐릭터와 루틴의 연동 구조
사용자 액션	내부 처리	캐릭터 반응
식단 기록	addExp(15)	“도시락 준비했네! 꾸준함 +1🔥”
운동 완료	addExp(20) + HP +3	“좋아, 어깨라인 더 살아났다💪”
수면 부족	HP -5	“오늘은 조금 피곤해 보여 💤”
루틴 연속 7일	+100 EXP + 스킨 해금	“완벽해! 새 스킨이 열렸어🎁”
🎨 UI 제안

홈 화면 캐릭터 카드

원형 캐릭터 썸네일 + XP 링 게이지

하단: Lv.8 / EXP 350 / 500

EXP 증가 시 Lottie 폭죽 + 진동 효과

상태 바 (HP / WILL / CONDITION)

HP: ❤️ WILL: ⚡ CONDITION: 🌿

3색 게이지바로 직관적 표시

레벨업 시

전체 화면 애니메이션 (fade-in/out)

문구: "Lv.9 달성! 꾸준한 하루의 보상 🎉"

🔮 향후 확장 계획

 의상/스킨 교체 UI

 캐릭터 대화 엔진 (멘트 자동 생성)

 도전 모드(퀘스트 시스템)

 감정/컨디션 기반 추천 운동 연동

 캐릭터 애니메이션 Lottie 교체 시스템

🗂️ 파일 구조 (예시)
/src
 ├── stores/
 │   └── characterStore.js
 ├── components/
 │   ├── CharacterCard.jsx
 │   └── CharacterStatusBar.jsx
 ├── services/
 │   └── expService.js
 ├── assets/
 │   ├── avatars/
 │   │   ├── lv1_basic.png
 │   │   ├── lv2_slim.png
 │   │   └── lv3_dressfit.png
 │   └── animations/
 │       └── levelup.json
 └── screens/
     └── CharacterScreen.jsx

✅ 요약

캐릭터는 사용자의 루틴 실천율을 반영한 “성장의 시각화 시스템”

모든 데이터는 AsyncStorage 기반 로컬 관리

EXP와 레벨은 앱 내 루틴 수행과 직결

시각적 피드백과 보상 구조로 사용자의 습관 형성 동기 강화


**캐릭터 설정**
캐릭터 기획 – "디메(DiMe)"

디메(DiMe)는 DietMate의 감정형 AI 트레이너이자 친구 같은 존재로, 사용자의 다이어트 여정을 함께 성장하는 “루틴 파트너” 캐릭터입니다. 디메는 체중·운동·식단 기록에 따라 레벨과 체력, 기분이 변화하며, 사용자의 노력에 반응합니다. 예를 들어 꾸준히 기록하면 활기차고 자신감 넘치는 모습으로, 반대로 며칠간 기록을 쉬면 졸리거나 축 처진 표정으로 변합니다.
비주얼은 부드러운 둥근 실루엣의 피트니스 마스코트, 중성적이고 따뜻한 톤으로 표현되며, “디지털 + 메이트”라는 이름처럼 감정 인식과 응원 기능을 겸비한 캐릭터입니다.
디메는 단순한 꾸밈 요소가 아니라, 사용자의 감정과 루틴 데이터를 반영해 습관 형성의 감정적 동반자로 작동합니다 — “함께 성장하는 다이어트 친구”라는 콘셉트로, 기록과 피드백 경험을 감성적으로 연결하는 역할을 합니다.