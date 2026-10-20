import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { SignUpError } from '@/users/domain/models/SignUpError'
import { BuiltinSignUpForm } from '@/sections/sign-up/builtin-sign-up-form/BuiltinSignUpForm'
import { WithRepositories } from '@tests/component/WithRepositories'
import { applyTestAppConfig } from '@tests/support/bootstrapAppConfig'
import { SIGN_UP_DRAFT_STORAGE_KEY } from '@/sections/sign-up/builtin-sign-up-form/useOrcidSignUp'

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

const mountForm = (logIn: IAuthContext['logIn'] = () => {}, initialEntries?: string[]) =>
  cy.customMount(
    <WithRepositories userRepository={userRepository}>
      <AuthContext.Provider value={authContextValue(logIn)}>
        <BuiltinSignUpForm dataverseInfoRepository={dataverseInfoRepository} />
      </AuthContext.Provider>
    </WithRepositories>,
    initialEntries
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
      termsAccepted: true,
      orcidToken: undefined
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

  describe('ORCID', () => {
    const orcidUrl = 'https://orcid.org/0000-0002-1825-0097'
    const defaultSignUpWithOrcidEnabled = Cypress.env('signUpWithOrcidEnabled') as boolean

    beforeEach(() => {
      sessionStorage.removeItem(SIGN_UP_DRAFT_STORAGE_KEY)
    })

    afterEach(() => {
      Cypress.env('signUpWithOrcidEnabled', defaultSignUpWithOrcidEnabled)
      applyTestAppConfig()
    })

    it('saves the draft without passwords and asks for the ORCID authorization URL', () => {
      userRepository.signUp = cy.stub()
      userRepository.getOrcidSignUpAuthorizationUrl = cy
        .stub()
        .as('getAuthorizationUrl')
        .resolves('#orcid-authorize')
      mountForm()

      cy.get('#username').type('alovelace')
      cy.get('#password').type('Str0ngPassw0rd')
      cy.findByTestId('connect-orcid-button').click()

      cy.get('@getAuthorizationUrl').should(
        'have.been.calledOnceWith',
        Cypress.sinon.match(/\/sign-up$/)
      )
      cy.window().then(() => {
        const draft = JSON.parse(
          sessionStorage.getItem(SIGN_UP_DRAFT_STORAGE_KEY) ?? '{}'
        ) as Record<string, unknown>
        expect(draft.username).to.equal('alovelace')
        expect(draft).not.to.have.property('password')
        expect(draft).not.to.have.property('confirmPassword')
      })
    })

    it('connects the ORCID iD on return, restores the draft, pre-fills empty fields and sends the orcidToken', () => {
      sessionStorage.setItem(
        SIGN_UP_DRAFT_STORAGE_KEY,
        JSON.stringify({ username: 'alovelace', lastName: 'Byron', termsAccepted: false })
      )
      userRepository.connectOrcidForSignUp = cy.stub().as('connectOrcid').resolves({
        orcid: orcidUrl,
        orcidToken: 'orcid-token',
        firstName: 'Ada',
        lastName: 'Lovelace',
        emailAddress: 'ada@example.edu'
      })
      userRepository.signUp = cy
        .stub()
        .as('signUp')
        .resolves({ status: 'created', identifier: '@alovelace' })
      mountForm(() => {}, ['/sign-up?code=orcid-code&state=orcid-state'])

      cy.get('@connectOrcid').should(
        'have.been.calledOnceWith',
        Cypress.sinon.match({ code: 'orcid-code', state: 'orcid-state' })
      )
      cy.findByTestId('orcid-connected').should('contain.text', orcidUrl)
      cy.get('#username').should('have.value', 'alovelace')
      cy.get('#firstName').should('have.value', 'Ada')
      cy.get('#lastName').should('have.value', 'Byron')
      cy.get('#emailAddress').should('have.value', 'ada@example.edu')

      cy.get('#password').type('Str0ngPassw0rd')
      cy.get('#confirmPassword').type('Str0ngPassw0rd')
      cy.findByTestId('termsAcceptedCheckbox').check()
      cy.findByRole('button', { name: 'Create Account' }).click()

      cy.get('@signUp').should(
        'have.been.calledOnceWith',
        Cypress.sinon.match({ username: 'alovelace', orcidToken: 'orcid-token' })
      )
    })

    it('removes the connected ORCID iD so it is not sent', () => {
      userRepository.connectOrcidForSignUp = cy
        .stub()
        .resolves({ orcid: orcidUrl, orcidToken: 'orcid-token' })
      mountForm(() => {}, ['/sign-up?code=orcid-code&state=orcid-state'])

      cy.findByTestId('orcid-connected').within(() => {
        cy.findByRole('button', { name: 'Remove' }).click()
      })

      cy.findByTestId('orcid-connected').should('not.exist')
      cy.findByTestId('connect-orcid-button').should('exist')
    })

    it('shows a message when the user cancels at ORCID', () => {
      userRepository.connectOrcidForSignUp = cy.stub().as('connectOrcid')
      mountForm(() => {}, ['/sign-up?error=access_denied'])

      cy.findByTestId('orcid-error').should('contain.text', 'was cancelled')
      cy.get('@connectOrcid').should('not.have.been.called')
    })

    it('shows the error when the ORCID iD is already linked to another account', () => {
      userRepository.connectOrcidForSignUp = cy
        .stub()
        .rejects(new SignUpError('This ORCID iD is already linked to another account.'))
      mountForm(() => {}, ['/sign-up?code=orcid-code&state=orcid-state'])

      cy.findByTestId('orcid-error').should(
        'have.text',
        'This ORCID iD is already linked to another account.'
      )
      cy.findByTestId('orcid-connected').should('not.exist')
    })

    it('shows an orcid field error returned when submitting', () => {
      userRepository.connectOrcidForSignUp = cy
        .stub()
        .resolves({ orcid: orcidUrl, orcidToken: 'expired-token' })
      userRepository.signUp = cy.stub().rejects(
        new SignUpError('The provided fields are invalid for signing up a new user.', {
          orcid: 'Your ORCID connection has expired. Please connect your ORCID iD again.'
        })
      )
      mountForm(() => {}, ['/sign-up?code=orcid-code&state=orcid-state'])
      cy.findByTestId('orcid-connected').should('exist')

      fillValidForm()
      cy.findByRole('button', { name: 'Create Account' }).click()

      cy.findByTestId('orcid-error').should('contain.text', 'has expired')
    })

    it('does not show the ORCID row when ORCID sign-up is disabled in the app config', () => {
      Cypress.env('signUpWithOrcidEnabled', false)
      applyTestAppConfig()
      userRepository.signUp = cy.stub()
      mountForm()

      cy.findByTestId('builtin-sign-up-form').should('exist')
      cy.findByTestId('connect-orcid-button').should('not.exist')
    })
  })
})
