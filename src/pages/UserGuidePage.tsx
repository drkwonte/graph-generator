import { StaticDocumentLayout } from "@/components/layout/StaticDocumentLayout"
import { SITE_NAME } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const PAGE_TITLE = `사용설명서 — ${SITE_NAME}` as const
const META_DESCRIPTION =
  `${SITE_NAME} 사용설명서: 이미지 업로드부터 수식 선택, 그래프 출력(PNG/인쇄)까지 한 번에 안내합니다.` as const

export function UserGuidePage() {
  useDocumentSEO(PAGE_TITLE, META_DESCRIPTION)

  return (
    <StaticDocumentLayout title="사용설명서">
      <section aria-labelledby="guide-motivation">
        <h2 id="guide-motivation">왜 만들었나요?</h2>
        <p>
          그래프를 한 번 그려 보고 싶은데, 공학용 계산기나 기존 그래핑 앱들은 수식 입력 규칙이
          어렵게 느껴질 때가 많습니다. {SITE_NAME}는 <strong>이미지로 바로 그래프를 그리는</strong>{" "}
          가장 쉬운 흐름을 만들고 싶어서 시작했습니다.
        </p>
      </section>

      <section aria-labelledby="guide-steps">
        <h2 id="guide-steps">빠른 사용법</h2>
        <ul>
          <li>
            <strong>1) 이미지 업로드</strong>: 교과서·문제집의 수식이 잘 보이도록 밝고 선명한 이미지를
            선택합니다.
          </li>
          <li>
            <strong>2) AI로 수식 인식</strong>: 우측 패널의 버튼을 눌러 수식을 인식합니다. 손글씨나
            저해상도 이미지는 결과가 불안정할 수 있습니다.
          </li>
          <li>
            <strong>3) 그래프로 변환</strong>: 그래프로 그리고 싶은 수식을 선택한 뒤 하단의 변환 버튼을
            누릅니다.
          </li>
          <li>
            <strong>4) 그래프 확인</strong>: 마우스 휠로 확대, 드래그로 이동하면서 그래프 형태를
            확인합니다.
          </li>
          <li>
            <strong>5) 출력</strong>: 결과는 <strong>PNG 다운로드</strong> 또는 <strong>그래프 인쇄</strong>
            로 저장/출력할 수 있습니다.
          </li>
        </ul>
      </section>

      <section aria-labelledby="guide-tips">
        <h2 id="guide-tips">인식 정확도를 올리는 팁</h2>
        <ul>
          <li>가능하면 인쇄물을 정면에서 촬영하거나 스캔 이미지를 사용하세요.</li>
          <li>수식이 잘리거나 기울어지지 않도록 여백을 조금 남겨 촬영하세요.</li>
          <li>손그림/필기(특히 지수·분수)는 오인식이 잦을 수 있습니다.</li>
        </ul>
      </section>

      <section aria-labelledby="guide-privacy">
        <h2 id="guide-privacy">개인정보·저작권 관련 안내</h2>
        <p>
          {SITE_NAME}는 그래프를 보여 주기 위한 목적에서만 업로드 이미지를 처리합니다. 서비스 운영 정책은
          변경될 수 있으므로 자세한 내용은 <strong>개인정보 처리방침</strong>을 확인해 주세요. 또한, 타인의
          저작물을 무단 복제·배포하기 위한 목적으로 서비스를 사용해서는 안 됩니다.
        </p>
      </section>
    </StaticDocumentLayout>
  )
}

