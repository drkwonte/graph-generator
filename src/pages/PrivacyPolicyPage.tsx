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

      <section aria-labelledby="privacy-summary">
        <h2 id="privacy-summary">요약</h2>
        <ul>
          <li>
            <strong>문제/수식을 저장하지 않음</strong>: 현재 버전은 “내 기록” 기능이 없으며, 업로드된 데이터는
            수식 인식과 그래프 표시 목적의 처리에만 사용합니다.
          </li>
          <li>
            <strong>목적 외 사용 금지</strong>: 학습 데이터로 재사용하거나 다른 목적으로 판매/활용하지 않는
            것을 원칙으로 합니다.
          </li>
          <li>
            <strong>저작권 준수</strong>: 사용자는 업로드한 이미지에 대한 권리를 보유하거나 적법하게 이용할 수
            있어야 하며, 타인의 저작권을 침해하는 용도로 사용할 수 없습니다.
          </li>
        </ul>
      </section>

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
            일시적으로 처리됩니다. 별도 회원가입이 없는 경우, 계정 식별자는 수집하지 않습니다.
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

      <section aria-labelledby="privacy-3">
        <h2 id="privacy-3">3. 처리 목적 및 제3자</h2>
        <p>
          수식 분석에는 Google의 생성형 AI(Gemini) API가 사용될 수 있으며, 이미지는 암호화된 연결을 통해
          해당 처리에 필요한 범위로 전송됩니다. 사이트 호스팅·보안에는 Cloudflare 등 인프라 서비스가
          이용될 수 있습니다.
        </p>
        <p>
          Google AdSense 등 광고를 도입하는 경우, Google을 포함한 제3자 공급업체가 쿠키를 사용하여
          사용자의 이전 방문 기록을 기반으로 광고를 제공할 수 있습니다. 사용자는 Google{" "}
          <a
            className="text-primary underline underline-offset-4"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer"
          >
            광고 설정
          </a>
          에서 맞춤 광고를 관리하거나,{" "}
          <a
            className="text-primary underline underline-offset-4"
            href="http://www.aboutads.info/choices/"
            target="_blank"
            rel="noreferrer"
          >
            aboutads.info
          </a>
          에서 일부 맞춤 광고를 거부할 수 있습니다.
        </p>
      </section>

      <section aria-labelledby="privacy-copyright">
        <h2 id="privacy-copyright">4. 저작권 및 이용자 책임</h2>
        <p>
          서비스는 그래프 시각화를 돕기 위한 도구이며, 저작권이 있는 문제/자료를 무단으로 복제·배포하는
          용도로 사용될 수 없습니다. 사용자는 업로드하는 이미지에 대해 필요한 권리를 보유하고 있어야 하며,
          타인의 권리를 침해하지 않도록 주의해야 합니다.
        </p>
      </section>

      <section aria-labelledby="privacy-4">
        <h2 id="privacy-4">5. 보관 기간</h2>
        <p>
          서비스 운영 정책 및 법령에 따라 로그와 일부 기술 데이터는 일정 기간 보관될 수 있습니다. 업로드
          이미지는 처리 직후 삭제되거나, 최소한의 기간만 보관될 수 있으며 구체적 기간은 인프라 설정에
          따릅니다.
        </p>
      </section>

      <section aria-labelledby="privacy-5">
        <h2 id="privacy-5">6. 이용자 권리</h2>
        <p>
          개인정보 관련 문의·열람·정정·삭제 요청은 &quot;문의&quot; 페이지의 연락처로 요청해 주세요. 합리적인
          범위에서 신속히 답변하겠습니다.
        </p>
      </section>
    </StaticDocumentLayout>
  )
}
