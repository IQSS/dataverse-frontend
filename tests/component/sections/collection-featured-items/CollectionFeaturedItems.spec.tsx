import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

const collectionRepository = {} as CollectionRepository
const collection = CollectionMother.create({ name: 'Collection Name' })

describe('Collection Featured Items page', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
  })
})
