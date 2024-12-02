import { TestsUtils } from '../../shared/TestsUtils'
import { CollectionHelper } from '../../shared/collection/CollectionHelper'
import { CollectionJSDataverseRepository } from '../../../../src/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { expect } from 'chai'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Collection } from '../../../../src/collection/domain/models/Collection'
import { DATAVERSE_BACKEND_URL, OIDC_AUTH_CONFIG } from '@/config'
import {
  ApiConfig,
  DataverseApiAuthMechanism
} from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

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
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('gets the collection by id', async () => {
    const collectionResponse = await CollectionHelper.create('new-collection')

    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

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

    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    await collectionRepository.publish(collectionResponse.id)
    await collectionRepository.getById(collectionResponse.id).then((collection) => {
      if (!collection) {
        throw new Error('Collection not found')
      }

      expect(collection.isReleased).to.deep.equal(true)
    })
  })
})
