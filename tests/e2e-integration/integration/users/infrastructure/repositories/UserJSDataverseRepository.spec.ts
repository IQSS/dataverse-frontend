import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '../../../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { IntegrationTests } from '../../../IntegrationTests'

chai.use(chaiAsPromised)
const expect = chai.expect

IntegrationTests.setup()

const userRepository = new UserJSDataverseRepository()
describe('User JSDataverse Repository', () => {
  beforeEach(() => IntegrationTests.login())

  it('gets the authenticated user', async () => {
    const expectedUser = { name: 'Dataverse Admin' }
    const user = await userRepository.getAuthenticated()

    expect(user).to.deep.equal(expectedUser)
  })

  it('removes the authenticated user', async () => {
    const user = userRepository.removeAuthenticated()

    await expect(user).to.be.fulfilled
  })
})
