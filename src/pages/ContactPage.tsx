import { StaticDocumentLayout } from "@/components/layout/StaticDocumentLayout"
import { CONTACT_EMAIL, SITE_NAME } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const PAGE_TITLE = `문의 — ${SITE_NAME}` as const
const META_DESCRIPTION =
  `${SITE_NAME} 문의: 서비스 이용, 오류 신고, 개인정보 관련 요청 등 연락 방법을 안내합니다.` as const

export function ContactPage() {
  useDocumentSEO(PAGE_TITLE, META_DESCRIPTION)

  return (
    <StaticDocumentLayout title="문의">
      <section aria-labelledby="contact-general">
        <h2 id="contact-general">연락 방법</h2>
        <p>
          서비스 오류, 수식 인식 품질, 개인정보 관련 요청 등은 아래 이메일로 보내 주세요. 운영 형태에
          따라 응답까지 며칠이 걸릴 수 있습니다.
        </p>
        <p>
          <strong>이메일: </strong>
          <a className="text-primary underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section aria-labelledby="contact-tips">
        <h2 id="contact-tips">보내 주시면 좋은 내용</h2>
        <ul>
          <li>문제가 발생한 브라우저 종류와 버전</li>
          <li>재현 순서(예: 어떤 이미지를 올린 뒤 어떤 버튼을 눌렀는지)</li>
          <li>개인정보가 포함된 스크린샷은 가리거나 보내지 마세요.</li>
        </ul>
      </section>
    </StaticDocumentLayout>
  )
}
