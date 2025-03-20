import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import Homepage from '@/sections/homepage/Homepage'

const testCollectionRepository = {} as CollectionRepository
const testCollection = CollectionMother.create({ name: 'Collection Name' })

const testCustomFeaturedItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  displayOrder: 1
})

describe('Homepage', () => {
  beforeEach(() => {
    cy.viewport(1440, 900)

    testCollectionRepository.getById = cy.stub().resolves(testCollection)
    testCollectionRepository.getFeaturedItems = cy.stub().resolves([testCustomFeaturedItemOne])
  })

  it('shows app loader while loading root collection', () => {
    cy.customMount(<Homepage collectionRepository={testCollectionRepository} />)
    cy.findByTestId('app-loader').should('exist')
  })

  it('shows featured items if the root collection has any', () => {
    cy.customMount(<Homepage collectionRepository={testCollectionRepository} />)
    cy.findByTestId('featured-items').should('exist')
  })

  it('does not show featured items if the root collection has none', () => {
    testCollectionRepository.getFeaturedItems = cy.stub().resolves([])
    cy.customMount(<Homepage collectionRepository={testCollectionRepository} />)
    cy.findByTestId('featured-items').should('not.exist')
  })
})
