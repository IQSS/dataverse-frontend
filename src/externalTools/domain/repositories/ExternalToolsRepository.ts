import { DatasetExternalToolResolved } from '../models/DatasetExternalToolResolved'
import { ExternalTool } from '../models/ExternalTool'
import { FileExternalToolResolved } from '../models/FileExternalToolResolved'
import { GetExternalToolDTO } from '../useCases/DTOs/GetExternalToolDTO'

export interface ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]>
  getDatasetExternalToolResolved(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolResolved>
  getFileExternalToolResolved(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolResolved>
}
