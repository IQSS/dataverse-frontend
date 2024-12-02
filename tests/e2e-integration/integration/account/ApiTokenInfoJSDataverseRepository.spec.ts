import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { TestsUtils } from '../../shared/TestsUtils'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { DATAVERSE_BACKEND_URL, OIDC_AUTH_CONFIG } from '@/config'

chai.use(chaiAsPromised)
const expect = chai.expect

const userRepository = new UserJSDataverseRepository()

describe('API Token Info JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('revoke the API token', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    await expect(userRepository.deleteApiToken()).to.be.fulfilled
  })

  it('create or recreate the API token and return the new token info', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    const recreatedTokenInfo = await userRepository.recreateApiToken()

    expect(recreatedTokenInfo).to.have.property('apiToken').that.is.a('string')
    expect(recreatedTokenInfo).to.have.property('expirationDate').that.is.a('Date')
  })

  it('fetch the current API token', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    const tokenInfo = await userRepository.getCurrentApiToken()

    expect(tokenInfo).to.have.property('apiToken').that.is.a('string')
    expect(tokenInfo).to.have.property('expirationDate').that.is.a('Date')
  })
})
