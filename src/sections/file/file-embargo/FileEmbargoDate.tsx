import { FileEmbargo } from '../../../files/domain/models/FileMetadata'
import { useTranslation } from 'react-i18next'
import { DateHelper } from '../../../shared/helpers/DateHelper'
import { FilePublishingStatus } from '../../../files/domain/models/FileVersion'

interface FileEmbargoDateProps {
  embargo: FileEmbargo | undefined
  publishingStatus: FilePublishingStatus
  format?: 'YYYY-MM-DD' | 'short'
}

export function FileEmbargoDate({
  embargo,
  publishingStatus,
  format = 'short'
}: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.isActive, publishingStatus))}{' '}
        {format === 'YYYY-MM-DD'
          ? DateHelper.toDisplayFormatYYYYMMDD(embargo.dateAvailable)
          : DateHelper.toDisplayFormat(embargo.dateAvailable)}
      </span>
    </div>
  )
}

const embargoTypeOfDate = (embargoIsActive: boolean, publishingStatus: FilePublishingStatus) => {
  if (publishingStatus === FilePublishingStatus.RELEASED) {
    return embargoIsActive
      ? 'table.embargoDate.embargoedUntil'
      : 'table.embargoDate.embargoedWasThrough'
  }

  return 'table.embargoDate.embargoedWillBeUntil'
}
