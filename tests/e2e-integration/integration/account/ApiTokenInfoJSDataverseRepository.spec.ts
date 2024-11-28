import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { UserJSDataverseRepository } from '../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'

import { TestsUtils } from '../../shared/TestsUtils'

chai.use(chaiAsPromised)
const expect = chai.expect

const userRepository = new UserJSDataverseRepository()

describe('API Token Info JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => TestsUtils.login())
  it('revoke the API token', async () => {
    await expect(userRepository.deleteApiToken()).to.be.fulfilled
  })

  it('create or recreate the API token and return the new token info', async () => {
    const recreatedTokenInfo = await userRepository.recreateApiToken()
    if (!recreatedTokenInfo) {
      throw new Error('Failed to recreate API token')
    }
    expect(recreatedTokenInfo).to.have.property('apiToken').that.is.a('string')
    expect(recreatedTokenInfo).to.have.property('expirationDate').that.is.a('Date')
  })

  it('fetch the current API token', async () => {
    const tokenInfo = await userRepository.getCurrentApiToken()
    if (!tokenInfo) {
      throw new Error('API Token not found')
    }
    expect(tokenInfo).to.have.property('apiToken').that.is.a('string')
    expect(tokenInfo).to.have.property('expirationDate').that.is.a('Date')
  })
})
