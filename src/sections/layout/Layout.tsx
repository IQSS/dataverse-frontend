import { Outlet } from 'react-router-dom'
import { Container } from 'dataverse-design-system'
import styles from './Layout.module.scss'
import { HeaderFactory } from './header/HeaderFactory'
import { FooterFactory } from './footer/FooterFactory'

export function Layout() {
  return (
    <article>
      {HeaderFactory.create()}
      <Container className={styles['body-container']}>
        <Outlet />
      </Container>
      {FooterFactory.create()}
    </article>
  )
}
