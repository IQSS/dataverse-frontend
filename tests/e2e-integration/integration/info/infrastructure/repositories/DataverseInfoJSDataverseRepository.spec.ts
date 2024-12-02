import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DataverseInfoJSDataverseRepository } from '../../../../../../src/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { TestsUtils } from '../../../../shared/TestsUtils'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DATAVERSE_BACKEND_URL, OIDC_AUTH_CONFIG } from '@/config'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('DataverseInfo JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('gets the dataverse version number', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
    const dataverseVersion = await dataverseInfoRepository.getVersion()

    expect(dataverseVersion).to.exist
  })
})
