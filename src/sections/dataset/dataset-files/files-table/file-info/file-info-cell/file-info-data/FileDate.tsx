import { FileDate as FileDateModel } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../../../../i18n'

export function FileDate({ date }: { date: FileDateModel }) {
  const { t } = useTranslation('files')
  return (
    <div>
      <span>
        {t(`table.date.${date.type}`)}{' '}
        {date.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
    </div>
  )
}
