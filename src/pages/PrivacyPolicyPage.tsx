import { StaticDocumentLayout } from "@/components/layout/StaticDocumentLayout"
import { SITE_NAME } from "@/constants/seo"
import { useDocumentSEO } from "@/hooks/useDocumentSEO"

const PAGE_TITLE = `개인정보 처리방침 — ${SITE_NAME}` as const
const META_DESCRIPTION =
  `${SITE_NAME} 개인정보 처리방침: 수집 항목, 이용 목적, 보관, 제3자 제공, 이용자 권리 및 문의처를 안내합니다.` as const

export function PrivacyPolicyPage() {
  useDocumentSEO(PAGE_TITLE, META_DESCRIPTION)

  return (
    <StaticDocumentLayout title="개인정보 처리방침">
      <p className="text-xs text-muted-foreground">
        시행일: 2026년 5월 9일 · 본 방침은 서비스 기능 변경에 따라 업데이트될 수 있습니다.
      </p>

      <section aria-labelledby="privacy-1">
        <h2 id="privacy-1">1. 총칙</h2>
        <p>
          {SITE_NAME}(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요하게 여기며, 관련 법령을 준수하기
          위해 노력합니다. 본 방침은 서비스 이용 과정에서 처리될 수 있는 정보와 그 목적을 설명합니다.
        </p>
      </section>

      <section aria-labelledby="privacy-2">
        <h2 id="privacy-2">2. 처리하는 정보</h2>
        <ul>
          <li>
            <strong>업로드 이미지 및 그로부터 추출된 수식 데이터</strong>: 수식 인식과 그래프 생성을 위해
            일시적으로 처리됩니다. 계정 식별자는 수집하지 않습니다.
          </li>
          <li>
            <strong>기기·접속 정보(로그)</strong>: 보안, 오류 분석, 트래픽 통계를 위해 IP 주소, User-Agent,
            요청 시각 등이 서버 또는 인프라 제공자에 기록될 수 있습니다.
          </li>
          <li>
            <strong>브라우저 저장 데이터</strong>: 화면 테마(라이트/다크) 등 UI 설정은 브라우저 로컬 저장소에
            저장될 수 있습니다.
          </li>
        </ul>
      </section>

      <section aria-labelledby="privacy-2-1">
        <h2 id="privacy-2-1">2-1. 저장하지 않는 것 (중요)</h2>
        <p>
          서비스는 <strong>문제/수식 이미지를 영구 저장하지 않는 것</strong>을 원칙으로 합니다. 업로드한
          이미지는 수식 인식 처리를 위해 필요한 범위에서만 전송·처리되며, 별도의 목적(재사용, 학습 데이터
          축적, 판매 등)으로 이용하지 않습니다.
        </p>
        <p>
          다만, 보안·장애 대응을 위해 인프라 제공자 수준에서 일시적인 로그가 남을 수 있으며, 법령 또는
          서비스 운영 정책상 필요한 범위에서만 최소 기간 보관될 수 있습니다.
        </p>
      </section>

      <section aria-labelledby="privacy-3">
        <h2 id="privacy-3">3. 처리 목적 및 제3자</h2>
        <p>
          수식 분석에는 Google의 생성형 AI(Gemini) API가 사용되되며, 이미지는 암호화된 연결을 통해
          해당 처리에 필요한 범위로 전송됩니다. 사이트 호스팅·보안에는 Cloudflare 등 인프라 서비스가
          이용되고고 있습니다. 
        </p>
      </section>

      <section aria-labelledby="privacy-copyright">
        <h2 id="privacy-copyright">저작권 및 부정 사용 금지</h2>
        <p>
          서비스는 학습·탐구 목적의 수식 시각화를 위한 도구입니다. 타인의 저작물을 무단으로 복제·배포하거나
          저작권을 침해하는 방식으로 서비스를 사용해서는 안 됩니다. 이용자가 업로드하는 콘텐츠의 권리 관계는
          이용자에게 있으며, 서비스는 이를 확인·보증하지 않습니다.
        </p>
      </section>

      <section aria-labelledby="privacy-4">
        <h2 id="privacy-4">4. 보관 기간</h2>
        <p>
          서비스 운영 정책 및 법령에 따라 로그와 일부 기술 데이터는 일정 기간 보관될 수 있습니다. 업로드
          이미지는 처리 직후 삭제됩됩니다.
        </p>
      </section>

      <section aria-labelledby="privacy-5">
        <h2 id="privacy-5">5. 이용자 권리</h2>
        <p>
          개인정보 관련 문의·열람·정정·삭제 요청은 &quot;문의&quot; 페이지의 연락처로 요청해 주세요. 합리적인
          범위에서 신속히 답변하겠습니다.
        </p>
      </section>
    </StaticDocumentLayout>
  )
}
