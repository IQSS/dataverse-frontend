import { Outlet } from 'react-router-dom'
import { Header } from './header/Header'

export function Layout() {
  return (
    <article>
      <Header />
      <Outlet />
    </article>
  )
}
