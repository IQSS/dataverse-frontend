import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { MetadataBlockInfoJSDataverseRepository } from '../../../../src/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { TestsUtils } from '../../shared/TestsUtils'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DATAVERSE_BACKEND_URL, OIDC_AUTH_CONFIG } from '@/config'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

chai.use(chaiAsPromised)
const expect = chai.expect

const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
describe('Metadata Block Info JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('returns JSON in the  correct format', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    await metadataBlockInfoRepository.getByName('citation').then((metadataBlockInfo) => {
      if (!metadataBlockInfo) {
        throw new Error('Metadata Block Info not found')
      }
      expect(metadataBlockInfo['name']).to.equal('citation')
      expect(metadataBlockInfo['fields']).to.be.an('object')
      Object.keys(metadataBlockInfo['fields']).forEach((field) => {
        expect(metadataBlockInfo['fields'][field]).to.be.an('object')
        expect(metadataBlockInfo['fields'][field]['displayFormat']).to.be.a('string')
      })
    })
  })
})
