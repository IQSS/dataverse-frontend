import {
  getDatasetExternalToolUrl,
  getExternalTools,
  getFileExternalToolUrl
} from '@iqss/dataverse-client-javascript'
import { DatasetExternalToolResolved } from '@/externalTools/domain/models/DatasetExternalToolResolved'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from '@/externalTools/domain/useCases/DTOs/GetExternalToolUrlDTO'

export class ExternalToolsJSDataverseRepository implements ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]> {
    return getExternalTools.execute().then((jsExternalTools) => jsExternalTools)
  }

  getDatasetExternalToolUrl(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved> {
    return getDatasetExternalToolUrl
      .execute(datasetId, toolId, getExternalToolDTO)
      .then((jsDatasetExternalToolUrl) => jsDatasetExternalToolUrl)
  }

  getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved> {
    return getFileExternalToolUrl
      .execute(fileId, toolId, getExternalToolDTO)
      .then((jsFileExternalToolUrl) => jsFileExternalToolUrl)
  }
}
