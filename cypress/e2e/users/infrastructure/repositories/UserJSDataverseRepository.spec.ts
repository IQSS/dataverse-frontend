import { UserJSDataverseRepository } from '../../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ApiConfig } from 'js-dataverse/dist/core'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('User JSDataverse Repository', () => {
  const VITE_DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''
  ApiConfig.init(`${VITE_DATAVERSE_BACKEND_URL}/api/v1`)

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
