import { FileTabularData as FileTabularDataModel } from '../../../../../files/domain/models/File'
import { CopyToClipboardButton } from './copy-to-clipboard-button/CopyToClipboardButton'

export function FileTabularData({
  tabularData
}: {
  tabularData: FileTabularDataModel | undefined
}) {
  if (!tabularData) {
    return <></>
  }
  return (
    <div>
      {tabularData.variablesCount} Variables, {tabularData.observationsCount} Observations{' '}
      {tabularData.unf} <CopyToClipboardButton text={tabularData.unf} />
    </div>
  )
}
