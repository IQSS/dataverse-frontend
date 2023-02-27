import { Outlet } from 'react-router-dom'
import { Header } from '../shared/Header'
import { useState } from 'react'

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
