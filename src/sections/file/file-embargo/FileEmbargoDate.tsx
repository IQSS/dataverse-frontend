import { FileEmbargo } from '../../../files/domain/models/FileMetadata'
import { useTranslation } from 'react-i18next'
import { DateHelper } from '../../../shared/domain/helpers/DateHelper'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'

interface FileEmbargoDateProps {
  embargo: FileEmbargo | undefined
  datasetPublishingStatus: DatasetPublishingStatus
  format?: 'YYYY-MM-DD' | 'short'
}

export function FileEmbargoDate({
  embargo,
  datasetPublishingStatus,
  format = 'short'
}: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.isActive, datasetPublishingStatus))}{' '}
        {format === 'YYYY-MM-DD'
          ? DateHelper.toDisplayFormatYYYYMMDD(embargo.dateAvailable)
          : DateHelper.toDisplayFormat(embargo.dateAvailable)}
      </span>
    </div>
  )
}

const embargoTypeOfDate = (
  embargoIsActive: boolean,
  datasetPublishingStatus: DatasetPublishingStatus
) => {
  if (datasetPublishingStatus === DatasetPublishingStatus.RELEASED) {
    return embargoIsActive
      ? 'table.embargoDate.embargoedUntil'
      : 'table.embargoDate.embargoedWasThrough'
  }

  return 'table.embargoDate.embargoedWillBeUntil'
}
