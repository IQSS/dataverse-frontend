import { FileTabularData as FileTabularDataModel } from '../../../../../../../files/domain/models/File'
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
      {tabularData.variablesCount} {t('table.tabularData.variables')},{' '}
      {tabularData.observationsCount} {t('table.tabularData.observations')}{' '}
      <CopyToClipboardButton text={tabularData.unf} />
    </div>
  )
}
