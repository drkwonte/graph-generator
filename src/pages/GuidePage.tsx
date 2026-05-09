import { StaticDocumentLayout } from "@/components/layout/StaticDocumentLayout"
import { SITE_NAME } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const PAGE_TITLE = `사용설명서 — ${SITE_NAME}` as const
const META_DESCRIPTION =
  `${SITE_NAME} 사용설명서: 이미지 업로드부터 수식 선택, 그래프 저장(PNG)과 인쇄까지 사용 방법을 안내합니다.` as const

export function GuidePage() {
  useDocumentSEO(PAGE_TITLE, META_DESCRIPTION)

  return (
    <StaticDocumentLayout title="사용설명서">
      <section aria-labelledby="guide-why">
        <h2 id="guide-why">왜 만들었나요?</h2>
        <p>
          그래프를 한 번 그려 보고 싶을 뿐인데, 공학용 계산기나 그래핑 앱의 수식 입력 규칙이 너무
          어렵게 느껴질 때가 있습니다. {SITE_NAME}는 그 입력 장벽을 낮추기 위해 시작했습니다.
          수식을 직접 타이핑하지 않아도, 이미지를 올리면 가능한 범위에서 빠르게 그래프로 확인할 수 있게
          만드는 것이 목표입니다.
        </p>
      </section>

      <section aria-labelledby="guide-steps">
        <h2 id="guide-steps">빠른 시작</h2>
        <ul>
          <li>
            <strong>1) 이미지 업로드</strong>: 왼쪽의 <strong>이미지 업로드</strong> 영역에서 파일을 선택합니다.
          </li>
          <li>
            <strong>2) 수식 인식</strong>: 오른쪽 상단의 <strong>AI로 수식 인식하기</strong>를 누릅니다.
          </li>
          <li>
            <strong>3) 그래프로 그릴 수식 선택</strong>: 인식된 수식 목록에서 원하는 항목을 선택/해제합니다.
          </li>
          <li>
            <strong>4) 그래프 변환</strong>: 아래의 <strong>선택한 수식 그래프로 변환</strong> 버튼을 누릅니다.
          </li>
        </ul>
      </section>

      <section aria-labelledby="guide-graph">
        <h2 id="guide-graph">그래프 사용</h2>
        <ul>
          <li>
            그래프는 마우스로 <strong>줌/패닝</strong>할 수 있습니다.
          </li>
          <li>
            범례는 <strong>KaTeX</strong>로 표시됩니다.
          </li>
          <li>
            <strong>PNG 다운로드</strong>로 그래프+범례를 이미지로 저장할 수 있습니다.
          </li>
          <li>
            <strong>그래프 인쇄</strong>로 그래프+범례를 프린터로 출력할 수 있습니다.
          </li>
        </ul>
      </section>

      <section aria-labelledby="guide-tips">
        <h2 id="guide-tips">인식 정확도를 높이는 팁</h2>
        <ul>
          <li>가능하면 인쇄물(교과서/문제집) 이미지를 사용하세요.</li>
          <li>수식이 기울지 않게, 글자가 선명하게 보이도록 촬영/스캔하세요.</li>
          <li>손글씨는 인식이 부정확할 수 있습니다.</li>
        </ul>
      </section>

      <section aria-labelledby="guide-data">
        <h2 id="guide-data">데이터와 저작권에 대해</h2>
        <p>
          {SITE_NAME}는 사용자가 업로드한 문제/수식 이미지를 <strong>수식 인식과 그래프 표시</strong>를 위해
          처리할 수 있지만, 서비스 특성상 <strong>학습 데이터로 재사용하거나 다른 목적으로 판매/활용하지
          않는 것</strong>을 원칙으로 합니다. 또한, 사용자는 업로드한 이미지에 대한 권리를 보유하거나
          적법하게 이용할 수 있어야 하며, 타인의 저작권을 침해하는 용도로 사용해서는 안 됩니다.
        </p>
      </section>
    </StaticDocumentLayout>
  )
}

