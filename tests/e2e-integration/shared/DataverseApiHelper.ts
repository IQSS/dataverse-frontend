import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { TestsUtils } from './TestsUtils'

export class DataverseApiHelper {
  private static API_TOKEN = ''
  private static API_URL = ''

  static async setup(bearerToken: string) {
    console.log(
      '%cSetting up Dataverse API...',
      'background: blue; color: white; padding: 2px; border-radius: 4px;'
    )

    this.API_URL = `${TestsUtils.DATAVERSE_BACKEND_URL}/api/v1`

    try {
      await this.setLoggedInUserAsSuperUser()

      const createdApiToken = await this.createAndGetApiTokenWithBearerToken(bearerToken)

      this.API_TOKEN = createdApiToken

      void this.request('/admin/settings/:MaxEmbargoDurationInMonths', 'PUT', -1)
      void this.request(
        '/admin/settings/:AnonymizedFieldTypeNames',
        'PUT',
        'author, datasetContact, contributor, depositor, grantNumber, publication'
      )
    } catch (error) {
      console.log(
        '%cError setting up Dataverse API',
        'background: red; color: white; padding: 2px; border-radius: 4px;'
      )
      console.log(error)
    } finally {
      console.log(
        '%cDataverse API setup complete',
        'background: green; color: white; padding: 2px; border-radius: 4px;'
      )
      console.group('Dataverse API setup results')
      console.log('API URL:', this.API_URL)
      console.log('API Token:', this.API_TOKEN)
      console.groupEnd()
    }
  }

  static async request<T>(
    url: string,
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    contentType = 'application/json'
  ): Promise<T> {
    console.log(
      '%cMaking request...',
      'background: violet; color: white; padding: 2px; border-radius: 4px;'
    )

    const isFormData = contentType === 'multipart/form-data'

    const config: AxiosRequestConfig = {
      url: `${this.API_URL}${url}`,
      method: method,
      headers: {
        'X-Dataverse-key': this.API_TOKEN,
        'Content-Type': contentType
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: isFormData ? this.createFormData(data) : data,
      withCredentials: false
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

  static async createAndGetApiTokenWithBearerToken(bearerToken: string): Promise<string> {
    console.log(
      '%cCreating test API key...',
      'background: blue; color: white; padding: 2px; border-radius: 4px;'
    )

    const { data }: { data: { data: { message: string } } } = await axios.post(
      `${this.API_URL}/users/token/recreate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        },
        withCredentials: false
      }
    )

    const messageParts = data.data.message.split(' ')

    const apiKey = messageParts[5]

    return apiKey
  }

  static async setLoggedInUserAsSuperUser(): Promise<void> {
    const API_ALLOW_TOKEN_LOOKUP_ENDPOINT = '/admin/settings/:AllowApiTokenLookupViaApi'
    const API_KEY_USER_ENDPOINT = '/builtin-users/dataverseAdmin/api-token'
    const API_KEY_USER_PASSWORD = 'admin1'

    // Get API key from superuser dataverseAdmin
    await axios.put(`${this.API_URL}${API_ALLOW_TOKEN_LOOKUP_ENDPOINT}`, 'true')

    // Get API key from superuser dataverseAdmin
    const {
      data: {
        data: { message: superuserApiToken }
      }
    }: AxiosResponse<{ data: { message: string } }> = await axios.get(
      `${this.API_URL}${API_KEY_USER_ENDPOINT}?password=${API_KEY_USER_PASSWORD}`
    )

    // Set superuser status for the user authenticated via OIDC
    await axios.put(`${this.API_URL}/admin/superuser/admin`, 'true', {
      headers: {
        'X-Dataverse-key': superuserApiToken,
        'Content-Type': 'application/json'
      }
    })
  }
}
