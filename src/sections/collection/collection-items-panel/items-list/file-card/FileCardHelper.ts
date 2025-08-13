import { DatasetNonNumericVersionSearchParam } from '@/dataset/domain/models/Dataset'

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

  static formatBytesToCompactNumber(bytes: number): string {
    const byteValueNumberFormatter = Intl.NumberFormat(undefined, {
      notation: 'compact',
      style: 'unit',
      unit: 'byte',
      unitDisplay: 'narrow'
    })

    return byteValueNumberFormatter.format(bytes)
  }
}
