# 📖 갓피아 성경구절 검색기 (Godpia Bible Scraper)

> [갓피아(godpia.com)](https://www.godpia.com/read/reading.asp) 사이트에서 원하는 성경 구절을 실시간으로 스크래핑하여 읽고 복사할 수 있는 모던 웹 애플리케이션입니다.

브라우저의 직접 요청 시 발생하는 **CORS(도메인 간 접근 차단) 정책 문제를 해결**하기 위해 **Cloudflare Pages Functions**를 백엔드 서버리스 프록시 API로 구현하였습니다.

---

## ✨ 주요 기능

1. **⚡ 스마트 자연어 검색**
   - 구절 직접 입력: `창세기 1:1`, `창 1:1-5`, `요한복음 3:16`, `시편 23편`, `롬 8:28`, `고전 13:4-7`, `마 5:3-10` 등 다양한 형식 자동 인식 및 파싱
   - 단일 절 및 절 범위(`1-5절`), 장 전체 읽기 지원
   - 1장으로만 구성된 성경(빌레몬서, 유다서, 요한이·삼서, 오바댜)도 완벽 지원 (`몬 1-5`)
2. **📚 책·장·절 선택 모드**
   - 구약(39권)/신약(27권) 필터 및 66권 드롭다운 선택
   - 선택된 책의 실제 장 수에 맞춰 장(Chapter) 목록 동적 생성
3. **🌐 다양한 성경 번역본 지원**
   - 개역개정4판 (기본값)
   - 개역한글
   - 새번역
   - 쉬운성경
   - 현대인의성경
   - NIV (영어 성경)
   - 히브리어(구약) / 헬라어(신약)
4. **📋 클립보드 복사 & 공유 기능**
   - 클릭 한 번으로 읽기 좋게 서식화된 구절 텍스트 복사:
     ```text
     1 태초에 하나님이 천지를 창조하시니라
     2 땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라
     
     - 창세기 1:1-2 (개역개정4판)
     ```
   - 현재 구절 공유 URL 클립보드 복사
5. **📖 편리한 리더 기능**
   - 이전 장 / 다음 장 앞뒤 탐색 버튼
   - 글자 크기 조절 (가- / 가+)
   - 다크 모드 / 라이트 모드 전환 (설정 자동 저장)
   - 인쇄 최적화 스타일(Print Stylesheet) 지원
6. **🚀 추천 칩 (Quick Chips)**
   - 자주 찾는 성경 구절(창 1:1, 요 3:16, 시 23편, 빌 4:13 등) 원클릭 즉시 조회

---

## 🏗️ 시스템 아키텍처

```
[사용자 브라우저]
       │
       ▼ (GET/POST /api/bible?query=...)
[Cloudflare Pages Functions (Edge Worker)]
       │
       ▼ (POST /read/reading_body.asp with headers)
[갓피아 서버 (godpia.com)]
       │
       ▼ (HTML 본문 수신)
[정규식 기반 텍스트 추출 & 정제]
       │
       ▼ (CORS 완화 JSON 응답)
[사용자 브라우저에 성경 구절 렌더링]
```

---

## 🚀 Cloudflare Pages 배포 방법 (초간단 3단계)

이 프로젝트는 별도의 빌드 도구 설치 없이 **정적 파일 + Pages Functions**로 구성되어 있어 1분 만에 배포할 수 있습니다.

### 1단계: Cloudflare 로그인
1. [Cloudflare 대시보드](https://dash.cloudflare.com/)에 로그인합니다.
2. 좌측 메뉴에서 **Workers & Pages** -> **Create application**을 클릭합니다.
3. **Pages** 탭을 선택하고 **Connect to Git**을 누릅니다.

### 2단계: 저장소 연결
1. GitHub 계정을 연동하고 `Seongmin3927/biblereference_godsitepia` 저장소를 선택합니다.
2. **Begin setup**을 클릭합니다.

### 3단계: 빌드 설정 및 배포
- **Project name**: 원하는 이름 입력 (예: `biblereference-godpia`)
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: (비워둠)
- **Build output directory**: (비워둠 또는 `/`)
- **Save and Deploy** 버튼 클릭!

> 💡 배포가 완료되면 `https://biblereference-godpia.pages.dev` 와 같은 무료 도메인이 발급되며 즉시 사이트가 동작합니다!

---

## 💻 로컬 개발 및 테스트

Cloudflare의 공식 CLI 도구인 `wrangler`를 사용해 로컬 환경에서도 Pages Functions를 포함하여 테스트할 수 있습니다:

```bash
# Wrangler로 로컬 개발 서버 실행
npx wrangler pages dev .

# 또는
npm run dev
```

브라우저에서 `http://localhost:8788` 로 접속하여 테스트합니다.

---

## 📡 API 명세서

### 1. 성경 구절 스크래핑 (`/api/bible`)

#### 요청 예시
- **자연어 검색**: `GET /api/bible?query=요한복음 3:16&ver=gae`
- **파라미터 직접 지정**: `GET /api/bible?vol=gen&chap=1&start=1&end=5&ver=gae`

#### 응답 예시 (JSON)
```json
{
  "success": true,
  "data": {
    "reference": "창세기 1:1-3",
    "book": {
      "code": "gen",
      "name": "창세기",
      "abbr": "창",
      "eng": "genesis",
      "testament": "OT",
      "totalChapters": 50
    },
    "chapter": 1,
    "startVerse": 1,
    "endVerse": 3,
    "version": {
      "code": "gae",
      "name": "개역개정4판"
    },
    "totalVersesInChapter": 31,
    "verses": [
      {
        "verse": 1,
        "text": "태초에 하나님이 천지를 창조하시니라"
      },
      {
        "verse": 2,
        "text": "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라"
      },
      {
        "verse": 3,
        "text": "하나님이 이르시되 빛이 있으라 하시니 빛이 있었고"
      }
    ]
  }
}
```

### 2. 성경 메타데이터 (`/api/meta`)
- **GET `/api/meta`**
- 성경 66권 전체 목록, 약어, 코드, 각 권의 장 수 및 지원 번역본 목록을 반환합니다.

---

## 📄 저작권 및 안내
- 본 프로젝트는 개인 학습 및 성경 묵상 목적으로 제작되었습니다.
- 성경 텍스트의 모든 저작권은 해당 번역본의 저작권자 및 [갓피아(godpia.com)](https://www.godpia.com/)에 있습니다.
