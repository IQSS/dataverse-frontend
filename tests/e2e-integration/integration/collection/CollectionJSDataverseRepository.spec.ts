import { TestsUtils } from '../../shared/TestsUtils'
import { CollectionHelper } from '../../shared/collection/CollectionHelper'
import { CollectionJSDataverseRepository } from '../../../../src/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { expect } from 'chai'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Collection } from '../../../../src/collection/domain/models/Collection'

const collectionRepository = new CollectionJSDataverseRepository()
const collectionExpected: Collection = {
  id: 'new-collection',
  name: 'Scientific Research',
  description: 'We do all the science.',
  isReleased: false,
  affiliation: 'Scientific Research University',
  hierarchy: new UpwardHierarchyNode(
    'Scientific Research',
    DvObjectType.COLLECTION,
    'new-collection',
    undefined,
    undefined,
    undefined,
    new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined, undefined, true)
  ),
  inputLevels: undefined
}
describe('Collection JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => {
    TestsUtils.login()
  })

  it('gets the collection by id', async () => {
    const collectionResponse = await CollectionHelper.create('new-collection')
    console.log('collectionResponse', collectionResponse.id)
    await collectionRepository.getById(collectionResponse.id).then((collection) => {
      if (!collection) {
        throw new Error('Collection not found')
      }

      expect(collection).to.deep.equal(collectionExpected)
    })
  })
  it('publishes the collection', async () => {
    const timestamp = new Date().valueOf()
    const uniqueCollectionId = `test-publish-collection-${timestamp}`
    const collectionResponse = await CollectionHelper.create(uniqueCollectionId)
    await collectionRepository.publish(collectionResponse.id)
    await collectionRepository.getById(collectionResponse.id).then((collection) => {
      if (!collection) {
        throw new Error('Collection not found')
      }

      expect(collection.isReleased).to.deep.equal(true)
    })
  })
})
