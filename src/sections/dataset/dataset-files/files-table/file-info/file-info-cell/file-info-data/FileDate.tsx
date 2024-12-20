import { useTranslation } from 'react-i18next'
import { FileDate as FileDateModel } from '../../../../../../../files/domain/models/FileMetadata'

export function FileDate({ date }: { date: FileDateModel }) {
  const { t } = useTranslation('files')

  return (
    <div>
      <span>
        {t(`table.date.${date.type}`)} <time dateTime={date.date}>{date.date}</time>
      </span>
    </div>
  )
}
