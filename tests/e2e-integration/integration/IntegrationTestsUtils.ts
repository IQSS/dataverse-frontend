import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiHelper } from './DataverseApiHelper'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'

export class IntegrationTestsUtils {
  static readonly DATAVERSE_BACKEND_URL =
    (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''

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
}
