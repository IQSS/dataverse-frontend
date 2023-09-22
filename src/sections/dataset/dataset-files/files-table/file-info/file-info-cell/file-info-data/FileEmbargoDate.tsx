import { FileEmbargo, FilePublishingStatus } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileEmbargoDateProps {
  embargo: FileEmbargo | undefined
  publishingStatus: FilePublishingStatus
}

export function FileEmbargoDate({ embargo, publishingStatus }: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.isActive, publishingStatus))}{' '}
        {embargo.dateAvailable.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
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
