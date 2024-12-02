import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '../../../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { TestsUtils } from '../../../../shared/TestsUtils'
import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DATAVERSE_BACKEND_URL, OIDC_AUTH_CONFIG } from '@/config'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { User } from '@/users/domain/models/User'

chai.use(chaiAsPromised)
const expect = chai.expect

const userRepository = new UserJSDataverseRepository()
describe('User JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('gets the authenticated user', async () => {
    // Change the api config to use bearer token
    ApiConfig.init(
      `${DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
    )

    const expectedUser: Omit<User, 'persistentId'> = {
      displayName: 'Dataverse User',
      firstName: 'Dataverse',
      lastName: 'User',
      email: TestsUtils.USER_EMAIL,
      superuser: true,
      identifier: TestsUtils.USER_USERNAME
    }

    const user = await userRepository.getAuthenticated()

    expect(user.displayName).to.equal(expectedUser.displayName)
    expect(user.firstName).to.equal(expectedUser.firstName)
    expect(user.lastName).to.equal(expectedUser.lastName)
    expect(user.email).to.equal(expectedUser.email)
    expect(user.superuser).to.equal(expectedUser.superuser)
    expect(user.identifier).to.equal(expectedUser.identifier)
  })
})
