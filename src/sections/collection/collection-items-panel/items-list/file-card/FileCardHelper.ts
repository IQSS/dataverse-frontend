import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'

export class FileCardHelper {
  static getDatasetSearchParams(persistentId: string, isDraft: boolean): Record<string, string> {
    const params: Record<string, string> = { persistentId: persistentId }
    if (isDraft) {
      params.version = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }
  static getFileSearchParams(id: number, isDraft: boolean): Record<string, string> {
    const params: Record<string, string> = { id: id.toString() }
    if (isDraft) {
      params.datasetVersion = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }

  static formatFileSize(bytes: number, locale?: string): string {
    return new FileSize(bytes, FileSizeUnit.BYTES).toString(locale)
  }
}
