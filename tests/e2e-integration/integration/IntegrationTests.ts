import { ApiConfig } from '@IQSS/dataverse-client-javascript/dist/core'

export class IntegrationTests {
  static setup() {
    const VITE_DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''
    ApiConfig.init(`${VITE_DATAVERSE_BACKEND_URL}/api/v1`)
  }

  static login() {
    return cy.loginAsAdmin() // TODO - Replace with an ajax call to the API
  }
}
