import { DatasetExternalToolResolved } from '@/externalTools/domain/models/DatasetExternalToolResolved'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from '@/externalTools/domain/useCases/DTOs/GetExternalToolDTO'
import { DatasetExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/DatasetExternalToolResolvedMother'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/FileExternalToolResolvedMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class ExternalToolsMockRepository implements ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ExternalToolsMother.createList())
      }, FakerHelper.loadingTimout())
    })
  }

  getDatasetExternalToolResolved(
    _datasetId: number | string,
    _toolId: number,
    _getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetExternalToolResolvedMother.create())
      }, FakerHelper.loadingTimout())
    })
  }

  getFileExternalToolResolved(
    _fileId: number | string,
    _toolId: number,
    _getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileExternalToolResolvedMother.create())
      }, FakerHelper.loadingTimout())
    })
  }
}

export class ExternalToolsEmptyMockRepository implements Partial<ExternalToolsMockRepository> {
  getExternalTools(): Promise<ExternalTool[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, FakerHelper.loadingTimout())
    })
  }
}
