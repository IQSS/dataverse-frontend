import newDatasetData from '../../fixtures/dataset-finch1.json'
import { DataverseApiHelper } from '../DataverseApiHelper'

export interface DatasetResponse {
  persistentId: string
  id: string
  files?: DatasetFileResponse[]
}

export interface DatasetFileResponse {
  id: number
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

  static async createAndPublish(): Promise<DatasetResponse> {
    const datasetResponse = await this.create()
    await this.publish(datasetResponse.persistentId)
    return datasetResponse
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

  static async createPrivateUrlAnonymized(id: string): Promise<{ token: string }> {
    return this.request<{ token: string }>(
      `/datasets/${id}/privateUrl?anonymizedAccess=true`,
      'POST'
    )
  }

  static async createWithFiles(
    numberOfFiles: number,
    useTabularFiles = false
  ): Promise<DatasetResponse> {
    const datasetResponse = await this.create()
    const files = await this.uploadFiles(
      datasetResponse.persistentId,
      numberOfFiles,
      useTabularFiles
    )
    return { ...datasetResponse, files: files }
  }

  static async embargoFiles(
    persistentId: string,
    filesIds: number[],
    embargoDate: string
  ): Promise<DatasetResponse> {
    return this.request<DatasetResponse>(
      `/datasets/:persistentId/files/actions/:set-embargo?persistentId=${persistentId}`,
      'POST',
      { fileIds: filesIds, dateAvailable: embargoDate, reason: 'Standard project embargo' }
    )
  }

  private static async uploadFiles(
    datasetPersistentId: string,
    numberOfFiles: number,
    useTabularFile: boolean
  ): Promise<DatasetFileResponse[]> {
    const files = []
    for (let i = 0; i < numberOfFiles; i++) {
      files.push(await this.uploadFile(datasetPersistentId, useTabularFile))
    }
    return files
  }

  private static async uploadFile(
    datasetPersistentId: string,
    useTabularFile: boolean
  ): Promise<DatasetFileResponse> {
    const data = {
      file: this.generateFile(useTabularFile),
      jsonData: JSON.stringify({ description: 'This is an example file' })
    }
    const { files } = await this.request<{ files: [{ dataFile: { id: number } }] }>(
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

  private static generateFile(useTabularFile: boolean) {
    if (useTabularFile) {
      return new Blob([`Name,Age\nJohn,30\nJane,28`], { type: 'text/csv' })
    }
    return new Blob(['Hello, this is some data.'], { type: 'text/plain' })
  }
}
