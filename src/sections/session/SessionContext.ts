import { createContext, useContext } from 'react'
import { User } from '../../users/domain/models/User'

interface SessionContextProps {
  user: User | null
  isLoadingUser: boolean
  setUser: (user: User) => void
  logout: () => Promise<void>
}
export const SessionContext = createContext<SessionContextProps>({
  user: null,
  isLoadingUser: true,
  setUser: /* istanbul ignore next */ () => {},
  logout: /* istanbul ignore next */ () => Promise.resolve()
})

export const useSession = () => useContext(SessionContext)
