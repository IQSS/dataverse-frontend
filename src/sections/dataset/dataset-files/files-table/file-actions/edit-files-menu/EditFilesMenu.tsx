import { DropdownButton } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { useSession } from '../../../../../session/SessionContext'
import styles from './EditFilesMenu.module.scss'
import { EditFilesOptions } from './EditFilesOptions'
import { File } from '../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import { useFileEditDatasetPermission } from '../../../../../file/file-permissions/useFileEditDatasetPermission'

interface EditFilesMenuProps {
  files: File[]
}
const MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON = 1
export function EditFilesMenu({ files }: EditFilesMenuProps) {
  const { t } = useTranslation('files')
  const { user } = useSession()
  const { sessionUserHasEditDatasetPermission } = useFileEditDatasetPermission(files[0])
  const datasetHasValidTermsOfAccess = true // TODO - Implement terms of access validation
  const datasetLockedFromEdits = false // TODO - Ask Guillermo if this a dataset property coming from the api

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON ||
    !user ||
    !sessionUserHasEditDatasetPermission
  ) {
    return <></>
  }
  return (
    <DropdownButton
      variant="secondary"
      id="edit-files-menu"
      title={t('actions.editFilesMenu.title')}
      disabled={datasetLockedFromEdits || !datasetHasValidTermsOfAccess}
      icon={<PencilFill className={styles.icon} />}>
      <EditFilesOptions files={files} />
    </DropdownButton>
  )
}
