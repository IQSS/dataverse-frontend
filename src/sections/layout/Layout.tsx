import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Header } from './header/Header'

type User = {
  name: string
}

export function Layout() {
  const [user, setUser] = useState<User>()

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <Outlet />
    </article>
  )
}
