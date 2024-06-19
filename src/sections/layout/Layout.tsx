import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import styles from './Layout.module.scss'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { Header } from './header/Header'

export function Layout() {
  return (
    <>
      <TopBarProgressIndicator />
      <Header />
      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}

      <ScrollRestoration />
    </>
  )
}
