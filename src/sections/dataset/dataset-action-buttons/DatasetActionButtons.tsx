import { Dataset } from '../../../dataset/domain/models/Dataset'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { AccessDatasetMenu } from './AccessDatasetMenu'

interface DatasetActionButtonsProps {
  dataset: Dataset
}

export function DatasetActionButtons({ dataset }: DatasetActionButtonsProps) {
  return (
    <ButtonGroup aria-label="Dataset Action Buttons">
      <AccessDatasetMenu dataset={dataset} />
    </ButtonGroup>
  )
}
