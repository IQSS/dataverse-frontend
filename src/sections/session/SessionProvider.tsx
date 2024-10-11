import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { User } from '../../users/domain/models/User'
import { SessionContext } from './SessionContext'
import { getUser } from '../../users/domain/useCases/getUser'
import { UserRepository } from '../../users/domain/repositories/UserRepository'
import { logOut } from '../../users/domain/useCases/logOut'

const BACKEND_URL = import.meta.env.VITE_DATAVERSE_BACKEND_URL as string

interface SessionProviderProps {
  repository: UserRepository
}
export function SessionProvider({ repository, children }: PropsWithChildren<SessionProviderProps>) {
  const { token, tokenData } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  useEffect(() => {
    // Just to log some data from the AuthContext
    console.log(
      '%cToken from AuthContext: ',
      'background: green; color: white; padding: 2px; border-radius: 2px;',
      {
        token
      }
    )

    console.log(
      '%cTokenData from AuthContext: ',
      'background: green; color: white; padding: 2px; border-radius: 2px;',
      tokenData
    )
  }, [token, tokenData])

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/api/v1/users/:me`, {
        method: 'GET',
        credentials: 'omit', // to avoid sending the cookie
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
          // 👇 And this throws BAD API key because its a token not an api key of course
          //   'X-Dataverse-key': token
        }
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errData: Error) => {
              throw new Error(`Error ${response.status}: ${errData.message || response.statusText}`)
            })
          }
          return response.json()
        })
        .then((data) => {
          console.log('User data:', data)
        })
        .catch((error) => {
          console.error(
            '%cError getting user data with users/:me endpoint',
            'background: #eb5656; color: white; padding: 2px',
            error
          )
        })
    }
  }, [token])

  useEffect(() => {
    const handleGetUser = async () => {
      setIsLoadingUser(true)
      try {
        const user: User | void = await getUser(repository)

        user && setUser(user)
      } catch (error) {
        console.error('There was an error getting the authenticated user', error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    void handleGetUser()
  }, [repository])

  const submitLogOut = () => {
    return logOut(repository)
      .then(() => {
        setUser(null)
      })
      .catch((error) => console.error('There was an error logging out the user', error))
  }

  return (
    <SessionContext.Provider value={{ user, isLoadingUser, setUser, logout: submitLogOut }}>
      {children}
    </SessionContext.Provider>
  )
}
