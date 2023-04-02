import { LoginForm } from '../../../../../src/sections/login-form/LoginForm'

//import { InputField } from '../../../../../src/sections/input-field/InputField'
//import { SubmitButton } from './SubmitButton'

describe('LoginForm', () => {
  it('submits form successfully', () => {
    const onLogin = cy.stub().as('onLogin')
    cy.mount(<LoginForm onLogin={onLogin} />)
    cy.get('[data-testid="username"]').type('johndoe')
    cy.get('[data-testid="password"]').type('password')
    cy.get('[data-testid="submitButton"]').click()
    cy.wrap(onLogin).should('be.calledWith', { username: 'johndoe', password: 'password' })
  })

  it('displays required error message when submitting empty form', () => {
    const onLogin = cy.stub().as('onLogin')
    cy.mount(<LoginForm onLogin={onLogin} />)
    cy.get('[data-testid="submitButton"]').click()
    cy.get('[data-testid="usernameRequiredMessage"]').should('be.visible')
    cy.get('[data-testid="passwordRequiredMessage"]').should('be.visible')
    cy.wrap(onLogin).should('not.be.called')
  })

  it('displays custom error message', () => {
    const onLogin = cy.stub().as('onLogin')
    cy.mount(<LoginForm onLogin={onLogin} />)
    const errorMessage = 'Invalid username or password'
    cy.mount(<LoginForm onLogin={onLogin} errorMessage={errorMessage} />)
    cy.get('[name="username"]').type('johndoe')
    cy.get('[name="password"]').type('wrongpassword')
    cy.get('[data-testid="submitButton"]').click()
    cy.get('.text-red-500').should('have.text', errorMessage)
  })

  it('updates InputFields when typed', () => {
    const onLogin = cy.stub().as('onLogin')
    cy.mount(<LoginForm onLogin={onLogin} />)
    const username = 'johndoe'
    const password = 'password'
    cy.get('[name="username"]').type(username)
    cy.get('[name="password"]').type(password)
    cy.get('[name="username"]').should('have.value', username)
    cy.get('[name="password"]').should('have.value', password)
  })

  it('clicks SubmitButton successfully', () => {
    const onLogin = cy.stub().as('onLogin')
    cy.mount(<LoginForm onLogin={onLogin} />)
    cy.get('[name="username"]').type('johndoe')
    cy.get('[name="password"]').type('password')
    cy.get('[data-testid="submitButton"]').click()
    cy.wrap(onLogin).should('be.calledWith', { username: 'johndoe', password: 'password' })
  })
})
