import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '../../../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { TestsUtils } from '../../../../shared/TestsUtils'
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
