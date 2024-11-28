import { Outlet } from 'react-router-dom'
import { Container } from '@iqss/dataverse-design-system'
import styles from './Layout.module.scss'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'
import { HeaderFactory } from './header/HeaderFactory'

export function Layout() {
  return (
    <>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      <main>
        <Container className={styles['body-container']}>
          <Outlet />
        </Container>
      </main>

      {FooterFactory.create()}
    </>
  )
}
