import { Outlet } from 'react-router-dom'
import { Container } from 'dataverse-design-system'
import styles from './Layout.module.scss'
import { HeaderFactory } from './header/HeaderFactory'
import { FooterFactory } from './footer/FooterFactory'
import TopBarProgressIndicator from './topbar-progress-indicator/TopbarProgressIndicator'

export function Layout() {
  return (
    <>
      <TopBarProgressIndicator />
      {HeaderFactory.create()}
      <Container className={styles['body-container']}>
        <Outlet />
      </Container>
      {FooterFactory.create()}
    </>
  )
}
