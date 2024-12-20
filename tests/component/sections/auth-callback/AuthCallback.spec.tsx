import {
  AuthCallback,
  encodeReturnToPathInStateQueryParam
} from '@/sections/auth-callback/AuthCallback'
import { QueryParamKey } from '@/sections/Route.enum'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'
import { AuthContext } from 'react-oauth2-code-pkce'
import { Route, Routes } from 'react-router-dom'

const encodedReturnToProtectedPathMock = encodeReturnToPathInStateQueryParam('/protected')

describe('AuthCallback Component', () => {
  const renderComponent = (loginInProgress: boolean, searchParams = '') => {
    cy.customMount(
      <AuthContext.Provider
        value={{
          token: AuthContextMother.createToken(),
          idToken: AuthContextMother.createToken(),
          logIn: () => {},
          logOut: () => {},
          loginInProgress: loginInProgress,
          tokenData: AuthContextMother.createTokenData(),
          idTokenData: AuthContextMother.createTokenData(),
          error: null,
          login: () => {} // 👈 deprecated
        }}>
        <Routes>
          <Route path="/callback" element={<AuthCallback />} />
          <Route path="/" element={<div data-cy="home-page">Home</div>} />
          <Route path="/protected" element={<div data-cy="protected-page">Protected</div>} />
        </Routes>
      </AuthContext.Provider>,
      [`/callback${searchParams}`]
    )
  }

  it('redirects to home if state query param is missing', () => {
    renderComponent(false) // No state param
    cy.get('[data-cy="home-page"]').should('exist')
  })

  it('does not redirect while login is in progress', () => {
    renderComponent(true, `?${QueryParamKey.AUTH_STATE}=${encodedReturnToProtectedPathMock}`)

    cy.get('[data-cy="protected-page"]').should('not.exist')
    cy.findByTestId('app-loader').should('exist')
  })

  it('redirects to the intended path when state is present and has a returnTo property', () => {
    renderComponent(false, `?${QueryParamKey.AUTH_STATE}=${encodedReturnToProtectedPathMock}`)

    cy.get('[data-cy="protected-page"]').should('exist')
    cy.findByTestId('app-loader').should('not.exist')
  })

  // edge cases
  it('redirects to home if state query param is just a string', () => {
    renderComponent(false, `?${QueryParamKey.AUTH_STATE}=invalid`)

    cy.get('[data-cy="home-page"]').should('exist')
  })

  it('redirects to home if state query param does not have a returnTo property', () => {
    renderComponent(
      false,
      `?${QueryParamKey.AUTH_STATE}=${encodeURIComponent('{"invalid": "invalid"}')}`
    )

    cy.get('[data-cy="home-page"]').should('exist')
  })
})
