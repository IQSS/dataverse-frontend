import { AccessFileMenu } from './access-file-menu/AccessFileMenu'
import { File } from '../../../../../../../files/domain/models/File'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { ButtonGroup } from '@iqss/dataverse-design-system'

interface FileActionButtonsProps {
  file: File
}
export function FileActionButtons({ file }: FileActionButtonsProps) {
  return (
    <ButtonGroup aria-label="File Action Buttons">
      <AccessFileMenu file={file} />
      <FileOptionsMenu file={file} />
    </ButtonGroup>
  )
}
