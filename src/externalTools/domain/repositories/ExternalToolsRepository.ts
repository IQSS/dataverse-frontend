import { DatasetExternalToolResolved } from '../models/DatasetExternalToolResolved'
import { ExternalTool } from '../models/ExternalTool'
import { FileExternalToolResolved } from '../models/FileExternalToolResolved'
import { GetExternalToolDTO } from '../useCases/DTOs/GetExternalToolUrlDTO'

export interface ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]>
  getDatasetExternalToolUrl(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved>
  getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved>
}
