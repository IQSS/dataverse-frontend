import { ApiTokenInfoJSDataverseRepository } from '../../../../../../src/api-token-info/infrastructure/ApiTokenInfoJSDataverseRepository'
import { TokenInfo } from '../../../../../../src/api-token-info/domain/models/TokenInfo'
//TODO: we need to change the fake call to the real one once we have the api working
const apiTokenRepository = new ApiTokenInfoJSDataverseRepository()
const tokenInfoExpected: TokenInfo = {
  apiToken: '142354345435eefrr',
  expirationDate: '2024-10-16'
}

describe('get api Token Repository', () => {
  it('should return the current api token', async () => {
    const tokenInfo = await apiTokenRepository.getCurrentApiToken()
    expect(tokenInfo).to.deep.equal(tokenInfoExpected)
  })

  it('should return a new api token', async () => {
    const tokenInfo = await apiTokenRepository.recreateApiToken()
    expect(tokenInfo).to.deep.equal(tokenInfo)
  })

  it('should delete the current api token', async () => {
    await apiTokenRepository.deleteApiToken()
  })
})
