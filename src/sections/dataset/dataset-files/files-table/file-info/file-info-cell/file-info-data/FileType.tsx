import { FileSize, FileType as FileTypeModel } from '../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileTypeProps {
  type: FileTypeModel
  size: FileSize
}

export function FileType({ type, size }: FileTypeProps) {
  const { t } = useTranslation('files')
  return (
    <div>
      <span>
        {type.value === 'text/tab-separated-values'
          ? t('table.tabularData.name')
          : type.toDisplayFormat()}{' '}
        - {size.toString()}
      </span>
    </div>
  )
}
