# 찬희 영어 단어장 — 개발 내역

## 프로젝트 개요
- 아이패드 Apple Pencil 최적화 영어 단어 학습 앱
- Vanilla HTML/CSS/JS (프레임워크 없음)
- Python HTTP 서버로 로컬 실행 가능

---

## 완료된 개발 내역

### 🎉 세레머니 시스템 (quiz.html / study.html)
점수 구간별 다른 세레머니 연출

| 티어 | 조건 | 이모지 | 파티클 수 |
|------|------|--------|----------|
| 100점 | 한 번도 안 틀림 | 쌍따봉 👍👍 | 65개 |
| 90점대 | 90~99점 | 🏆 회전 | 38개 |
| 80점대 | 80~89점 | 👏 회전 | 22개 |
| 80점 미만 | ~79점 | 💪 격려 | 16개 |

### ⭐ 틀린 단어 별표 추적 (quiz.html / study.html / daily.html)
- localStorage 저장: `star_${courseId}_${typeId}_${unitId}`
- 틀리는 즉시 저장 (하다가 나가도 기록 유지)
- study.html 단어 목록에 ★★★ 배지 표시
- 초기화는 추후 엄마 모드에서 처리 예정

### 📝 데일리 테스트 (daily.html) — 신규 제작
3단계 최종 테스트

| 단계 | 내용 | 채점 기준 |
|------|------|----------|
| 1단계 | 한글 → 영어 쓰기 | `w.english` (대소문자 구분) |
| 2단계 | 영어 → 한글 쓰기 | `w.korean` (콤마 복수정답, ~·띄어쓰기 무시) |
| 3단계 | 문장 빈칸 채우기 | `w.answer` (대소문자 구분) |

**최종 결과 화면**
- 단계별 오답 리스트 표시
- 단계 서머리: 1·2·3단계 각각 몇 개 틀렸는지
- 5번 쓰기 섹션
  - 1·2단계 오답 단어: 영어 | 한글 한 줄에 나란히 5번
  - 3단계 오답 문장: 완성 문장 통째로 5번
- 복사/붙여넣기 완전 차단
- 엄마 확인 버튼: 5번 쓰기 일괄 채점

### 🎯 문장 완성 (sentence.html)
- 단어 목록 및 빈칸 답 기준: `w.english` → `w.answer` 로 변경
- 드래그 타겟: 빈칸 밑줄 → **문장 전체 네모 영역**으로 확대
- 오답 시 row 전체 빨간 플래시 + 흔들기 (아이패드에서 잘 보이도록)

### 🏠 메인 (index.html)
- 빈칸 퀴즈 모드 제거
- Daily Test 추가 (노란 테두리 강조)
- 배치 변경: 플래시카드 | 문장완성 / Daily Test | 인쇄
- `/api/done` 없는 환경(python 서버)에서도 정상 동작

### 🔊 음성 속도 (study.html)
- `rate: 0.85` → `rate: 0.7` (아이패드에서 너무 빠르다는 피드백 반영)

---

## 세션 2 작업 내역 (2026-02-23)

### 🍔 공통 햄버거 메뉴 — nav.js 신규 제작

**배경:** 각 페이지마다 중복된 햄버거 메뉴 코드가 있었음 → 공통 컴포넌트로 통합

**nav.js IIFE 구조:**
- CSS, HTML(버튼 + 드로어)을 자동으로 `<head>` / `<body>`에 삽입
- Public API: `initNav(page, opts)`, `setNavUnit(...)`, `navOpen()`, `navClose()`, `navGo(mode)`
- 스크립트 로딩 순서: `<script src="nav.js">` 뒤에 별도 `<script>`로 `initNav()` 호출해야 함 (ReferenceError 방지)

**메뉴 구성:**
| 항목 | 표시 조건 |
|------|----------|
| 🏠 처음으로 | index.html 제외 전 페이지 |
| 🃏 플래시카드 | 항상 |
| 🧩 문장 완성 | 항상 |
| 📝 Daily Test | 항상 |
| 📷 정답 채점 | 항상 |
| 🖨️ 인쇄 | index.html 에서만 |

**적용 파일:** index.html, study.html, sentence.html, daily.html, check.html
- 각 페이지의 hb-* CSS, 햄버거 HTML, hbOpen/hbClose/hbGo 함수 전부 제거

---

### 🎭 daily.html — 세레머니 고도화

**점수 구간별 4단계 티어:**
| 티어 | 조건 | 배경 | 중앙 이모지 |
|------|------|------|------------|
| 100점 | 완벽 | 금색+빨강 그라데이션 | 👍 스피닝 |
| 90점대 | 90%+ | 보라 계열 | ⭐ |
| 80점대 | 80%+ | 파랑+초록 | 👏 |
| 그 이하 | ~79% | 주황 계열 | 💪 |

**애니메이션 개선:**
- 따봉 회전 속도 느리게: `dcSpin 0.9s → 1.8s`, `dcCheer 0.38s → 1.0s`
- 배경에 따봉 15개 랜덤 배치 (`dc-bg-thumb`, `dcBgFloat` 애니메이션)

**흐름 개선:**
- 세레머니 5초 → 최종 화면(엄마 확인) 자동 전환
- 100점이어도 엄마 확인 메세지 표시 (이전: 100점 시 생략)

---

### 🎉 quiz.html — 세레머니 5초 자동 닫기
- `triggerCelebration()` 마지막에 `setTimeout(hideCelebration, 5000)` 추가

---

### 🏠 index.html UI 정리

**제거:**
- `.app-sub` 부제목 텍스트 ("과정 → 유형 → 단원 → 모드 선택 후 시작")
- 모드 카드 `.mc-desc` 설명 문구 4개 → 이후 **다시 복원** (유저 피드백: "너무 허전하다")

**복원된 설명 문구:**
| 모드 | 설명 |
|------|------|
| 🃏 플래시카드 | 단어 암기 |
| 🧩 문장 완성 | 드래그 빈칸 채우기 |
| 📝 Daily Test | 3단계 최종 테스트 |
| 🖨️ 인쇄 | A4 워크시트 |

---

### 🚫 fill=1 자동 채우기 기능 완전 제거

모든 파일에서 `?fill=1` URL 파라미터 관련 코드 제거:

| 파일 | 제거 내용 |
|------|----------|
| nav.js | daily/sentence 이동 URL의 `&fill=1` 제거 |
| daily.html | step1/2/3 자동 채우기 3곳 제거 |
| sentence.html | `sentences.forEach(s => s.filled = true)` 블록 제거 |
| quiz.html | 퀴즈 시작·카드 렌더 시 자동 채우기 코드 2곳 제거 |

---

### ⭐ study.html — 별표(★★★) 표시 개선

**변경 전:** 번호 뒤에 별 → 영어 단어 앞에 위치, 항상 표시
**변경 후:**
- 위치: 영어 단어 바로 뒤 (`free ★★★`) — `swr-en-wrap` 래퍼로 묶음
- 표시 조건: **전체 보기 모드에서만** 표시 (한글/영어 숨기기 모드에서는 숨김)

**CSS 변경:**
```css
/* 추가 */
.swr-en-wrap { flex: 1; display: flex; align-items: center; gap: 5px; min-width: 0; }
/* 수정: flex:1 제거 */
.swr-en { font-weight: 700; font-size: 15px; }
```

---

## 🚧 남은 작업

### 즉시 처리 필요
- [x] **fill=1 자동 채우기 완전 제거** (세션 2에서 완료)

### 배포
- [ ] **서버 배포**
  - 현재: `python3 -m http.server 8080` 로컬 실행
  - 완료 표시(✅) 기능은 Node.js 서버 필요 (`server.js`)
  - 배포 환경 결정 필요 (Vercel / GitHub Pages / 자체 서버 등)

### 엄마 모드
- [ ] **★★★ 별표 초기화** — 단원별 오답 기록 리셋
- [ ] **완료 기록 관리** — 단원 완료 표시 편집
- [ ] **학습 기록 보기** — 날짜별 틀린 단어 이력
- [ ] **접근 방법** — 메인에서 특정 동작(예: 로고 5회 탭)으로 진입

### 사진 채점 (check.html) — 보류
- 현재: 정답 카드 수동 모드 구현 완료 (API 불필요)
- AI 자동 채점: Claude API 사용 시 월 ~100원 수준
- API 키 발급 후 연결 예정 (console.anthropic.com)

### 이미지 → 단어 자동 등록 (주요 신규 기능)
- [ ] **단어장 이미지 캡처 업로드**
  - 교과서/프린트 단어 리스트 사진 찍어서 업로드
  - Claude Vision API (또는 GPT-4o)로 OCR + 구조 파싱
  - 파싱 결과: `english`, `korean`, `sentence`, `answer` JSON 자동 생성
  - 엄마 또는 보호자가 확인 후 저장하는 검토 단계 추가
  - 저장 시 새 단원 JSON 파일로 자동 추가

### 기타 보완
- [ ] **서버 저장** — localStorage → 서버 DB 저장 (어디서든 같은 상태)
- [ ] **daily.html 엄마 확인 후 다음 단계** — 완료 시 처음으로 버튼 외에 추가 동작
- [ ] **오프라인 지원** — Service Worker로 인터넷 없이도 동작

---

## 파일 구조

```
my_english/
├── index.html          # 메인 (과정/단원/모드 선택)
├── study.html          # 플래시카드 (음성 자동 재생, 별표 추적)
├── quiz.html           # 빈칸 퀴즈 (현재 메인에서 미노출)
├── sentence.html       # 문장 완성 (드래그 앤 드롭)
├── daily.html          # 데일리 테스트 (3단계 + 5번 쓰기 + 세레머니)
├── check.html          # 정답 채점 (수기 답안 사진 채점)
├── nav.js              # 공통 햄버거 메뉴 컴포넌트 (세션 2 신규)
├── DEV_LOG.md          # 이 파일
└── data/
    └── {courseId}/
        └── {typeId}/
            ├── index.json   # 과정·유형·단원 목록
            └── {unitId}.json
```

### 단어 JSON 구조
```json
{
  "words": [
    {
      "english": "take off",
      "korean": "벗다, 이륙하다",
      "pos": "동사",
      "sentence": "I ___ my jacket before entering.",
      "answer": "took off"
    }
  ]
}
```

---

## 로컬 실행 방법

```bash
cd /Users/sunjo/IdeaProjects/viver_new/my_english
python3 -m http.server 8080
```

아이패드에서: `http://192.168.45.94:8080`