import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiHelper } from './DataverseApiHelper'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { DatasetHelper } from './datasets/DatasetHelper'
import { requireAppConfig } from '@/config'

export class TestsUtils {
  static get DATAVERSE_BACKEND_URL(): string {
    return requireAppConfig().backendUrl
  }
  static readonly USER_EMAIL = 'dataverse@mailinator.com'
  static readonly USER_PASSWORD = 'admin1'
  static readonly USER_USERNAME = 'dataverseAdmin'

  static async setup(bearerToken: string) {
    const cfg = requireAppConfig()
    ApiConfig.init(
      `${this.DATAVERSE_BACKEND_URL}/api/v1`,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      `${cfg.oidc.localStorageKeyPrefix}token`
    )

    await DataverseApiHelper.setup(bearerToken)
  }

  static login() {
    return cy.login()
  }

  static logout() {
    return cy.logout()
  }

  static wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  static async waitForNoLocks(persistentId: string, maxRetries = 20, delay = 1000): Promise<void> {
    await this.checkForLocks(persistentId, maxRetries, delay)
  }

  private static async checkForLocks(
    persistentId: string,
    maxRetries: number,
    delay: number
  ): Promise<void> {
    let retry = 0

    while (retry < maxRetries) {
      const response = await DatasetHelper.getLocks(persistentId)
      console.log('Checking locks: ' + JSON.stringify(response))

      // The response will have a single key if there are no locks
      if (Object.keys(response).length === 1) {
        console.log('No locks found.')
        return
      }

      retry++
      await this.wait(delay)
    }

    console.log('Max retries reached.')
    throw new Error('Max retries reached.')
  }

  static enterCredentialsInKeycloak(username?: string, password?: string) {
    cy.get('#username').type(username ?? this.USER_USERNAME)
    cy.get('#password').type(password ?? this.USER_PASSWORD)
    cy.get('#kc-login').click()
  }

  static finishSignUp() {
    cy.get('#termsAccepted').check({ force: true })

    cy.findByRole('button', { name: 'Create Account' }).click()
  }
}
