import { EditCollectionDropdown } from '@/sections/collection/edit-collection-dropdown/EditCollectionDropdown'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

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
  describe('dropdown header', () => {
    it('shows the collection name and id, but not affiliaton if not present', () => {
      cy.mountAuthenticated(<EditCollectionDropdown collection={rootCollection} />)

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
      cy.mountAuthenticated(<EditCollectionDropdown collection={rootCollectionWithAffiliation} />)

      openDropdown()

      cy.findByText(rootCollectionWithAffiliation.name).should('exist')
      cy.findByText(`(${TEST_AFFILIATION})`).should('exist')
      cy.findByText(rootCollectionWithAffiliation.id).should('exist')
    })
  })

  it('clicks the general info button', () => {
    cy.mountAuthenticated(<EditCollectionDropdown collection={rootCollection} />)

    openDropdown()

    cy.findByRole('button', { name: /General Information/i }).click()
  })

  it('clicks the featured items button', () => {
    cy.mountAuthenticated(<EditCollectionDropdown collection={rootCollection} />)

    openDropdown()

    cy.findByRole('button', { name: /Featured Items/i }).click()
  })
})
