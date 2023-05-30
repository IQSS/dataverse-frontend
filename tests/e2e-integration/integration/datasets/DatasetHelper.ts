import { IntegrationTestsUtils } from '../IntegrationTestsUtils'
import axios from 'axios'
import newDatasetDataJson from '../../fixtures/dataset-finch1.json'

export interface DatasetResponse {
  persistentId: string
  id: string
}

export class DatasetHelper {
  static API_TOKEN = 'a615bef3-b2db-4ea1-b90e-74e4de1156d9' // TODO - Replace hardcoded token
  static API_URL = `${IntegrationTestsUtils.DATAVERSE_BACKEND_URL}/api`

  static async createDataset(newDatasetData: typeof newDatasetDataJson): Promise<DatasetResponse> {
    const headers = {
      'X-Dataverse-key': this.API_TOKEN,
      'Content-Type': 'application/json'
    }

    return axios
      .post(`${this.API_URL}/dataverses/root/datasets`, newDatasetData, { headers })
      .then(
        (response: { data: { data: { persistentId: string; id: string } } }) =>
          response.data.data as DatasetResponse
      )
  }

  static async publishDataset(persistentId: string): Promise<{ status: string }> {
    const headers = {
      'X-Dataverse-key': this.API_TOKEN,
      'Content-Type': 'application/json'
    }

    return axios
      .post(
        `${this.API_URL}/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major`,
        {},
        { headers }
      )
      .then((response) => response.data as { status: string })
  }

  static async createPrivateUrl(id: string): Promise<{ token: string }> {
    const headers = {
      'X-Dataverse-key': this.API_TOKEN,
      'Content-Type': 'application/json'
    }

    return axios
      .post(`${this.API_URL}/datasets/${id}/privateUrl`, {}, { headers })
      .then(
        (response: { data: { data: { token: string } } }) => response.data.data as { token: string }
      )
  }
}
