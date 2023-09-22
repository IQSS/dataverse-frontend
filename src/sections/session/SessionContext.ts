import { createContext, useContext } from 'react'
import { User } from '../../users/domain/models/User'

interface SessionContextProps {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}
export const SessionContext = createContext<SessionContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {}
})

export const useSession = () => useContext(SessionContext)
