import {
  getDatasetExternalToolResolved,
  getExternalTools,
  getFileExternalToolResolved
} from '@iqss/dataverse-client-javascript'
import { DatasetExternalToolResolved } from '@/externalTools/domain/models/DatasetExternalToolResolved'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from '@/externalTools/domain/useCases/DTOs/GetExternalToolDTO'

export class ExternalToolsJSDataverseRepository implements ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]> {
    return getExternalTools.execute().then((jsExternalTools) => jsExternalTools)
  }

  getDatasetExternalToolResolved(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved> {
    return getDatasetExternalToolResolved
      .execute(datasetId, toolId, getExternalToolDTO)
      .then((jsDatasetExternalToolResolved) => jsDatasetExternalToolResolved)
  }

  getFileExternalToolResolved(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved> {
    return getFileExternalToolResolved
      .execute(fileId, toolId, getExternalToolDTO)
      .then((jsFileExternalToolResolved) => jsFileExternalToolResolved)
  }
}
