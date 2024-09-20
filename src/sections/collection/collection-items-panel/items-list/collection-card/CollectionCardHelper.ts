import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue
} from '../../../../../dataset/domain/models/Dataset'

export class CollectionCardHelper {
  static getLabel(isReleased: boolean) {
    const labels: DatasetLabel[] = []

    if (!isReleased) {
      labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
      )
    }
    return labels
  }
}
