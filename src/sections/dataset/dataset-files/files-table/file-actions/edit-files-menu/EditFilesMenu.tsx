import { DropdownButton } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { useSession } from '../../../../../session/SessionContext'
import styles from './EditFilesMenu.module.scss'
import { EditFilesOptions } from './EditFilesOptions'
import { File } from '../../../../../../files/domain/models/File'

interface EditFilesMenuProps {
  files: File[]
}
const MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON = 1
export function EditFilesMenu({ files }: EditFilesMenuProps) {
  const { user } = useSession()
  const userHasDatasetUpdatePermissions = true // TODO - Implement permissions
  const datasetHasValidTermsOfAccess = true // TODO - Implement terms of access validation
  const datasetLockedFromEdits = false // TODO - Ask Guillermo if this a dataset property coming from the api

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON ||
    !user ||
    !userHasDatasetUpdatePermissions
  ) {
    return <></>
  }
  return (
    <DropdownButton
      variant="secondary"
      id="edit-files-menu"
      title="Edit Files"
      disabled={datasetLockedFromEdits || !datasetHasValidTermsOfAccess}
      icon={<PencilFill className={styles.icon} />}>
      <EditFilesOptions files={files} />
    </DropdownButton>
  )
}
