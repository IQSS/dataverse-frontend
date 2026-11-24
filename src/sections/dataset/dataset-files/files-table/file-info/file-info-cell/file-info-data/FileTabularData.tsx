import { FileTabularData as FileTabularDataModel } from '../../../../../../../files/domain/models/FileMetadata'
import { CopyToClipboardButton } from './copy-to-clipboard-button/CopyToClipboardButton'
import { useTranslation } from 'react-i18next'

export function FileTabularData({
  tabularData
}: {
  tabularData: FileTabularDataModel | undefined
}) {
  const { t, i18n } = useTranslation('files')
  if (!tabularData) {
    return <></>
  }
  const numberFormatter = new Intl.NumberFormat(i18n.language || i18n.resolvedLanguage)

  return (
    <div>
      {numberFormatter.format(tabularData.variables)} {t('table.tabularData.variables')},{' '}
      {numberFormatter.format(tabularData.observations)} {t('table.tabularData.observations')}{' '}
      {tabularData.unf && <CopyToClipboardButton text={tabularData.unf} />}
    </div>
  )
}
