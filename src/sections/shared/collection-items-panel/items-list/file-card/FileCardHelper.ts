import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetNonNumericVersionSearchParam
} from '@/dataset/domain/models/Dataset'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

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

  static getDatasetLabels(
    publicationStatuses: PublicationStatus[],
    someDatasetVersionHasBeenReleased: boolean
  ) {
    const labels: DatasetLabel[] = []
    if (publicationStatuses.includes(PublicationStatus.Draft)) {
      labels.push(new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.DRAFT))
    }
    if (!someDatasetVersionHasBeenReleased) {
      labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
      )
    }
    return labels
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
