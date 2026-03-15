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

## 세션 3 작업 내역 (2026-02-23)

### 🍔 3단계 워드뱅크 2열 레이아웃 (daily.html)
- 오른쪽 answer 목록이 세로로 길어 스크롤 필요 → 2열 그리드로 변경
- 너비: `130px` → `280px`
- `#wordbank-list`: `display: grid; grid-template-columns: 1fr 1fr; gap: 6px;`

---

### 🔤 전체 글씨체 Jua(주아) 폰트 적용

**적용 파일:** index.html, study.html, daily.html, sentence.html, check.html, quiz.html

```html
<link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet">
```
```css
body { font-family: 'Jua', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif; }
button, input, select, textarea { font-family: inherit; }
```

**포인트:** `<button>` 요소는 브라우저 기본값으로 시스템 폰트를 사용 → `font-family: inherit` 없으면 칩/버튼에 Jua 미적용. 모든 파일에 추가.

---

### 📏 전체 폰트 크기 증가

Python 스크립트로 전체 일괄 처리 (140곳):
- `10~17px` → `+1px`
- `18~22px` → `+2px`
- `23px+` (이모지/큰 제목) → 유지

---

### 📦 sentence.html 단어 뱅크 — 오른쪽 사이드바로 이동

**변경 전:** 상단 가로 flex-wrap 배열
**변경 후:** 오른쪽 2열 그리드 사이드바

```css
.content-wrap { flex: 1; display: flex; gap: 12px; min-height: 0; overflow: hidden; }
.word-bank-wrap { flex-shrink: 0; width: 230px; ... align-self: flex-start; position: sticky; top: 0; }
.word-bank { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
```

HTML 구조:
```
.page
  ├── screen-header
  ├── unit-title
  └── content-wrap (flex-row)
        ├── sentences-wrap (flex: 1, 스크롤)
        └── word-bank-wrap (230px, 오른쪽 고정)
```

---

## 세션 4 작업 내역 (2026-02-23)

### 🐛 플래시카드 클릭 버그 수정 (study.html)

**문제:** 카드를 여러 번 클릭해야 뒤집히는 현상
**원인:** `.fc-nav-zone` div 전체에 `onclick="event.stopPropagation()"` 적용 → 카드 중앙(단어 영역)과 nav zone이 겹쳐 클릭 이벤트 차단
**수정:** div의 stopPropagation 제거 → 개별 버튼(🔊 ← →)에 각각 추가

---

### 🔘 3단계 단어 상자 탭 인터랙션 (daily.html)

**변경 전:** 단어 목록이 표시만 되는 div (사용된 것만 취소선 표시)
**변경 후:** 탭하면 현재 포커스된 입력창에 자동 입력되는 button 상자

- `lastFocusedInput` 변수로 포커스 추적
- `mousedown` / `touchstart` preventDefault → 탭 시 입력창 포커스 유지
- 채우면 다음 빈 칸으로 자동 포커스 + 스크롤

---

### 📐 반응형 단어 상자 레이아웃 (daily.html step3, sentence.html)

| 화면 | 레이아웃 |
|------|---------|
| 폰 `max-width: 599px` | 단어 상자 **상단 고정** (sticky/flex order), 문장만 스크롤 |
| 태블릿 기본 | 오른쪽 **2열** 사이드바 |
| 세로 긴 태블릿 `min-height: 800px` | 오른쪽 **1열** 세로 나열 |

- **sentence.html**: 레이아웃 height-constrained(100dvh) → word-bank-wrap 상단 고정, sentences-wrap만 스크롤
- **daily.html**: `position: sticky; top: 0; z-index: 50` → 페이지 스크롤 시 단어 상자 상단 고착

---

### ↓ 자동 스크롤 (daily.html / sentence.html)

단어 채우면 → 다음 빈 칸/문장으로 `scrollIntoView({ behavior: 'smooth', block: 'center' })` 이동

---

### 📏 항목 높이 축소

| 파일 | 변경 내용 |
|------|---------|
| daily.html 1·2단계 | `.word-row` padding `7px` → `4px` |
| daily.html 3단계 | `.sentence-card` padding `10px` → `6px`, margin `8px` → `5px` |
| daily.html 3단계 | `.sc-no` + `.sc-sentence` 한 줄 나열 (`sc-top-row` flex row) |

---

### 🏠 index.html 모드 카드 개선

- 카드 padding `16px` → `10px` (높이 축소)
- 아이콘 + 이름 한 줄 나열: `.mc-top { display: flex; align-items: center; gap: 6px; }`
- 앱 타이틀 햄버거 버튼과 세로 정렬: `.app-header { min-height: 46px; display: flex; align-items: center; }`

---

### 🙈 sentence.html 스크롤 시 헤더 숨김

- `sentences-wrap` scroll 이벤트 → `scrollTop > 30px` 시 `.header-hidden` 클래스 toggle
- CSS `max-height: 0 + opacity: 0` transition으로 부드럽게 숨김/표시

---

## 세션 5 작업 내역 (2026-03-14)

### 📌 study.html / sentence.html 스크롤 고정 버그 수정

- `body { overflow: hidden }` 추가 → body 자체 스크롤 차단
- sentence.html: `#app { height: 100dvh }` → `height: calc(100dvh - 76px)` 수정
- sentence.html: 스크롤 시 헤더 숨김 기능 제거 (항상 고정)
- study.html: 단어 목록만 스크롤, 플래시카드+컨트롤 영역은 고정 유지

---

### 📖 study.html — 문장보기 모드 신규 추가

**버튼:** `📖 문장보기` (ctrl-bar에 추가)

**동작:**
- 단어 목록이 "번호 · 영어 · 한글 + 예문" 레이아웃으로 전환
- 예문에서 해당 단어를 파란색 밑줄(`<u>`)로 강조
- 문장 들여쓰기: 번호 너비(28px)에 맞춰 영어 단어 시작 위치와 정렬

**서브 컨트롤 (문장보기 모드 활성 시만 표시):**

| 버튼 | 기능 |
|------|------|
| 👁 단어보기/단어숨김 | 예문 내 단어를 `______` 빈칸으로 토글 |

**숨김 모드 특이사항:**
- 레이아웃 변경: `[번호] [문장(빈칸)]` 한 줄로 표시
- 읽기 버튼(🔊) 숨김
- 행 클릭 → 해당 줄만 단어 공개/숨김 토글 (연보라 배경 표시)
- 모드 전환 시 reveal 상태 초기화

**문장보기 모드 진입 시:**
- 말하기(🎤) 버튼 자동 숨김 + 마이크 OFF

---

### 🙈 study.html — 한글/영어 숨기기 모드 행 토글

**기존:** 숨기기 모드에서 행 클릭 → 플래시카드 이동
**변경:** 숨기기 모드에서 행 클릭 → 해당 행만 숨겨진 항목 공개/숨김 토글

- `rowRevealed: Set` 으로 개별 행 공개 상태 관리
- 공개된 행: 연보라 배경, 품사/읽기 버튼 표시
- 모드 전환 시 자동 초기화 (`cycleHideMode` 에서 `rowRevealed.clear()`)

---

### 🎤 말하기 버튼 표시 조건 변경

**변경 전:** 항상 표시
**변경 후:** 한글 숨기기 / 영어 숨기기 모드에서만 표시 (전체 보기·문장보기에서는 숨김)

---

### 🔀 섞기 버튼 문맥 인식

- 문장보기 모드에서 섞기 클릭 시 토스트: "🔀 문장 순서를 섞었습니다!"
- 일반 모드에서는 기존 동작 유지

---

### 🎨 폰트 변경

- Jua → **Playpen Sans** (Google Fonts)
- 적용 파일: index.html, study.html, sentence.html, daily.html, quiz.html, check.html

---

### 🦶 페이지 하단 푸터 추가

- study.html: `renderWordList()` 끝에 `· · ·` 푸터 행 동적 삽입
- sentence.html: `renderSentences()` 끝에 `· · ·` 푸터 행 동적 삽입
- daily.html / index.html: HTML `<footer>` 요소로 56px 하단 여백

---

### 🎭 세러머니 미리보기 페이지 신규 제작

**파일:** `ceremony-preview.html`

| 버튼 | 세러머니 |
|------|---------|
| 💯 100점 퍼펙트 | 따봉 군중 + 금빛 배경 |
| 🌟 90점대 | 보라 계열 + ⭐ |
| ✨ 80점대 | 파랑초록 + 💪 |
| 👍 70점대 | 청록 계열 + 🌱 |
| 💪 70점 미만 | 주황 계열 격려 |
| 🎊 문장완성 퍼펙트 | 랜덤 테마 + 이모지 폭죽 |
| 🎉 문장완성 완료 | 랜덤 테마 |

접속: `http://localhost:3000/ceremony-preview.html`

---

## 세션 6 작업 내역 (2026-03-14)

### 📦 sentence.html — 단어 목록 스크롤 지원

- `.word-bank-wrap`: `align-self: flex-start; position: sticky` → `max-height: 100%; overflow-y: auto`
- 화면 높이가 작을 때 단어 목록 영역 자체가 스크롤됨

---

### 📦 daily.html — 3단계 단어 목록 레이아웃 개선

- 2열 그리드 → **1열** 로 변경 (단어가 길어도 한 줄 표시)
- 단어 목록 컬럼 너비: `200px` → `260px`
- `.wb-item`: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` 추가 — 긴 단어 잘림 방지

---

## 세션 7 작업 내역 (2026-03-15)

### 🎭 100점 세레머니 고도화 (daily.html)

**배경 따봉 이모지 개선:**
- 15종 키프레임 전부 `translate(x, y)` 이동 추가 → 돌기만 하던 이모지가 상하좌우로 실제 이동
- 애니메이션 30종 (15 키프레임 × 2 타이밍 조합), 35개 배경 따봉에 랜덤 적용

**다양한 스킨톤 따봉:**
```js
thumbVariants: ['👍','👍🏻','👍🏼','👍🏽','👍🏾','👍🏿','👍👍','👍🏻👍🏼','👍🏽👍🏾','👍👍👍','🤙','🤜🤛','✌️','🙌','👏']
```

**클릭하면 터지는 효과:**
- 배경 따봉 클릭 → 8개 조각 파티클이 `--dx, --dy, --dr` CSS 변수로 랜덤 방향 폭발 후 사라짐
- `.dc-pop-piece` + `dc100PopPiece` 키프레임 사용

**하늘에서 날아오르는 이모지 스트림:**
- 60개 이모지 / 5초간 랜덤 위치에서 발사
- 17종 이모지 랜덤 선택, `dc100FlyUp` 키프레임으로 위로 날아가며 사라짐

**이모지 컬러 렌더링 수정:**
- `font-variant-emoji: emoji` + 이모지 폰트 스택 명시 (`'Apple Color Emoji',...`)
- nav.js 전역 CSS에도 `font-variant-emoji: emoji` 추가

---

### 🔒 ceremony-preview.html 개발 전용 접근 보호

- `?dev=1` 파라미터 없이 접속 시 → `index.html` 자동 리다이렉트
- 개발 시 URL: `ceremony-preview.html?dev=1`

---

### 🎨 study.html — 문장보기 모드 개선

- 문장보기 모드 진입 시 전체보기/한글숨기기/영어숨기기 버튼 숨김
- 말하기 버튼은 한글숨기기/영어숨기기 모드에서만 표시

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