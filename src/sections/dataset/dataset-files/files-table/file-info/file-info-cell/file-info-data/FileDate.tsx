import { FileDate as FileDateModel } from '../../../../../../../files/domain/models/FileMetadata'
import { useTranslation } from 'react-i18next'
import { DateHelper } from '../../../../../../../shared/domain/helpers/DateHelper'

export function FileDate({ date }: { date: FileDateModel }) {
  const { t } = useTranslation('files')
  return (
    <div>
      <span>
        {t(`table.date.${date.type}`)} {DateHelper.toDisplayFormat(date.date)}
      </span>
    </div>
  )
}
