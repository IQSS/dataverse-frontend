import { Outlet } from 'react-router-dom'
import { Header } from './header/Header'
import { Container } from '../ui/grid/container/Container'

export function Layout() {
  return (
    <article>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </article>
  )
}
