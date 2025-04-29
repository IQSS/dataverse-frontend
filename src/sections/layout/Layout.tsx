import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import { HistoryTrackerProvider } from '@/router/HistoryTrackerProvider'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { SpaUserFeedbackCTA } from './spa-user-feedback-cta/SpaUserFeedbackCTA'
import { FooterFactory } from './footer/FooterFactory'
import { HeaderFactory } from './header/HeaderFactory'
import styles from './Layout.module.scss'

const contactRepository = new ContactJSDataverseRepository()

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

      <SpaUserFeedbackCTA contactRepository={contactRepository} />
    </HistoryTrackerProvider>
  )
}
