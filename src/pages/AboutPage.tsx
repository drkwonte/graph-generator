import { StaticDocumentLayout } from "@/components/layout/StaticDocumentLayout"
import { SITE_NAME } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const PAGE_TITLE = `소개 — ${SITE_NAME}` as const
const META_DESCRIPTION =
  `${SITE_NAME} 서비스 소개: 수식 이미지 인식, 그래프 시각화, 이용 대상 및 제공 기능을 설명합니다.` as const

export function AboutPage() {
  useDocumentSEO(PAGE_TITLE, META_DESCRIPTION)

  return (
    <StaticDocumentLayout title="소개">
      <section aria-labelledby="about-overview">
        <h2 id="about-overview">{SITE_NAME}란?</h2>
        <p>
          {SITE_NAME}는 교과서·문제집·시험지 등에 인쇄된 수식이 포함된 이미지를 업로드하면, AI가 수식을
          추출하고 사용자가 선택한 식을 2차원 좌표평면 위에 그래프로 보여 주는 웹 애플리케이션입니다.
          공학용 계산기 문법을 몰라도 빠르게 함수의 모양을 확인할 수 있도록 만든 것이 목적입니다.
        </p>
      </section>

      <section aria-labelledby="about-motivation">
        <h2 id="about-motivation">개발 동기</h2>
        <p>
          그래프를 한 번 그려 보고 싶은데, 공학용 계산기나 그래핑 앱에서 요구하는 입력 규칙이 너무 어렵게
          느껴질 때가 있습니다. {SITE_NAME}는 그런 “입력 장벽”을 줄이기 위해 시작했습니다. 이미지를 올리면
          가능한 범위에서 곧바로 그래프를 확인할 수 있는, 더 쉬운 앱을 만들고 싶었습니다.
        </p>
      </section>

      <section aria-labelledby="about-features">
        <h2 id="about-features">주요 기능</h2>
        <ul>
          <li>브라우저에서 이미지를 선택하거나 촬영한 파일을 업로드합니다.</li>
          <li>클라이언트에서 이미지를 적절한 크기로 압축한 뒤, 서버를 통해 AI 모델로 수식을 분석합니다.</li>
          <li>인식된 수식을 목록으로 보여 주며, 그래프로 그릴 항목을 선택할 수 있습니다.</li>
          <li>그래프는 마우스로 확대·이동할 수 있으며, 범례와 함께 PNG로 저장하거나 인쇄할 수 있습니다.</li>
        </ul>
      </section>

      <section aria-labelledby="about-safety">
        <h2 id="about-safety">저장·목적외 사용에 대한 원칙</h2>
        <p>
          {SITE_NAME}는 사용자가 업로드한 이미지/수식 데이터를 <strong>수식 인식과 그래프 표시</strong> 목적을
          위해서만 처리합니다. 별도의 회원 기능이나 “내 기록” 기능을 제공하지 않는 현재 버전에서는,
          문제·수식을 장기간 저장하거나 다른 목적으로 활용하지 않는 것을 기본 원칙으로 합니다.
        </p>
      </section>

      <section aria-labelledby="about-limitations">
        <h2 id="about-limitations">이용 시 참고 사항</h2>
        <p>
          손글씨나 흐릿한 사진은 인식 오류가 생기기 쉽습니다. 인쇄물을 평평하게 촬영하거나 스캔한
          이미지를 사용하는 것이 가장 안정적입니다. AI 결과는 항상 정확하지 않으므로, 시험이나
          과제 제출 전에는 반드시 원문과 대조해 확인해 주세요.
        </p>
      </section>
    </StaticDocumentLayout>
  )
}
