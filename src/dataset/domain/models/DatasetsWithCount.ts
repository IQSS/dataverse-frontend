import { DatasetPreview } from '../../domain/models/DatasetPreview'
import { TotalDatasetsCount } from './TotalDatasetsCount'

export interface DatasetsWithCount {
  datasetPreviews: DatasetPreview[]
  totalCount: TotalDatasetsCount
}
