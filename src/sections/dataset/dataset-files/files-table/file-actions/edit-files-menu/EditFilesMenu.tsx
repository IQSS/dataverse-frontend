import { DropdownButton } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { useSession } from '../../../../../session/SessionContext'
import styles from './EditFilesMenu.module.scss'
import { EditFilesOptions } from './EditFilesOptions'
import { File } from '../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../../../DatasetContext'
import { FileSelection } from '../../row-selection/useFileSelection'

interface EditFilesMenuProps {
  files: File[]
  fileSelection: FileSelection
}
const MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON = 1
export function EditFilesMenu({ files, fileSelection }: EditFilesMenuProps) {
  const { t } = useTranslation('files')
  const { user } = useSession()
  const { dataset } = useDataset()

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON ||
    !user ||
    !dataset?.permissions.canUpdateDataset
  ) {
    return <></>
  }
  return (
    <DropdownButton
      variant="secondary"
      id="edit-files-menu"
      title={t('actions.editFilesMenu.title')}
      disabled={dataset.isLockedFromEdits || !dataset.hasValidTermsOfAccess}
      icon={<PencilFill className={styles.icon} />}>
      <EditFilesOptions files={files} fileSelection={fileSelection} />
    </DropdownButton>
  )
}
