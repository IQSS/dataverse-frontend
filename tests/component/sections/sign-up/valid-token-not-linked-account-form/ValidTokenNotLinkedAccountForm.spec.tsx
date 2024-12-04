import { AuthContext } from 'react-oauth2-code-pkce'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { ValidTokenNotLinkedAccountForm } from '@/sections/sign-up/valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'
import { UserDTO } from '@/users/domain/useCases/DTOs/UserDTO'
// import { TermsOfUseMother } from '@tests/component/info/models/TermsOfUseMother'
// import { JSTermsOfUseMapper } from '@/info/infrastructure/mappers/JSTermsOfUseMapper'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
const userRepository: UserRepository = {} as UserRepository

// TODO - Uncomment when application terms of use are available in API
// const termsOfUseMock = TermsOfUseMother.create()
// const sanitizedTermsOfUseMock = JSTermsOfUseMapper.toSanitizedTermsOfUse(termsOfUseMock)

const mockUserName = 'mockUserName'
const mockFirstName = 'mockFirstName'
const mockLastName = 'mockLastName'
const mockEmail = 'mockEmail@email.com'

describe('ValidTokenNotLinkedAccountForm', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    // dataverseInfoRepository.getApiTermsOfUse = cy.stub().resolves(sanitizedTermsOfUseMock)
    dataverseInfoRepository.getApiTermsOfUse = cy.stub().resolves('')
    userRepository.register = cy.stub().as('registerUser').resolves()
  })

  describe('form fields correct values', () => {
    it('renders the form fields with the correct default values when tokenData has preferred username, given name, family name and email', () => {
      cy.customMount(
        <AuthContext.Provider
          value={{
            token: AuthContextMother.createToken(),
            idToken: AuthContextMother.createToken(),
            logIn: () => {},
            logOut: () => {},
            loginInProgress: false,
            tokenData: AuthContextMother.createTokenData({
              preferred_username: mockUserName,
              given_name: mockFirstName,
              family_name: mockLastName,
              email: mockEmail
            }),
            idTokenData: AuthContextMother.createTokenData(),
            error: null,
            login: () => {} // 👈 deprecated
          }}>
          <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
        </AuthContext.Provider>
      )

      cy.findByLabelText('Username').should('have.value', mockUserName)
      cy.findByLabelText('Given Name').should('have.value', mockFirstName)
      cy.findByLabelText('Family Name').should('have.value', mockLastName)
      cy.findByLabelText('Email').should('have.value', mockEmail)
      // cy.findByText('Terms of Use SPA dev').should('exist')
    })

    it('renders the form fields with the correct default values when tokenData does not have preferred username, given name, family name and email', () => {
      cy.customMount(
        <AuthContext.Provider
          value={{
            token: AuthContextMother.createToken(),
            idToken: AuthContextMother.createToken(),
            logIn: () => {},
            logOut: () => {},
            loginInProgress: false,
            tokenData: AuthContextMother.createTokenDataWithNoUsernameEmailFirstnameAndLastname(),
            idTokenData: AuthContextMother.createTokenDataWithNoUsernameEmailFirstnameAndLastname(),
            error: null,
            login: () => {} // 👈 deprecated
          }}>
          <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
        </AuthContext.Provider>
      )

      cy.findByLabelText('Username').should('have.value', '')
      cy.findByLabelText('Given Name').should('have.value', '')
      cy.findByLabelText('Family Name').should('have.value', '')
      cy.findByLabelText('Email').should('have.value', '')
      // cy.findByText('Terms of Use SPA dev').should('exist')
    })
  })

  describe('submit form with correct data', () => {
    it('submits the form with the correct data when tokenData has preferred username, given name, family name and email ', () => {
      cy.customMount(
        <AuthContext.Provider
          value={{
            token: AuthContextMother.createToken(),
            idToken: AuthContextMother.createToken(),
            logIn: () => {},
            logOut: () => {},
            loginInProgress: false,
            tokenData: AuthContextMother.createTokenData({
              preferred_username: mockUserName,
              given_name: mockFirstName,
              family_name: mockLastName,
              email: mockEmail
            }),
            idTokenData: AuthContextMother.createTokenData({
              preferred_username: mockUserName,
              given_name: mockFirstName,
              family_name: mockLastName,
              email: mockEmail
            }),
            error: null,
            login: () => {} // 👈 deprecated
          }}>
          <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
        </AuthContext.Provider>
      )

      cy.findByLabelText(
        'I have read and accept the Dataverse General Terms of Use as outlined above.'
      ).check({ force: true })

      cy.findByRole('button', { name: 'Create Account' }).click()

      cy.get('@registerUser').should((spy) => {
        const registerUserSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const userDTO = registerUserSpy.getCall(0).args[0] as UserDTO

        expect(userDTO).to.deep.equal({
          termsAccepted: true
        })
      })
    })

    it('submits the form with the correct data when tokenData does not have preferred username, given name, family name and email', () => {
      cy.customMount(
        <AuthContext.Provider
          value={{
            token: AuthContextMother.createToken(),
            idToken: AuthContextMother.createToken(),
            logIn: () => {},
            logOut: () => {},
            loginInProgress: false,
            tokenData: AuthContextMother.createTokenDataWithNoUsernameEmailFirstnameAndLastname(),
            idTokenData: AuthContextMother.createTokenDataWithNoUsernameEmailFirstnameAndLastname(),
            error: null,
            login: () => {} // 👈 deprecated
          }}>
          <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
        </AuthContext.Provider>
      )

      const newMockUserName = 'newMockUserName'
      const newMockFirstName = 'newMockFirstName'
      const newMockLastName = 'newMockLastName'
      const newMockEmail = 'newMockEmail@email.com'

      // Assert that submit button is disabled if terms are not accepted
      cy.findByRole('button', { name: 'Create Account' }).should('be.disabled')

      cy.findByLabelText(
        'I have read and accept the Dataverse General Terms of Use as outlined above.'
      ).check({ force: true })

      // Uncheck and then check again to test validation error from terms not accepted
      cy.findByLabelText(
        'I have read and accept the Dataverse General Terms of Use as outlined above.'
      ).uncheck({ force: true })

      cy.findByText(
        'Please check the box to indicate your acceptance of the General Terms of Use.'
      ).should('exist')

      cy.findByLabelText(
        'I have read and accept the Dataverse General Terms of Use as outlined above.'
      ).check({ force: true })

      cy.findByRole('button', { name: 'Create Account' }).should('not.be.disabled')

      cy.findByRole('button', { name: 'Create Account' }).click()

      // Assert that the form has errors in Username and Email fields
      cy.findByText('Username is required.').should('exist')
      cy.findByText('Given Name is required.').should('exist')
      cy.findByText('Family Name is required.').should('exist')
      cy.findByText('Email is required.').should('exist')

      // Type a bad username to check validation first
      cy.findByLabelText('Username').type('bad Username')
      cy.findByText('Username is invalid.').should('exist')
      cy.findByLabelText('Username').clear()
      cy.findByLabelText('Username').type(newMockUserName)

      // Fill the rest of the fields
      cy.findByLabelText('Given Name').type(newMockFirstName)
      cy.findByLabelText('Family Name').type(newMockLastName)
      cy.findByLabelText('Email').type(newMockEmail)

      cy.findByRole('button', { name: 'Create Account' }).click()

      cy.get('@registerUser').should((spy) => {
        const registerUserSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const userDTO = registerUserSpy.getCall(0).args[0] as UserDTO

        expect(userDTO).to.deep.equal({
          termsAccepted: true,
          username: newMockUserName,
          emailAddress: newMockEmail,
          firstName: newMockFirstName,
          lastName: newMockLastName
        })
      })
    })
  })

  it('shows no terms message when there are no terms of use', () => {
    dataverseInfoRepository.getApiTermsOfUse = cy.stub().resolves(null)

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
        <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
      </AuthContext.Provider>
    )

    cy.findByText('There are no Terms of Use for this Dataverse installation.').should('exist')
  })

  it('logOut function is called when clicking the Cancel button', () => {
    const logOut = cy.stub().as('logOut')

    cy.customMount(
      <AuthContext.Provider
        value={{
          token: AuthContextMother.createToken(),
          idToken: AuthContextMother.createToken(),
          logIn: () => {},
          logOut,
          loginInProgress: false,
          tokenData: AuthContextMother.createTokenData(),
          idTokenData: AuthContextMother.createTokenData(),
          error: null,
          login: () => {} // 👈 deprecated
        }}>
        <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
      </AuthContext.Provider>
    )

    cy.findByRole('button', { name: 'Cancel' }).click()

    cy.get('@logOut').should('have.been.called')
  })
})
