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
      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}
    </HistoryTrackerProvider>
  )
}
