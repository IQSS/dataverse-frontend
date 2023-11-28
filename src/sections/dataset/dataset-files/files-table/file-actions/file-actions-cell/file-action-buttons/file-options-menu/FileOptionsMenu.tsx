import { File } from '../../../../../../../../files/domain/models/File'
import { Button, DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { PencilFill, ThreeDotsVertical } from 'react-bootstrap-icons'
import { useSession } from '../../../../../../../session/SessionContext'
import { EditFilesOptions } from '../../../edit-files-menu/EditFilesOptions'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FileAlreadyDeletedModal } from './FileAlreadyDeletedModal'
import { useDataset } from '../../../../../../DatasetContext'

export function FileOptionsMenu({ file }: { file: File }) {
  const { t } = useTranslation('files')
  const { user } = useSession()
  const { dataset } = useDataset()
  const [showFileAlreadyDeletedModal, setShowFileAlreadyDeletedModal] = useState(false)

  if (!user || !dataset?.permissions.canUpdateDataset || !dataset.hasValidTermsOfAccess) {
    return <></>
  }

  if (file.isDeleted) {
    return (
      <>
        <Tooltip placement="top" overlay={<span>{t('actions.optionsMenu.title')}</span>}>
          <Button
            id={`file-options-file-${file.id}`}
            disabled={dataset.checkIsLockedFromEdits(user.persistentId)}
            variant="secondary"
            icon={
              <ThreeDotsVertical
                aria-label={t('actions.optionsMenu.title')}
                onClick={() => setShowFileAlreadyDeletedModal(true)}
              />
            }
          />
        </Tooltip>
        <FileAlreadyDeletedModal
          show={showFileAlreadyDeletedModal}
          handleClose={() => setShowFileAlreadyDeletedModal(false)}
        />
      </>
    )
  }

  return (
    <Tooltip placement="top" overlay={<span>{t('actions.optionsMenu.title')}</span>}>
      <DropdownButton
        id={`file-options-file-${file.id}`}
        title=""
        disabled={dataset.checkIsLockedFromEdits(user.persistentId)}
        asButtonGroup
        variant="secondary"
        icon={<ThreeDotsVertical aria-label={t('actions.optionsMenu.title')} />}>
        <DropdownHeader>
          <PencilFill /> {t('actions.optionsMenu.headers.editOptions')}
        </DropdownHeader>
        <EditFilesOptions files={[file]} fileSelection={{ [file.id]: file }} />
      </DropdownButton>
    </Tooltip>
  )
}
