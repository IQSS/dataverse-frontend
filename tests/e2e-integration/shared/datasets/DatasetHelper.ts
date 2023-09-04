import newDatasetData from '../../fixtures/dataset-finch1.json'
import { DataverseApiHelper } from '../DataverseApiHelper'
import { forEach } from 'react-bootstrap/ElementChildren'

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

  static async publish(persistentId: string): Promise<{ status: string; persistentId: string }> {
    const response = await this.request<{ status: string }>(
      `/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major`,
      'POST'
    )

    return { ...response, persistentId }
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
    filesBinary: Blob[],
    filesMetadata?: { [key: string]: string }
  ): Promise<DatasetResponse> {
    const datasetResponse = await this.create()
    const files = await this.uploadFiles(datasetResponse.persistentId, filesBinary, filesMetadata)
    return { ...datasetResponse, files: files }
  }

  static async createWithFilesRestricted(filesBinary: Blob[]): Promise<DatasetResponse> {
    const datasetResponse = await this.createWithFiles(filesBinary, {
      description: 'This is an example file',
      restrict: 'true'
    })
    return datasetResponse
  }

  static async createWithFilesEmbargoed(filesBinary: Blob[]): Promise<DatasetResponse> {
    const datasetResponse = await this.createWithFiles(filesBinary, {
      description: 'This is an example file',
      restrict: 'true',
      embargoDate: '2021-01-01'
    })
    return datasetResponse
  }

  static async embargoFiles(
    persistentId: string,
    filesIds: number[],
    embargoDate: string
  ): Promise<DatasetResponse> {
    const response = await this.request<DatasetResponse>(
      `/datasets/:persistentId/files/actions/:set-embargo?persistentId=${persistentId}`,
      'POST',
      { fileIds: filesIds, dateAvailable: embargoDate, reason: 'Standard project embargo' }
    )
    return { ...response, persistentId }
  }

  private static async uploadFiles(
    datasetPersistentId: string,
    filesBinary: Blob[],
    filesMetadata: { [key: string]: string } = { description: 'This is an example file' }
  ): Promise<DatasetFileResponse[]> {
    // TODO - Instead of uploading the files one by one, upload them all at once - do this refactor when integrating the pagination
    const files = []
    for (const fileBinary of filesBinary) {
      const file = await this.uploadFile(datasetPersistentId, fileBinary, filesMetadata)
      files.push(file)
    }
    return files
  }

  private static async uploadFile(
    datasetPersistentId: string,
    fileBinary: Blob,
    filesMetadata: { [key: string]: string } = { description: 'This is an example file' }
  ): Promise<DatasetFileResponse> {
    const data = {
      file: fileBinary,
      jsonData: JSON.stringify(filesMetadata)
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
}
