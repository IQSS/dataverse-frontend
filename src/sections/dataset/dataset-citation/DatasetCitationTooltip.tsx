import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'

interface DatasetCitationTooltipProps {
  status: DatasetPublishingStatus
}

export function DatasetCitationTooltip({ status }: DatasetCitationTooltipProps) {
  const { t } = useTranslation('dataset')

  if (status === DatasetPublishingStatus.RELEASED) {
    return <></>
  }

  return (
    <QuestionMarkTooltip placement={'top'} message={t(`citation.status.${status}.description`)} />
  )
}
