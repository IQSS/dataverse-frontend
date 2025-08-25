import { DatasetExternalToolUrl } from '../models/DatasetExternalToolUrl'
import { ExternalTool } from '../models/ExternalTool'
import { FileExternalToolUrl } from '../models/FileExternalToolUrl'
import { GetExternalToolDTO } from '../useCases/DTOs/GetExternalToolUrlDTO'

export interface ExternalToolsRepository {
  getExternalTools(): Promise<ExternalTool[]>
  getDatasetExternalToolUrl(
    datasetId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<DatasetExternalToolUrl>
  getFileExternalToolUrl(
    fileId: number | string,
    toolId: number,
    getExternalToolDTO: GetExternalToolDTO
  ): Promise<FileExternalToolUrl>
}
