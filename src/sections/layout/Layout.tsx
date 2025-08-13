import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import styles from './Layout.module.scss'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { HeaderFactory } from './header/HeaderFactory'
import { HistoryTrackerProvider } from '@/router/HistoryTrackerProvider'

export function Layout() {
  return (
    <HistoryTrackerProvider>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      {/* <div className="alert alert-warning rounded-0" role="alert">
        <div className="container">
          You are using the new Dataverse <strong>SPA version</strong>. This is an early release and
          some features from the original site are not yet available.
        </div>
      </div> */}

      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}
    </HistoryTrackerProvider>
  )
}
