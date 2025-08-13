import { StoryFn } from '@storybook/react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'

export const WithOIDCAuthContext = (Story: StoryFn) => {
  return (
    <AuthContext.Provider
      value={{
        token: AuthContextMother.createToken(),
        idToken: AuthContextMother.createToken(),
        logIn: () => {},
        logOut: () => {},
        loginInProgress: false,
        tokenData: AuthContextMother.createTokenData(),
        idTokenData: AuthContextMother.createTokenData(),
        error: null,
        login: () => {} // 👈 deprecated
      }}>
      <Story />
    </AuthContext.Provider>
  )
}
