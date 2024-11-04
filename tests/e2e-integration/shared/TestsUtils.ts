import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiHelper } from './DataverseApiHelper'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { DatasetHelper } from './datasets/DatasetHelper'
import { DATAVERSE_BACKEND_URL } from '../../../src/config'

export class TestsUtils {
  static readonly DATAVERSE_BACKEND_URL = DATAVERSE_BACKEND_URL

  static async setup(bearerToken: string) {
    ApiConfig.init(`${this.DATAVERSE_BACKEND_URL}/api/v1`, DataverseApiAuthMechanism.API_KEY)
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

  static enterCredentialsInKeycloak() {
    cy.get('#username').type('dataverse-admin@mailinator.com')
    cy.get('#password').type('admin')
    cy.get('#kc-login').click()
  }

  static getLocalStorageItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error)
      return null
    }
  }
}
