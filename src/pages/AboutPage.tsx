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
      <section aria-labelledby="about-motivation">
        <h2 id="about-motivation">개발 동기</h2>
        <p>
          복잡한 수식을 보면 그래프를 직접 그려 보고 싶어집니다. 이 함수는 어떤 변화를 보이는지 알아보고 싶어지기 때문입니다. 하지만 공학용 계산기나 기존 그래픽 앱은 수식
          입력 규칙이 너무 어렵습니다. 문법 오류 때문에 원하는 결과가 나오지 않을 때가 많습니다.
        </p>
        <p>
          {SITE_NAME}는 그런 진입 장벽을 낮추기 위해, <strong>수식 입력 대신 이미지 업로드</strong>라는
          가장 쉬운 동작으로 그래프를 얻을 수 있도록 만들었습니다.
        </p>
      </section>

      <section aria-labelledby="about-overview">
        <h2 id="about-overview">{SITE_NAME}란?</h2>
        <p>
          {SITE_NAME}는 교과서·문제집·시험지 등에 인쇄된 수식이 포함된 이미지를 업로드하면 AI가 수식을
          추출하고 사용자가 선택한 식을 2차원 좌표평면 위에 그래프로 보여 주는 웹 애플리케이션입니다.
          공학용 계산기 문법을 몰라도 빠르게 함수의 모양을 확인할 수 있도록 하든 것이 목적입니다.
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
        <h2 id="about-safety">개인정보·저작권에 대한 생각</h2>
        <p>
          {SITE_NAME}의 목적은 학습·탐구를 돕는 것입니다. 업로드한 이미지/수식은 그래프를 만들기 위한
          범위에서만 처리되어야 하며, 다른 목적(재판매, 학습 데이터 축적 등)으로 사용하지 않는 방향을
          우선합니다. 자세한 내용은 개인정보 처리방침을 참고해 주세요.
        </p>
        <p>
          타인의 저작물을 무단 복제·배포하기 위한 용도로 서비스를 사용하면 안 됩니다. 수식 자체는
          일반적으로 저작권 보호 대상이 아닐 수 있으나, 교재/문제지의 편집 구성과 해설 등은 저작권
          보호를 받을 수 있습니다.
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
