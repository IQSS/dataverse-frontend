import { Button, ButtonGroup } from '@iqss/dataverse-design-system'
import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../session/SessionContext'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'

interface LinkDatasetButtonProps {
  dataset: Dataset
}

export function LinkDatasetButton({ dataset }: LinkDatasetButtonProps) {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const handleClick = () => {
    // TODO - Implement upload files
    showModal()
  }
  const { showModal } = useNotImplementedModal()

  if (
    !user ||
    !dataset.isReleased ||
    dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
  ) {
    return <></>
  }

  return (
    <ButtonGroup>
      <Button onClick={handleClick} variant="secondary">
        {t('datasetActionButtons.linkDataset.title')}
      </Button>
    </ButtonGroup>
  )
}
