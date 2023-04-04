describe('LoginForm Story Test', () => {
  it('Should call login on button  submit', () => {
    cy.visit('/iframe.html?id=pages-login-form--basic')
    cy.get('[data-testid="login-test"]').should('exist')
    const onLogin = cy.stub().as('onLogin')
    cy.get('[data-testid="username"]').type('johndoe')
    cy.get('[data-testid="password"]').type('password')
    cy.get('[data-testid="submitButton"]').click()
    // This doesn't work - how do we test that the login method was called, when we can't setup a mock for it?
    cy.wrap(onLogin).should('be.calledWith', { username: 'johndoe', password: 'password' })
  })
})
