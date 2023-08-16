import { AccessFileMenu } from './access-file-menu/AccessFileMenu'
import { File } from '../../../../../../../files/domain/models/File'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface FileActionButtonsProps {
  file: File
}
export function FileActionButtons({ file }: FileActionButtonsProps) {
  const { t } = useTranslation('files')
  return (
    <ButtonGroup aria-label={t('actions.buttons')}>
      <AccessFileMenu file={file} />
      <FileOptionsMenu file={file} />
    </ButtonGroup>
  )
}
