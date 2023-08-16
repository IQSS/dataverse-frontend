import { File } from '../../../../../../../../files/domain/models/File'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { PencilFill, ThreeDotsVertical } from 'react-bootstrap-icons'
import { useSession } from '../../../../../../../session/SessionContext'
import { EditFilesOptions } from '../../../edit-files-menu/EditFilesOptions'

export function FileOptionsMenu({ file }: { file: File }) {
  const { user } = useSession()
  const userHasDatasetUpdatePermissions = true // TODO - Implement permissions
  const datasetHasValidTermsOfAccess = true // TODO - Implement terms of access validation
  const datasetLockedFromEdits = false // TODO - Ask Guillermo if this a dataset property coming from the api
  // const isDeleted = false // TODO - Ask Guillermo if this is a file property coming from the api

  if (!user || !userHasDatasetUpdatePermissions || !datasetHasValidTermsOfAccess) {
    return <></>
  }

  // if (isDeleted) {
  //   return <></> // TODO - If the file is already deleted show fileAlreadyDeletedPrevious modal (ask Guillermo if isDeleted is coming from the backend)
  // }

  return (
    <Tooltip placement="top" overlay={<span>File Options</span>}>
      <DropdownButton
        id={`file-options-file-${file.id}`}
        title=""
        disabled={datasetLockedFromEdits}
        asButtonGroup
        variant="secondary"
        icon={<ThreeDotsVertical aria-label="File Options" />}>
        <DropdownHeader>
          <PencilFill /> Edit Options
        </DropdownHeader>
        <EditFilesOptions files={[file]} />
      </DropdownButton>
    </Tooltip>
  )
}
