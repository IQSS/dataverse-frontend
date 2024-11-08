import { FileEmbargo } from '../../../files/domain/models/FileMetadata'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'
import { DateHelper } from '../../../shared/helpers/DateHelper'

interface FileEmbargoDateProps {
  embargo: FileEmbargo | undefined
  datasetPublishingStatus: DatasetPublishingStatus
  format?: 'YYYY-MM-DD' | 'short'
}

export function FileEmbargoDate({
  embargo,
  datasetPublishingStatus,
  format = 'YYYY-MM-DD'
}: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.isActive, datasetPublishingStatus))}{' '}
        <time
          dateTime={
            format === 'YYYY-MM-DD'
              ? DateHelper.toISO8601Format(embargo.dateAvailable)
              : DateHelper.toDisplayFormat(embargo.dateAvailable)
          }
          data-testid="embargo-date">
          {format === 'YYYY-MM-DD'
            ? DateHelper.toISO8601Format(embargo.dateAvailable)
            : DateHelper.toDisplayFormat(embargo.dateAvailable)}
        </time>
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
