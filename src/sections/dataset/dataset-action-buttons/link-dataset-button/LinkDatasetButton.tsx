import { Button } from '@iqss/dataverse-design-system'
import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'

interface LinkDatasetButtonProps {
  dataset: Dataset
}
export function LinkDatasetButton({ dataset }: LinkDatasetButtonProps) {
  // TODO - get session context
  if (!dataset.isReleased || dataset.version.status === DatasetStatus.DEACCESSIONED) {
    return <></>
  }
  return <Button variant="secondary">Link Dataset</Button>
}
