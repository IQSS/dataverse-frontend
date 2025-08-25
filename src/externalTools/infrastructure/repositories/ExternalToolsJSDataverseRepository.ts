import {
  getDatasetExternalToolUrl,
  getExternalTools,
  getFileExternalToolUrl
} from '@iqss/dataverse-client-javascript'
import { DatasetExternalToolUrl } from '@/externalTools/domain/models/DatasetExternalToolUrl'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { FileExternalToolUrl } from '@/externalTools/domain/models/FileExternalToolUrl'
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
  ): Promise<DatasetExternalToolUrl> {
    return getDatasetExternalToolUrl
      .execute(datasetId, toolId, getExternalToolDTO)
      .then((jsDatasetExternalToolUrl) => jsDatasetExternalToolUrl)
  }

  getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolUrl> {
    return getFileExternalToolUrl
      .execute(fileId, toolId, getExternalToolDTO)
      .then((jsFileExternalToolUrl) => jsFileExternalToolUrl)
  }
}
