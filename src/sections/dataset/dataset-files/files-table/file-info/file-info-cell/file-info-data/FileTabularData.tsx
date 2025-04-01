import { FileTabularData as FileTabularDataModel } from '../../../../../../../files/domain/models/FileMetadata'
import { CopyToClipboardButton } from './copy-to-clipboard-button/CopyToClipboardButton'
import { useTranslation } from 'react-i18next'

export function FileTabularData({
  tabularData
}: {
  tabularData: FileTabularDataModel | undefined
}) {
  const { t } = useTranslation('files')
  if (!tabularData) {
    return <></>
  }
  return (
    <div>
      {tabularData.variables} {t('table.tabularData.variables')}, {tabularData.observations}{' '}
      {t('table.tabularData.observations')}{' '}
      {tabularData.unf && <CopyToClipboardButton text={tabularData.unf} />}
    </div>
  )
}
