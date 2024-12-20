import { createContext, useContext } from 'react'
import { User } from '../../users/domain/models/User'

interface SessionContextProps {
  user: User | null
  isLoadingUser: boolean
  sessionError: SessionError | null
  setUser: (user: User) => void
  logout: () => Promise<void>
  refetchUserSession: () => Promise<void>
}
export const SessionContext = createContext<SessionContextProps>({
  user: null,
  isLoadingUser: true,
  sessionError: null,
  setUser: /* istanbul ignore next */ () => {},
  logout: /* istanbul ignore next */ () => Promise.resolve(),
  refetchUserSession: /* istanbul ignore next */ () => Promise.resolve()
})

export const useSession = () => useContext(SessionContext)

export interface SessionError {
  statusCode: number | null
  message: string
}
