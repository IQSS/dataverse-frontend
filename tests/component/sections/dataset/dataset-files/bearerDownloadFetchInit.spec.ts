import { requireAppConfig } from '@/config'
import { bearerDownloadFetchInit } from '@/sections/dataset/dataset-files/bearerDownloadFetchInit'

describe('bearerDownloadFetchInit', () => {
  const tokenKey = `${requireAppConfig().oidc.localStorageKeyPrefix}token`

  afterEach(() => {
    localStorage.removeItem(tokenKey)
  })

  it('returns no request options when no bearer token is stored', () => {
    localStorage.removeItem(tokenKey)
    expect(bearerDownloadFetchInit()).to.equal(undefined)
  })

  it('attaches the stored bearer token as an Authorization header', () => {
    localStorage.setItem(tokenKey, JSON.stringify('abc123'))
    expect(bearerDownloadFetchInit()).to.deep.equal({
      headers: { Authorization: 'Bearer abc123' }
    })
  })
})
