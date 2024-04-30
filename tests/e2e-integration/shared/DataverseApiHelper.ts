import axios, { AxiosRequestConfig } from 'axios'
import { TestsUtils } from './TestsUtils'

export class DataverseApiHelper {
  private static API_TOKEN = ''
  private static API_URL = ''

  static setup() {
    this.API_URL = `${TestsUtils.DATAVERSE_BACKEND_URL}/api`
    // TODO - Replace with an ajax call to the API
    cy.getApiToken().then((token) => {
      this.API_TOKEN = token
    })
    void this.request('/admin/settings/:MaxEmbargoDurationInMonths', 'PUT', -1)
    void this.request(
      '/admin/settings/:AnonymizedFieldTypeNames',
      'PUT',
      'author, datasetContact, contributor, depositor, grantNumber, publication'
    )
    // In case a previous test run has left some orphans, clear them out
    cy.request({
      url: `${this.API_URL}/admin/index/clear-orphans?sync=true`,
      method: 'GET',
      headers: {
        'X-Dataverse-key': this.API_TOKEN
      }
    })
  }

  static async request<T>(
    url: string,
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    contentType = 'application/json'
  ): Promise<T> {
    const isFormData = contentType === 'multipart/form-data'
    const config: AxiosRequestConfig = {
      url: `${this.API_URL}${url}`,
      method: method,
      headers: {
        'X-Dataverse-key': this.API_TOKEN,
        'Content-Type': contentType
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: isFormData ? this.createFormData(data) : data
    }

    const response: { data: { data: T } } = await axios(config)
    return response.data.data
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createFormData(data: any) {
    const formData = new FormData()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const key in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (data[key] instanceof File) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          formData.append(key, data[key], data[key].name)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          formData.append(key, data[key])
        }
      }
    }

    return formData
  }
}
