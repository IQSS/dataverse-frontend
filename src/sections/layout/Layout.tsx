import { Outlet } from 'react-router-dom'
import { Container } from '../ui/grid/Container'
import styles from './Layout.module.scss'
import { HeaderFactory } from './header/HeaderFactory'
import { FooterFactory } from './footer/FooterFactory'

export function Layout() {
  return (
    <>
      {HeaderFactory.create()}
      <Container className={styles['body-container']}>
        <Outlet />
      </Container>
      {FooterFactory.create()}
    </>
  )
}
