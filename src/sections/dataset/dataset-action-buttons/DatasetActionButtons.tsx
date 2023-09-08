import { Dataset } from '../../../dataset/domain/models/Dataset'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { AccessDatasetMenu } from './AccessDatasetMenu'
import { PublishDatasetMenu } from './PublishDatasetMenu'

interface DatasetActionButtonsProps {
  dataset: Dataset
}

export function DatasetActionButtons({ dataset }: DatasetActionButtonsProps) {
  return (
    <ButtonGroup aria-label="Dataset Action Buttons">
      <AccessDatasetMenu version={dataset.version} permissions={dataset.permissions} />
      <PublishDatasetMenu dataset={dataset} />
    </ButtonGroup>
  )
}
