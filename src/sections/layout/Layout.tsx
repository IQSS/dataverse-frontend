import DOMPurify from 'dompurify'
import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import styles from './Layout.module.scss'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { HeaderFactory } from './header/HeaderFactory'
import { HistoryTrackerProvider } from '@/router/HistoryTrackerProvider'
import { requireAppConfig } from '@/config'

export function Layout() {
  const { bannerMessage } = requireAppConfig()
  const sanitizedBannerMessage = bannerMessage
    ? DOMPurify.sanitize(bannerMessage, { USE_PROFILES: { html: true } })
    : null

  return (
    <HistoryTrackerProvider>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      {sanitizedBannerMessage ? (
        <div className={`alert alert-warning rounded-0 ${styles['banner-message']}`} role="alert">
          <div className="container" dangerouslySetInnerHTML={{ __html: sanitizedBannerMessage }} />
        </div>
      ) : null}

      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}
    </HistoryTrackerProvider>
  )
}
