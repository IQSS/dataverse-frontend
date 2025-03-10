import { DropdownButton } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { useSession } from '../../../../../session/SessionContext'
import styles from './EditFilesMenu.module.scss'
import { EditFilesOptions } from './EditFilesOptions'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'
import { useDataset } from '../../../../DatasetContext'
import { FileSelection } from '../../row-selection/useFileSelection'
import { useMediaQuery } from '../../../../../../shared/hooks/useMediaQuery'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface EditFilesMenuProps {
  files: FilePreview[]
  fileSelection: FileSelection
  fileRepository: FileRepository
}
const MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON = 1
export function EditFilesMenu({ files, fileSelection, fileRepository }: EditFilesMenuProps) {
  const { t } = useTranslation('files')
  const { user } = useSession()
  const { dataset } = useDataset()
  const isBelow768px = useMediaQuery('(max-width: 768px)')

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_EDIT_FILES_BUTTON ||
    !user ||
    !dataset?.permissions.canUpdateDataset
  ) {
    return <></>
  }

  return (
    <DropdownButton
      id="edit-files-menu"
      icon={<PencilFill className={styles.icon} />}
      title={isBelow768px ? '' : t('actions.editFilesMenu.title')}
      ariaLabel={t('actions.editFilesMenu.title')}
      variant="secondary"
      disabled={
        dataset.checkIsLockedFromEdits(user.persistentId) || !dataset.hasValidTermsOfAccess
      }>
      <EditFilesOptions
        files={files}
        fileSelection={fileSelection}
        fileRepository={fileRepository}
        isHeader={true}
      />
    </DropdownButton>
  )
}
