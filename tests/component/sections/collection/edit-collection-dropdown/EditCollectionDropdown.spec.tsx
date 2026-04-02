import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { EditCollectionDropdown } from '@/sections/collection/edit-collection-dropdown/EditCollectionDropdown'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

const collectionRepository = {} as CollectionRepository

const PARENT_COLLECTION_ID = 'root'
const PARENT_COLLECTION_NAME = 'Root'
const PARENT_COLLECTION_CONTACT_EMAIL = 'root@test.com'

const rootCollection = CollectionMother.create({
  id: PARENT_COLLECTION_ID,
  name: PARENT_COLLECTION_NAME,
  affiliation: undefined,
  contacts: [{ email: PARENT_COLLECTION_CONTACT_EMAIL, displayOrder: 0 }],
  hierarchy: UpwardHierarchyNodeMother.createCollection({
    id: PARENT_COLLECTION_ID,
    name: PARENT_COLLECTION_NAME
  }),
  isFacetRoot: true,
  isMetadataBlockRoot: true
})

const openDropdown = () => cy.findByRole('button', { name: /Edit/i }).click()

describe('EditCollectionDropdown', () => {
  beforeEach(() => {
    collectionRepository.delete = cy.stub().resolves(undefined)
  })
  describe('dropdown header', () => {
    it('shows the collection name and id, but not affiliaton if not present', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={rootCollection}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={false}
        />
      )

      openDropdown()

      cy.findByText(rootCollection.name).should('exist')
      cy.findByText(rootCollection.id).should('exist')
    })

    it('shows the collection name, id, and also affiliation if present', () => {
      const TEST_AFFILIATION = 'Test Affiliation'
      const rootCollectionWithAffiliation = CollectionMother.create({
        id: PARENT_COLLECTION_ID,
        name: PARENT_COLLECTION_NAME,
        contacts: [{ email: PARENT_COLLECTION_CONTACT_EMAIL, displayOrder: 0 }],
        affiliation: TEST_AFFILIATION,
        hierarchy: UpwardHierarchyNodeMother.createCollection({
          id: PARENT_COLLECTION_ID,
          name: PARENT_COLLECTION_NAME
        }),
        isFacetRoot: true,
        isMetadataBlockRoot: true
      })
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={rootCollectionWithAffiliation}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={false}
        />
      )

      openDropdown()

      cy.findByText(rootCollectionWithAffiliation.name).should('exist')
      cy.findByText(`(${TEST_AFFILIATION})`).should('exist')
      cy.findByText(rootCollectionWithAffiliation.id).should('exist')
    })
  })

  it('shows the General Information button with the correct link', () => {
    cy.mountAuthenticated(
      <EditCollectionDropdown
        collection={rootCollection}
        collectionRepository={collectionRepository}
        canUserDeleteCollection={false}
      />
    )

    openDropdown()

    cy.findByRole('link', { name: 'General Information' }).should(
      'have.attr',
      'href',
      '/collections/root/edit'
    )
  })

  it('shows the Featured Items button with the correct link', () => {
    cy.mountAuthenticated(
      <EditCollectionDropdown
        collection={rootCollection}
        collectionRepository={collectionRepository}
        canUserDeleteCollection={false}
      />
    )

    openDropdown()

    cy.findByRole('link', { name: 'Featured Items' }).should(
      'have.attr',
      'href',
      '/collections/root/edit-featured-items'
    )
  })

  it('shows the not implemented collection edit options', () => {
    cy.mountAuthenticated(
      <EditCollectionDropdown
        collection={rootCollection}
        collectionRepository={collectionRepository}
        canUserDeleteCollection={false}
      />
    )

    openDropdown()

    cy.findByRole('button', { name: 'Theme + Widgets' }).should('exist')
    cy.findByRole('button', { name: 'Permissions' }).should('exist')
    cy.findByRole('button', { name: 'Groups' }).should('exist')
    cy.findByRole('button', { name: 'Dataset Guestbooks' }).should('exist')
  })

  it('shows the not implemented modal when a new edit option is clicked', () => {
    cy.mountAuthenticated(
      <EditCollectionDropdown
        collection={rootCollection}
        collectionRepository={collectionRepository}
        canUserDeleteCollection={false}
      />
    )

    openDropdown()

    cy.findByRole('button', { name: 'Permissions' }).click()

    cy.findByText('Not Implemented').should('exist')
    cy.findByText('This feature is not implemented yet in SPA.').should('exist')
  })

  it('shows the Dataset Templates button with the correct link', () => {
    cy.mountAuthenticated(
      <EditCollectionDropdown
        collection={rootCollection}
        collectionRepository={collectionRepository}
        canUserDeleteCollection={false}
      />
    )

    openDropdown()

    cy.findByRole('link', { name: 'Dataset Templates' }).should(
      'have.attr',
      'href',
      '/root/templates'
    )
  })

  describe('delete button', () => {
    it('shows the delete button if user can delete collection, collection is not root and collection has no data', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={CollectionMother.createSubCollectionWithNoChildObjects()}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).should('exist')
    })

    it('does not show the delete button if user cannot delete collection', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={CollectionMother.createSubCollectionWithNoChildObjects()}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={false}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).should('not.exist')
    })

    it('does not show the delete button if collection is root', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={rootCollection}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).should('not.exist')
    })

    it('opens and close the delete collection confirmation modal', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={CollectionMother.createSubCollectionWithNoChildObjects()}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Cancel/i }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('closes the modal and shows toast success message when delete collection succeeds', () => {
      collectionRepository.delete = cy
        .stub()
        .as('deleteStub')
        .callsFake(() => {
          return Cypress.Promise.delay(200).then(() => undefined)
        })

      const testCollection = CollectionMother.createSubCollectionWithNoChildObjects()

      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={testCollection}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      // The loading spinner inside delete button
      cy.findByRole('status').should('exist')

      // The dialog can't be closed while deleting when pressing escape
      cy.get('body').type('{esc}')
      cy.findByRole('dialog').should('exist')

      cy.get('@deleteStub').then((spy) => {
        const deleteSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const deletedCollectionId = deleteSpy.getCall(0).args[0] as string

        expect(deletedCollectionId).to.equal(testCollection.id)
        cy.findByRole('dialog', { timeout: 10_000 }).should('not.exist')
        cy.findByText(/Your collection has been deleted./, { timeout: 10_000 }).should('exist')
      })
    })

    it('shows the js-dataverse WriteError message if delete collection fails with a js-dataverse WriteError', () => {
      collectionRepository.delete = cy
        .stub()
        .rejects(new WriteError('Testing delete error message.'))

      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={CollectionMother.createSubCollectionWithNoChildObjects()}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      cy.findByText('Testing delete error message.').should('exist')
    })

    it('shows the default error message if delete collection fails with not a js-dataverse WriteError', () => {
      collectionRepository.delete = cy.stub().rejects('some error')

      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={CollectionMother.createSubCollectionWithNoChildObjects()}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={true}
        />
      )

      openDropdown()

      cy.findByRole('button', { name: /Delete Collection/i }).click()
      cy.findByRole('dialog').should('exist')

      cy.findByRole('button', { name: /Delete/i }).click()

      cy.findByText('Something went wrong deleting the collection. Try again later.').should(
        'exist'
      )
    })
  })

  describe('DatasetTemplates', () => {
    it('does not render Dataset Templates link when dropdown is closed', () => {
      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={rootCollection}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={false}
        />
      )

      cy.findByRole('link', { name: 'Dataset Templates' }).should('not.exist')
    })

    it('updates Dataset Templates link when collection id changes', () => {
      const anotherCollection = CollectionMother.create({
        id: 'science',
        name: 'Science',
        contacts: [{ email: 'science@test.com', displayOrder: 0 }],
        hierarchy: UpwardHierarchyNodeMother.createCollection({
          id: 'science',
          name: 'Science'
        }),
        isFacetRoot: true,
        isMetadataBlockRoot: true
      })

      cy.mountAuthenticated(
        <EditCollectionDropdown
          collection={anotherCollection}
          collectionRepository={collectionRepository}
          canUserDeleteCollection={false}
        />
      )

      openDropdown()

      cy.findByRole('link', { name: 'Dataset Templates' }).should(
        'have.attr',
        'href',
        '/science/templates'
      )
    })
  })
})
