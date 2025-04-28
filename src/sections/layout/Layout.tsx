import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import { HistoryTrackerProvider } from '@/router/HistoryTrackerProvider'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { UserFeedbackCTA } from './user-feedback-cta/UserFeedbackCTA'
import { FooterFactory } from './footer/FooterFactory'
import { HeaderFactory } from './header/HeaderFactory'
import styles from './Layout.module.scss'

export function Layout() {
  return (
    <HistoryTrackerProvider>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}

      <UserFeedbackCTA />
    </HistoryTrackerProvider>
  )
}
