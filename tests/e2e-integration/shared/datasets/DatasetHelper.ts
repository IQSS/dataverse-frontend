import newDatasetData from '../../fixtures/dataset-finch1.json'
import { DataverseApiHelper } from '../DataverseApiHelper'
import { FileData } from '../files/FileHelper'
import { DatasetLockReason } from '../../../../src/dataset/domain/models/Dataset'
import { TestsUtils } from '../TestsUtils'

export interface DatasetResponse {
  persistentId: string
  id: string
  files?: DatasetFileResponse[]
  file?: DatasetFileResponse
}

export interface DatasetFileResponse {
  id: number
}

export class DatasetHelper extends DataverseApiHelper {
  static async create(collectionId = 'root'): Promise<DatasetResponse> {
    return this.request<DatasetResponse>(
      `/dataverses/${collectionId}/datasets`,
      'POST',
      newDatasetData
    )
  }

  static async createWithTitle(title: string): Promise<DatasetResponse> {
    newDatasetData.datasetVersion.metadataBlocks.citation.fields[0].value = title
    return this.request<DatasetResponse>(`/dataverses/root/datasets`, 'POST', newDatasetData)
  }

  static async destroy(persistentId: string): Promise<DatasetResponse | undefined> {
    try {
      return await this.request<DatasetResponse>(
        `/datasets/:persistentId/destroy/?persistentId=${persistentId}`,
        'DELETE'
      )
    } catch (error) {
      if (error instanceof Error && error.message === 'Request failed with status code 404') {
        console.error('Dataset does not exist:', persistentId)
        return undefined
      }
      throw error
    }
  }
  static async createAndPublish(collectionId = 'root'): Promise<DatasetResponse> {
    const datasetResponse = await DatasetHelper.create(collectionId)
    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.waitForNoLocks(datasetResponse.persistentId)
    return datasetResponse
  }

  static async createMany(amount: number, collectionId = 'root'): Promise<DatasetResponse[]> {
    const datasets = []
    for (let i = 0; i < amount; i++) {
      const datasetResponse = await this.create(collectionId)
      datasets.push(datasetResponse)
    }
    return datasets
  }

  static async destroyAllDatasets(): Promise<void> {
    const response = await this.request<{
      items: Array<{ global_id: string }>
    }>('/search?q=*&type=dataset&sort=date&order=desc&per_page=500&start=0', 'GET')
    for (const dataset of response.items as Array<{ global_id: string }>) {
      await this.destroy(dataset.global_id)
    }
    await this.request<DatasetResponse>('/admin/index/clear-orphans?sync=true', 'GET')
  }

  static async destroyAll(): Promise<void> {
    await this.destroyAllUntilEmpty()
  }
  static async destroyAllUntilEmpty(): Promise<void> {
    let datasetsCount = 0
    do {
      await this.destroyAllDatasets()
      await TestsUtils.wait(1500) // wait for 1.5 seconds
      const response = await this.request<{ items: Array<{ global_id: string }> }>(
        '/search?q=*&type=dataset&sort=date&order=desc&per_page=500&start=0',
        'GET'
      )
      datasetsCount = response.items.length
    } while (datasetsCount > 0)
  }

  static async publish(persistentId: string): Promise<{
    status: string
    persistentId: string
  }> {
    const response = await this.request<{
      status: string
    }>(`/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major`, 'POST')

    return { ...response, persistentId }
  }

  static async getLocks(persistentId: string): Promise<{
    status: string
    persistentId: string
  }> {
    const response = await this.request<{
      status: string
    }>(`/datasets/:persistentId/locks?persistentId=${persistentId}`, 'GET')

    return { ...response, persistentId }
  }

  static deaccession(id: string) {
    return this.request<{ status: string }>(
      `/datasets/${id}/versions/:latest-published/deaccession`,
      'POST',
      {
        deaccessionReason: 'Description of the deaccession reason.'
      }
    )
  }

  static async createPrivateUrl(id: string): Promise<{
    token: string
  }> {
    return this.request<{
      token: string
    }>(`/datasets/${id}/privateUrl`, 'POST')
  }

  static async createPrivateUrlAnonymized(id: string): Promise<{
    token: string
  }> {
    return this.request<{
      token: string
    }>(`/datasets/${id}/privateUrl?anonymizedAccess=true`, 'POST')
  }

  static async createWithFiles(
    filesData: FileData[],
    collectionId = 'root'
  ): Promise<DatasetResponse> {
    const datasetResponse = await this.create(collectionId)
    const files = await this.uploadFiles(datasetResponse.persistentId, filesData)
    return { ...datasetResponse, files: files }
  }

  static async createWithFile(fileData: FileData, collectionId = 'root'): Promise<DatasetResponse> {
    const datasetResponse = await this.create(collectionId)
    const file = await this.uploadFile(datasetResponse.persistentId, fileData)
    return { ...datasetResponse, file: file }
  }

  static async createWithFileAndPublish(
    fileData: FileData,
    collectionId = 'root'
  ): Promise<DatasetResponse> {
    const datasetResponse = await DatasetHelper.createWithFile(fileData, collectionId)
    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.waitForNoLocks(datasetResponse.persistentId)

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
    filesData: FileData[]
  ): Promise<DatasetFileResponse[]> {
    // TODO - Instead of uploading the files one by one, upload them all at once - do this refactor when integrating the pagination
    const files = []
    for (const fileData of filesData) {
      const file = await this.uploadFile(datasetPersistentId, fileData)
      files.push(file)
    }
    return files
  }

  private static async uploadFile(
    datasetPersistentId: string,
    fileData: FileData
  ): Promise<DatasetFileResponse> {
    const { files } = await this.request<{
      files: [
        {
          dataFile: {
            id: number
          }
        }
      ]
    }>(
      `/datasets/:persistentId/add?persistentId=${datasetPersistentId}`,
      'POST',
      fileData,
      'multipart/form-data'
    )

    if (!files || !files[0].dataFile) {
      throw new Error('No files returned')
    }
    return files[0].dataFile
  }

  static async setCitationDateFieldType(
    persistentId: string,
    fieldType: string
  ): Promise<{
    status: string
  }> {
    return this.request<{
      status: string
    }>(
      `/datasets/:persistentId/citationdate?persistentId=${persistentId}`,
      'PUT',
      fieldType,
      'text/plain'
    )
  }

  static async lock(
    id: string,
    reason: DatasetLockReason
  ): Promise<{
    status: string
  }> {
    return this.request<{
      status: string
    }>(`/datasets/${id}/lock/${reason}`, 'POST')
  }
}
