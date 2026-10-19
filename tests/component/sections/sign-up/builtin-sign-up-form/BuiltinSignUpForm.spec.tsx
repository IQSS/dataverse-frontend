import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { SignUpError } from '@/users/domain/models/SignUpError'
import { BuiltinSignUpForm } from '@/sections/sign-up/builtin-sign-up-form/BuiltinSignUpForm'
import { WithRepositories } from '@tests/component/WithRepositories'

const userRepository: UserRepository = {} as UserRepository
const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository

const authContextValue = (logIn: IAuthContext['logIn']): IAuthContext => ({
  token: '',
  idToken: undefined,
  logIn,
  logOut: () => {},
  loginInProgress: false,
  tokenData: undefined,
  idTokenData: undefined,
  error: null,
  login: () => {}
})

const mountForm = (logIn: IAuthContext['logIn'] = () => {}) =>
  cy.customMount(
    <WithRepositories userRepository={userRepository}>
      <AuthContext.Provider value={authContextValue(logIn)}>
        <BuiltinSignUpForm dataverseInfoRepository={dataverseInfoRepository} />
      </AuthContext.Provider>
    </WithRepositories>
  )

const fillValidForm = () => {
  cy.get('#username').type('alovelace')
  cy.get('#firstName').type('Ada')
  cy.get('#lastName').type('Lovelace')
  cy.get('#emailAddress').type('ada@example.edu')
  cy.get('#password').type('Str0ngPassw0rd')
  cy.get('#confirmPassword').type('Str0ngPassw0rd')
  cy.get('#affiliation').type('Harvard University')
  cy.findByTestId('termsAcceptedCheckbox').check()
}

describe('BuiltinSignUpForm', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    dataverseInfoRepository.getTermsOfUse = cy.stub().resolves('<p>Terms of use</p>')
  })

  it('submits the form and shows the account created view with a log in button', () => {
    userRepository.signUp = cy
      .stub()
      .as('signUp')
      .resolves({ status: 'created', identifier: '@alovelace' })
    const logIn = cy.stub().as('logIn')
    mountForm(logIn)

    fillValidForm()
    cy.findByRole('button', { name: 'Create Account' }).click()

    cy.get('@signUp').should('have.been.calledOnceWith', {
      username: 'alovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      emailAddress: 'ada@example.edu',
      password: 'Str0ngPassw0rd',
      affiliation: 'Harvard University',
      position: undefined,
      termsAccepted: true
    })
    cy.findByTestId('sign-up-created-text').should('contain.text', '@alovelace')

    cy.findByTestId('sign-up-log-in-button').click()
    cy.get('@logIn').should('have.been.calledOnce')
  })

  it('shows the check your email view when the sign-up is pending', () => {
    userRepository.signUp = cy.stub().resolves({ status: 'pending' })
    mountForm()

    fillValidForm()
    cy.findByRole('button', { name: 'Create Account' }).click()

    cy.findByTestId('sign-up-pending-text').should('exist')
    cy.findByTestId('sign-up-created-text').should('not.exist')
  })

  it('validates required fields, username format and matching passwords before submitting', () => {
    userRepository.signUp = cy.stub().as('signUp')
    mountForm()

    cy.get('#username').type('not valid!')
    cy.get('#password').type('Str0ngPassw0rd')
    cy.get('#confirmPassword').type('different')
    cy.findByTestId('termsAcceptedCheckbox').check()
    cy.findByRole('button', { name: 'Create Account' }).click()

    cy.findByText('Username is invalid.').should('exist')
    cy.findByText('Given Name is required.').should('exist')
    cy.findByText('Family Name is required.').should('exist')
    cy.findByText('Email is required.').should('exist')
    cy.findByText('Passwords do not match.').should('exist')
    cy.get('@signUp').should('not.have.been.called')
  })

  it('shows field errors returned by the server next to the matching fields', () => {
    userRepository.signUp = cy.stub().rejects(
      new SignUpError('The provided fields are invalid for signing up a new user.', {
        username: 'This username is already taken.',
        password: 'Your password must be at least 10 characters.'
      })
    )
    mountForm()

    fillValidForm()
    cy.findByRole('button', { name: 'Create Account' }).click()

    cy.contains('The provided fields are invalid for signing up a new user.').should('exist')
    cy.findByText('This username is already taken.').should('exist')
    cy.findByText('Your password must be at least 10 characters.').should('exist')
    cy.get('#username').should('have.class', 'is-invalid')
  })

  it('disables the submit button until the terms of use are accepted', () => {
    userRepository.signUp = cy.stub()
    mountForm()

    cy.findByRole('button', { name: 'Create Account' }).should('be.disabled')
    cy.findByTestId('termsAcceptedCheckbox').check()
    cy.findByRole('button', { name: 'Create Account' }).should('not.be.disabled')
  })

  it('shows an error when the terms of use cannot be loaded', () => {
    dataverseInfoRepository.getTermsOfUse = cy.stub().rejects(new Error('boom'))
    userRepository.signUp = cy.stub()
    mountForm()

    cy.findByTestId('builtin-sign-up-form').should('not.exist')
  })
})
