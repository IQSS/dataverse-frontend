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
  format = 'short'
}: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  // TODO: use time tag with dateTime attr https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.isActive, datasetPublishingStatus))}{' '}
        <time>
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
