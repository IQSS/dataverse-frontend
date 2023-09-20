import axios, { AxiosRequestConfig } from 'axios'
import { IntegrationTestsUtils } from './IntegrationTestsUtils'

export class DataverseApiHelper {
  private static API_TOKEN = ''
  private static API_URL = ''

  static setup() {
    this.API_URL = `${IntegrationTestsUtils.DATAVERSE_BACKEND_URL}/api`
    // TODO - Replace with an ajax call to the API
    cy.getApiToken().then((token) => {
      this.API_TOKEN = token
    })
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static async request<T>(
    url: string,
    method: string,
    data?: any,
    contentType?: string
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      url: `${this.API_URL}${url}`,
      method: method,
      headers: {
        'X-Dataverse-key': this.API_TOKEN,
        'Content-Type': contentType ? contentType : 'application/json'
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: data
    }

    const response: { data: { data: T } } = await axios(config)
    return response.data.data
  }
}
