import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { User } from '@/users/domain/models/User'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'

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
    const expectedUser: User = {
      displayName: 'Dataverse Admin',
      persistentId: 'dataverseAdmin',
      firstName: 'Dataverse',
      lastName: 'Admin',
      email: 'dataverse@mailinator.com',
      affiliation: 'Dataverse.org',
      identifier: 'dataverseAdmin',
      superuser: true
    }

    const user = await userRepository.getAuthenticated()

    expect(user.displayName).to.equal(expectedUser.displayName)
    expect(user.persistentId).to.equal(expectedUser.persistentId)
    expect(user.firstName).to.equal(expectedUser.firstName)
    expect(user.lastName).to.equal(expectedUser.lastName)
    expect(user.email).to.equal(expectedUser.email)
    expect(user.affiliation).to.equal(expectedUser.affiliation)
    expect(user.identifier).to.equal(expectedUser.identifier)
    expect(user.superuser).to.equal(expectedUser.superuser)
  })
})
