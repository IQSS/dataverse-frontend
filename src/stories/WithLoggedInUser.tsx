import { StoryFn } from '@storybook/react'
import { SessionContext } from '../sections/session/SessionContext'
import { UserMother } from '../../tests/component/users/domain/models/UserMother'

export const WithLoggedInUser = (Story: StoryFn) => {
  return (
    <SessionContext.Provider
      value={{
        user: UserMother.create(),
        logout: () => Promise.resolve(),
        setUser: () => {},
        isLoadingUser: false,
        sessionError: null,
        refetchUserSession: () => Promise.resolve()
      }}>
      <Story />
    </SessionContext.Provider>
  )
}
