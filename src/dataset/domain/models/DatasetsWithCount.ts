import { DatasetItemTypePreview } from './DatasetItemTypePreview'
import { TotalDatasetsCount } from './TotalDatasetsCount'

export interface DatasetsWithCount {
  datasetPreviews: DatasetItemTypePreview[]
  totalCount: TotalDatasetsCount
}
