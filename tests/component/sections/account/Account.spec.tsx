import { Account } from '../../../../src/sections/account/Account'
import { AccountHelper } from '../../../../src/sections/account/AccountHelper'
import { UserJSDataverseRepository } from '../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'

describe('Account', () => {
  it('should render the component', () => {
    cy.mountAuthenticated(
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={new UserJSDataverseRepository()}
        collectionRepository={new CollectionMockRepository()}
      />
    )

    cy.get('h1').should('contain.text', 'Account')
    cy.findByRole('tab', { name: 'My Data' }).should('exist').and('be.enabled')
    cy.findByRole('tab', { name: 'Notifications' }).should('exist').and('be.disabled')
    cy.findByRole('tab', { name: 'Account Information' }).should('exist')
    cy.findByRole('tab', { name: 'API Token' }).should('be.enabled')
  })

  it('clicks on the Account Information tab', () => {
    cy.mountAuthenticated(
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={new UserJSDataverseRepository()}
      />
    )

    cy.findByRole('tab', { name: 'Account Information' }).click()
  })
})
