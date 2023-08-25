import newDatasetData from '../../fixtures/dataset-finch1.json'
import { DataverseApiHelper } from '../DataverseApiHelper'

export interface DatasetResponse {
  persistentId: string
  id: string
  files?: DatasetFileResponse[]
}

export interface DatasetFileResponse {
  id: string
}

export class DatasetHelper extends DataverseApiHelper {
  static async create(): Promise<DatasetResponse> {
    return this.request<DatasetResponse>(`/dataverses/root/datasets`, 'POST', newDatasetData)
  }

  static async publish(persistentId: string): Promise<{ status: string }> {
    return this.request<{ status: string }>(
      `/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major`,
      'POST'
    )
  }

  static deaccession(persistentId: string) {
    return cy
      .visit(`/dataset.xhtml?persistentId=${persistentId}`)
      .get('#editDataSet')
      .click()
      .get('#datasetForm\\:deaccessionDatasetLink')
      .click()
      .get('#datasetForm\\:reasonOptions_label')
      .click()
      .get('#datasetForm\\:reasonOptions_2')
      .click()
      .get('#datasetForm\\:reasonForDeaccession')
      .type('Test deaccession')
      .get('#datasetForm\\:j_idt2181')
      .click()
      .get('#datasetForm\\:deaccessionConfirmation_content > div > input')
      .click()
  }

  static async createPrivateUrl(id: string): Promise<{ token: string }> {
    return this.request<{ token: string }>(`/datasets/${id}/privateUrl`, 'POST')
  }

  static async createWithFiles(numberOfFiles: number): Promise<DatasetResponse> {
    const datasetResponse = await this.create()
    const files = await this.createFiles(datasetResponse.persistentId, numberOfFiles)
    return { ...datasetResponse, files: files }
  }

  private static async createFiles(
    datasetPersistentId: string,
    numberOfFiles: number
  ): Promise<DatasetFileResponse[]> {
    const files = []
    for (let i = 0; i < numberOfFiles; i++) {
      files.push(await this.createFile(datasetPersistentId))
    }
    return files
  }

  private static async createFile(datasetPersistentId: string): Promise<DatasetFileResponse> {
    const textFile = new Blob(['Hello, this is some data.'], { type: 'text/plain' })
    const data = {
      file: textFile,
      jsonData: JSON.stringify({ description: 'This is an example file' })
    }
    const { files } = await this.request<{ files: [{ dataFile: { id: string } }] }>(
      `/datasets/:persistentId/add?persistentId=${datasetPersistentId}`,
      'POST',
      data,
      true
    )

    if (!files || !files[0].dataFile) {
      throw new Error('No files returned')
    }
    return files[0].dataFile
  }
}
