import { Outlet } from 'react-router-dom'
import { Container } from '../ui/grid/Container'
import { Footer } from './footer/Footer'
import styles from './Layout.module.scss'
import { HeaderFactory } from './header/HeaderFactory'

export function Layout() {
  return (
    <article>
      {HeaderFactory.create()}
      <Container className={styles['body-container']}>
        <Outlet />
      </Container>
      <Footer />
    </article>
  )
}
