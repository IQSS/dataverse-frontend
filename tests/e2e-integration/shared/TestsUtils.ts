import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiHelper } from './DataverseApiHelper'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { UserJSDataverseRepository } from '../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { DatasetHelper } from './datasets/DatasetHelper'
import { BASE_URL } from '../../../src/config'

export class TestsUtils {
  static readonly DATAVERSE_BACKEND_URL = BASE_URL

  static setup() {
    ApiConfig.init(`${this.DATAVERSE_BACKEND_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)
    DataverseApiHelper.setup()
  }

  static login() {
    return cy.loginAsAdmin() // TODO - Replace with an ajax call to the API
  }

  static wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  static logout() {
    return new UserJSDataverseRepository().removeAuthenticated()
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
}
