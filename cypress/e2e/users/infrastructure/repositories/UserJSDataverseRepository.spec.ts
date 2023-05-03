import { UserJSDataverseRepository } from '../../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('User JSDataverse Repository', () => {
  it('gets the authenticated user', async () => {
    const userRepository = new UserJSDataverseRepository()
    const user = await userRepository.getAuthenticated()

    expect(user).to.exist
  })

  it('removes the authenticated user', async () => {
    const userRepository = new UserJSDataverseRepository()
    const user = await userRepository.removeAuthenticated()

    await expect(user).to.be.fulfilled
  })
})
