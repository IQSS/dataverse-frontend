import { FileDate as FileDateModel } from '../../../../../../../files/domain/models/FileMetadata'
import { useTranslation } from 'react-i18next'
import { DateHelper } from '../../../../../../../shared/helpers/DateHelper'

// TODO: use time tag with dateTime attr https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

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
