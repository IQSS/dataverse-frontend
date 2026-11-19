import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { SignUp } from '@/sections/sign-up/SignUp'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'
import { AuthContext } from 'react-oauth2-code-pkce'
import { WithRepositories } from '@tests/component/WithRepositories'
import { applyTestAppConfig } from '@tests/support/bootstrapAppConfig'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
const userRepository: UserRepository = {} as UserRepository

describe('SignUp', () => {
  beforeEach(() => {
    dataverseInfoRepository.getTermsOfUse = cy.stub().resolves('Terms of use')
  })

  it('renders the valid token not linked account form and correct alerts when hasValidTokenButNotLinkedAccount prop is true', () => {
    cy.customMount(
      <WithRepositories userRepository={userRepository}>
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
      </WithRepositories>
    )

    cy.findByTestId('valid-token-not-linked-account-alert-text').should('exist')
    cy.findByTestId('valid-token-not-linked-account-about-prefilled-fields').should('exist')
    cy.findByTestId('default-create-account-alert-text').should('not.exist')

    cy.findByTestId('valid-token-not-linked-account-form').should('exist')
    cy.findByTestId('builtin-sign-up-form').should('not.exist')
  })

  // For now we are only rendering the form for the case when theres is a valid token but is not linked to any account, but we prepare the test for other cases
  it('renders the default create account alert when hasValidTokenButNotLinkedAccount prop is false', () => {
    cy.customMount(
      <WithRepositories userRepository={userRepository}>
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
      </WithRepositories>
    )

    cy.findByTestId('default-create-account-alert-text').should('exist')
    cy.findByTestId('valid-token-not-linked-account-alert-text').should('not.exist')
    cy.findByTestId('valid-token-not-linked-account-about-prefilled-fields').should('not.exist')

    cy.findByTestId('valid-token-not-linked-account-form').should('not.exist')
    cy.findByTestId('builtin-sign-up-form').should('exist')
  })

  it('does not render the sign-up form when sign-up is disabled in the app config', () => {
    const defaultSignUpEnabled = Cypress.env('signUpEnabled') as boolean
    Cypress.env('signUpEnabled', false)
    applyTestAppConfig()

    cy.customMount(
      <WithRepositories userRepository={userRepository}>
        <SignUp
          dataverseInfoRepository={dataverseInfoRepository}
          hasValidTokenButNotLinkedAccount={false}
        />
      </WithRepositories>
    )

    cy.findByTestId('default-create-account-alert-text').should('exist')
    cy.findByTestId('builtin-sign-up-form').should('not.exist')

    cy.then(() => {
      Cypress.env('signUpEnabled', defaultSignUpEnabled)
      applyTestAppConfig()
    })
  })
})
