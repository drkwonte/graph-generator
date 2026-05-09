# PRD — SnapGraph v1.1

**슬로건:** 수식을 찍으면, 그래프가 된다.

---

## Product Vision

수학 수식 입력법을 몰라도, 교과서나 시험지를 사진으로 찍으면 AI가 수식을 자동 인식하여
인터랙티브 그래프를 즉시 그려주는 웹 서비스입니다. 입력의 장벽을 제거하는 것이 최우선
가치이며, 이미지 인식이 주요 진입 경로이고 수학 키보드가 보조 수단입니다.

---

## 시장 분석 요약

### 기존 경쟁자

- **순수 그래핑 도구**: Desmos, GeoGebra — 공학용 계산기 스타일 입력, 이미지 업로드 없음
- **AI 수학 풀이 앱**: Photomath, MathGPT, Microsoft Math Solver — 사진 인식은 되지만
  인터랙티브 그래프 연결 기능 부재

### 시장 공백 (Gap)

"사진으로 수식을 찍으면 → 인터랙티브 그래프가 바로 그려지는" 독립형 웹앱은 현재 존재하지 않음.

### 경쟁력 판단: ✅ 충분히 있음

기존 그래프 도구들이 해결하지 못한 "수식 입력의 진입 장벽"을 AI 이미지 인식으로 완전히
제거하는 것이 핵심 차별점.

---

## Target Users

- 중·고등학생 및 대학 저학년: 교과서나 문제지의 수식을 빠르게 시각화하고 싶은 학습자
- 공학용 계산기 사용법을 모르는 일반인
- 학생에게 수식 그래프를 쉽게 보여주고 싶은 교사

---

## 기술 스택

| 역할          | 기술                                             |
| ------------- | ------------------------------------------------ |
| 프레임워크    | React 18 + TypeScript + Vite                     |
| 스타일링      | Tailwind CSS                                     |
| 그래프 렌더링 | function-plot (MIT 라이선스, 상업적 이용 무제한) |
| 수식 표시     | KaTeX (react-katex)                              |
| 수학 키보드   | @karyum/react-math-keyboard                      |
| 이미지 압축   | Canvas API (브라우저 내장, 추가 비용 없음)       |
| AI 모델       | Gemini 2.5 Flash (gemini-2.5-flash)              |
| API 키 보호   | Cloudflare Pages Functions                       |
| 배포          | Cloudflare Pages                                 |

### 그래프 렌더링 라이브러리 선택 근거: function-plot 채택

Desmos API는 상업적 사용(AdSense 포함 프로덕션 서비스) 시 유료 Commercial Tier 계약이
필요하므로 제외. function-plot은 MIT 라이선스로 AdSense 수익화에 법적 제약 없음.

| 항목               | Desmos API                   | function-plot        |
| ------------------ | ---------------------------- | -------------------- |
| 라이선스           | 상업적 사용 시 유료          | MIT (무료, 상업 OK)  |
| AdSense 운영       | ❌ Commercial Tier 계약 필요 | ✅ 제한 없음         |
| 인터랙티브 줌/패닝 | ✅                           | ✅                   |
| 다중 함수          | ✅                           | ✅                   |
| UI 완성도          | ⭐⭐⭐⭐⭐                   | ⭐⭐⭐ (커스텀 필요) |

### AI 모델 선택 근거: gemini-2.5-flash 채택

| 모델                  | 이미지 입력 비용  | 출력 비용          | 무료 티어 | 비고                                    |
| --------------------- | ----------------- | ------------------ | --------- | --------------------------------------- |
| gemini-2.5-flash      | $0.30 / 1M tokens | $2.50 / 1M tokens  | ✅        | 이미지 지원, 추론 기능 포함, 권장       |
| gemini-2.5-flash-lite | $0.10 / 1M tokens | $0.40 / 1M tokens  | ✅        | 수식 인식 정확도 불안정, 미채택         |
| gemini-2.5-pro        | $1.25 / 1M tokens | $10.00 / 1M tokens | ✅        | 고성능이나 비용 대비 오버스펙           |
| grok-2-vision         | $2.00 / 1M tokens | $10.00 / 1M tokens | ❌        | Gemini 대비 6.7배 비싸고 무료 티어 없음 |

### Gemini 단독 그래프 생성 미채택 근거

Gemini Code Execution으로 Matplotlib 그래프 생성은 기술적으로 가능하나 아래 이유로 미채택:

- 정적 PNG만 반환 → 줌/패닝/호버 등 인터랙티브 불가
- 토큰 사용량 3~5배 증가 (코드 생성 + 실행 + 결과 모두 토큰 청구)
- 코드 실행 대기 시간으로 응답 속도 저하 (최대 30초)

→ Gemini = 수식 추출 전담, function-plot = 렌더링 전담으로 역할 분리가 최적.

---

## 프로젝트 구조

    /
    ├── src/
    │   ├── components/
    │   │   ├── ImageUploader.tsx         # 업로드 + 손글씨 경고 문구
    │   │   ├── FormulaConfirmation.tsx   # KaTeX 수식 확인 + 재인식 버튼
    │   │   ├── GraphRenderer.tsx         # function-plot 렌더링
    │   │   ├── MathKeyboardInput.tsx     # @karyum/react-math-keyboard
    │   │   └── AdSenseUnit.tsx           # 광고 유닛
    │   ├── hooks/
    │   │   ├── useImageCompressor.ts     # Canvas API 압축 로직
    │   │   └── useGeminiAnalysis.ts      # Gemini API 호출
    │   └── App.tsx
    ├── functions/
    │   └── api/
    │       └── analyze.ts                # Cloudflare Pages Function (API 키 보호)
    └── public/

---

## 핵심 기능 (MVP — Phase 1)

### 기능 1. 이미지 업로드 & 클라이언트 사이드 압축

사용자가 카메라 촬영 또는 파일 첨부로 이미지를 업로드합니다.
Gemini API 호출 전 브라우저의 Canvas API로 클라이언트 사이드 압축을 수행합니다.

- 최대 파일 크기: 1MB
- 1MB 초과 시 Canvas drawImage() + toBlob() 방식으로 자동 압축
- 외부 API 불필요 — 순수 브라우저 내장 기능만 사용, 추가 비용 없음
- 비율 유지하며 최대 1920px로 리사이즈 후 JPEG 품질 조정

손글씨 경고 문구 (이미지 업로드 영역 하단에 항상 표시):
손글씨 수식은 인식이 부정확할 수 있습니다.
가능하면 인쇄물의 이미지를 사용해 주세요.

압축 로직 (hooks/useImageCompressor.ts):

    async function compressImage(file: File, maxSizeKB = 1024): Promise<Blob> {
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');

      const MAX_DIM = 1920;
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.9;
      let blob: Blob;
      do {
        blob = await new Promise(res => canvas.toBlob(res as any, 'image/jpeg', quality));
        quality -= 0.1;
      } while (blob.size > maxSizeKB * 1024 && quality > 0.1);

      return blob;
    }

### 기능 2. AI 수식 인식 (Gemini 2.5 Flash)

이미지를 Cloudflare Pages Function을 통해 서버리스로 Gemini API에 전달합니다.
API 키는 Cloudflare Pages Function 환경 변수에서만 관리하며 클라이언트에 노출되지 않습니다.

Gemini 시스템 프롬프트 (functions/api/analyze.ts):

    const SYSTEM_PROMPT = `
    You are a precise mathematical expression extractor.
    Analyze the provided image and extract ALL mathematical formulas,
    equations, and functions that can be plotted on a 2D Cartesian graph.

    Return ONLY a valid JSON object:
    (Example)
    {
      "formulas": [
        {
          "latex": "y = x^2 + 2x - 1",
          "displayLatex": "y = x^2 + 2x - 1",
          "functionNotation": "x^2 + 2*x - 1",
          "isGraphable": true,
          "type": "quadratic"
        }
      ],
      "confidence": 0.95,
      "warning": null
    }

    Rules:
    - latex: standard LaTeX notation for display
    - functionNotation: simplified expression for function-plot (use * for multiplication)
    - isGraphable: true only for functions plottable on xy-plane
    - If handwriting is detected, set warning: "handwriting_detected"
    - Return empty formulas array if no graphable formulas found
    `;

### 기능 3. 수식 확인 & 재인식 UI

그래프를 바로 그리지 않고, 인식된 수식 목록을 KaTeX로 렌더링하여 확인 화면을 먼저 표시합니다.
이미지 안에 그래프로 표현할 수 있는 수식이 있으면 모두 찾아서 사용자에게 목록을 보여준다.
사용자가 선택한 수식만을 그래프로 그린다.

- 수식이 올바른지 시각적으로 확인 후 "그래프 그리기" 버튼으로 진행
- 수식이 잘못 인식된 경우 "🔄 다시 인식하기" 버튼으로 동일 이미지 재분석
- 수식 텍스트 직접 편집 필드는 제공하지 않음 (재인식 또는 수학 키보드로 대체)

FormulaConfirmation 컴포넌트 (components/FormulaConfirmation.tsx):

    import { BlockMath } from 'react-katex';
    import 'katex/dist/katex.min.css';

    const FormulaConfirmation = ({ formulas, onConfirm, onRetry }) => (
      <div className="formula-confirmation">
        <h3>인식된 수식을 확인해 주세요</h3>
        {formulas.map((f, i) => (
          <div key={i} className="formula-item">
            <BlockMath math={f.displayLatex} />
          </div>
        ))}
        <button onClick={onRetry}>🔄 다시 인식하기</button>
        <button onClick={onConfirm} className="primary">📈 그래프 그리기</button>
      </div>
    );

### 기능 4. 인터랙티브 그래프 렌더링 (function-plot)

확인 단계를 통과한 수식을 function-plot 라이브러리로 렌더링합니다.

- 마우스 휠 줌, 드래그 패닝
- 호버 시 좌표 값 표시
- 여러 수식 동시 표시, 각 수식별 색상 구분
- x축, y축, 점근선(존재하는 경우에만)은 반드시 표시한다.

GraphRenderer 컴포넌트 (components/GraphRenderer.tsx):

    import functionPlot from 'function-plot';

    functionPlot({
      target: '#graph',
      width: 600,
      height: 400,
      grid: true,
      data: formulas.map((f, i) => ({
        fn: f.functionNotation,
        color: COLORS[i % COLORS.length],
      }))
    });

### 기능 5. 수학 키보드 입력 (보조 수단)

이미지 없이 수식을 입력하고 싶은 사용자를 위해 @karyum/react-math-keyboard를 활용한
수학 키보드 입력 패널을 제공합니다.
이미지에서 추출한 수식을 수정하고 싶을 때도 사용한다.

- 분수, 지수, 루트, sin/cos/tan, 로그, 그리스 문자 등 버튼 제공
- 내부적으로 LaTeX 생성
- 입력된 수식은 KaTeX로 실시간 미리보기
- "그래프 그리기" 버튼으로 function-plot에 전달

### 기능 6. 그래프 저장 및 공유

- 그래프 PNG 다운로드
- 수식 파라미터를 URL 쿼리스트링에 인코딩하여 공유 링크 생성
- 백엔드 없이 순수 클라이언트 사이드로 동작

---

## 사용자 플로우

    [이미지 업로드]
          │
          ▼
    [Canvas API 압축] ──→ 1MB 이하로 자동 압축
          │
          ▼
    [Cloudflare Pages Function] ──→ Gemini 2.5 Flash API 호출
          │
          ▼
    [KaTeX 수식 확인 화면]
          │
          ├── 수식 오류 ──→ [🔄 다시 인식하기] ──→ 재분석
          │
          └── 수식 확인 ──→ [📈 그래프 그리기]
                                  │
                                  ▼
                       [function-plot 인터랙티브 그래프]
                                  │
                                  ├── PNG 다운로드
                                  └── URL 공유

    [수학 키보드 입력] ──→ KaTeX 미리보기 ──→ [📈 그래프 그리기] ──→ 동일 플로우

---

## 수익화 전략 (AdSense)

function-plot은 MIT 라이선스로 AdSense 운영에 법적 제약 없음.

- 광고 위치: 그래프 결과 하단 + 사이드바(데스크톱)
- UX를 최대한 해치지 않는 비침습적 배치
- Phase 2 고려: "광고 없이 보기" 프리미엄 구독 (월 $2~3 수준)
- 수익 추정: 수학 교육 키워드 AdSense CPC $0.3~1.0 / 월 10만 PV 도달 시 $100~300

---

## Phase 2 기능 (출시 이후)

- 문제 이미지에서 그래프 관련 설명도 함께 인식하여 AI 힌트 제공
- 단계별 풀이 과정 표시 (AI 생성)
- 그래프 갤러리 (Cloudflare KV 또는 LocalStorage 활용)
- 다크 모드

---

## 리스크 및 대응

| 리스크                      | 대응 방안                                                      |
| --------------------------- | -------------------------------------------------------------- |
| 손글씨 수식 인식률 낮음     | 경고 문구 상시 표시 + KaTeX 확인 화면 + 재인식 버튼 3단계 장치 |
| 수식 편집 불가              | 재인식 버튼 + 수학 키보드 재입력으로 대체                      |
| Gemini API 비용 폭증        | 이미지 1MB 제한 + Cloudflare Pages Function에서 Rate Limiting  |
| Desmos API 약관 위반 가능성 | function-plot(MIT)으로 대체하여 원천 차단                      |

---

## 개발 일정 (솔로 개발 기준, 4주)

| 주차  | 작업 내용                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1주차 | Vite + React + TypeScript + Tailwind 세팅, Cloudflare Pages 배포 파이프라인, Canvas API 압축 로직, Gemini API 연동 및 JSON 파싱 |
| 2주차 | 이미지 업로드 UI, 손글씨 경고 문구, KaTeX 수식 확인 화면, 재인식 버튼                                                           |
| 3주차 | function-plot 그래프 렌더링, @karyum/react-math-keyboard 수학 키보드 통합                                                       |
| 4주차 | AdSense 연동, 모바일 반응형 최적화, 그래프 PNG 다운로드 및 URL 공유, 공개 배포                                                  |

---

## 성공 지표 (KPI, 출시 후 3개월)

| 지표                | 목표          |
| ------------------- | ------------- |
| 월 순방문자         | 10,000명 이상 |
| AI 수식 인식 성공률 | 90% 이상      |
| 평균 세션 시간      | 3분 이상      |
| AdSense 월 수익     | $50 이상      |
