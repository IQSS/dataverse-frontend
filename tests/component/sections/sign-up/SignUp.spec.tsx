import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { SignUp } from '@/sections/sign-up/SignUp'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'
import { AuthContext } from 'react-oauth2-code-pkce'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository

describe('SignUp', () => {
  beforeEach(() => {
    dataverseInfoRepository.getTermsOfUse = cy.stub().resolves('Terms of use')
  })

  it('renders the valid token not linked account form and correct alerts when hasValidTokenButNotLinkedAccount prop is true', () => {
    cy.customMount(
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
        <SignUp
          dataverseInfoRepository={dataverseInfoRepository}
          hasValidTokenButNotLinkedAccount={true}
        />
      </AuthContext.Provider>
    )

    cy.findByTestId('valid-token-not-linked-account-alert-text').should('exist')
    cy.findByTestId('valid-token-not-linked-account-about-prefilled-fields').should('exist')
    cy.findByTestId('default-create-account-alert-text').should('not.exist')

    cy.findByTestId('valid-token-not-linked-account-form').should('exist')
  })

  // For now we are only rendering the form for the case when theres is a valid token but is not linked to any account, but we prepare the test for other cases
  it('renders the default create account alert when hasValidTokenButNotLinkedAccount prop is false', () => {
    cy.customMount(
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
        <SignUp
          dataverseInfoRepository={dataverseInfoRepository}
          hasValidTokenButNotLinkedAccount={false}
        />
      </AuthContext.Provider>
    )

    cy.findByTestId('default-create-account-alert-text').should('exist')
    cy.findByTestId('valid-token-not-linked-account-alert-text').should('not.exist')
    cy.findByTestId('valid-token-not-linked-account-about-prefilled-fields').should('not.exist')

    cy.findByTestId('valid-token-not-linked-account-form').should('not.exist')
  })
})
