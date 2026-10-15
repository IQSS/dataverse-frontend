import { initAppConfig, type AppConfigInput } from '@/config'
import { applyTestAppConfig } from '../support/bootstrapAppConfig'

describe('initAppConfig', () => {
  let testConfig: AppConfigInput

  beforeEach(() => {
    applyTestAppConfig()
    testConfig = { ...(window.__APP_CONFIG__ as AppConfigInput) }
  })

  afterEach(() => {
    applyTestAppConfig()
  })

  it('keeps an explicitly configured backendUrl', () => {
    window.__APP_CONFIG__ = { ...testConfig, backendUrl: 'https://demo.dataverse.org' }

    const result = initAppConfig()

    expect(result.ok).to.equal(true)
    expect(result.ok && result.value.backendUrl).to.equal('https://demo.dataverse.org')
  })

  it('defaults backendUrl to the current origin when it is omitted', () => {
    const configWithoutBackendUrl = { ...testConfig }
    delete configWithoutBackendUrl.backendUrl
    window.__APP_CONFIG__ = configWithoutBackendUrl

    const result = initAppConfig()

    expect(result.ok).to.equal(true)
    expect(result.ok && result.value.backendUrl).to.equal(window.location.origin)
  })

  it('defaults backendUrl to the current origin when it is empty', () => {
    window.__APP_CONFIG__ = { ...testConfig, backendUrl: '' }

    const result = initAppConfig()

    expect(result.ok).to.equal(true)
    expect(result.ok && result.value.backendUrl).to.equal(window.location.origin)
  })

  it('rejects a backendUrl that is not a valid URL', () => {
    window.__APP_CONFIG__ = { ...testConfig, backendUrl: 'not-a-url' }

    const result = initAppConfig()

    expect(result.ok).to.equal(false)
  })
})
