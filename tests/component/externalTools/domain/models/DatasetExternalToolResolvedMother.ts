import { DatasetExternalToolResolved } from '@/externalTools/domain/models/DatasetExternalToolResolved'

export class DatasetExternalToolResolvedMother {
  static create(props?: Partial<DatasetExternalToolResolved>): DatasetExternalToolResolved {
    return {
      displayName: 'Dataset Explore Tool',
      datasetId: 1,
      preview: false,
      toolUrlResolved: 'http://localhost:3000/external-tool',
      ...props
    }
  }
}
