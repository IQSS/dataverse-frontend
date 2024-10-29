import { Account } from '../../../../src/sections/account/Account'
import { AccountHelper } from '../../../../src/sections/account/AccountHelper'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
const collectionRepository = {} as CollectionRepository
const collection = CollectionMother.create({ name: 'Root' })

describe('Account', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
  })
  it('should render the correct breadcrumbs', () => {
    cy.mountAuthenticated(
      <Account
        collectionRepository={collectionRepository}
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Account')
      .should('have.class', 'active')
  })
})
