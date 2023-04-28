import { Outlet } from 'react-router-dom'
import { Header } from './header/Header'
import { Container } from 'dataverse-ui-lib'
import { Footer } from './footer/Footer'
import styles from './Layout.module.scss'

export function Layout() {
  return (
    <article>
      <Header />
      <Container className={styles['body-container']}>
        <Outlet />
      </Container>
      <Footer />
    </article>
  )
}
