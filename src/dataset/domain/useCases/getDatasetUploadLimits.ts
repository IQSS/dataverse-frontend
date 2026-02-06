import { getDatasetUploadLimits as jsGetDatasetUploadLimits } from '@iqss/dataverse-client-javascript'
import { DatasetUploadLimits } from '../models/DatasetUploadLimits'

export async function getDatasetUploadLimits(
  datasetId: string | number
): Promise<DatasetUploadLimits> {
  return jsGetDatasetUploadLimits.execute(datasetId)
}
