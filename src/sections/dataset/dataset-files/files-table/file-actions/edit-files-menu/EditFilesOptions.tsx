import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../files/domain/models/File'

interface EditFileOptionsProps {
  files: File[]
}
export function EditFilesOptions({ files }: EditFileOptionsProps) {
  const settingsEmbargoAllowed = false // TODO - Ask Guillermo if this is included in the settings endpoint
  const provenanceEnabledByConfig = false // TODO - Ask Guillermo if this is included in the MVP and from which endpoint is coming from

  return (
    <>
      <DropdownButtonItem>Metadata</DropdownButtonItem>
      {files.some((file) => file.access.restricted) && (
        <DropdownButtonItem>Unrestrict</DropdownButtonItem>
      )}
      {files.some((file) => !file.access.restricted) && (
        <DropdownButtonItem>Restrict</DropdownButtonItem>
      )}
      <DropdownButtonItem>Replace</DropdownButtonItem>
      {settingsEmbargoAllowed && <DropdownButtonItem>Embargo</DropdownButtonItem>}
      {provenanceEnabledByConfig && <DropdownButtonItem>Provenance</DropdownButtonItem>}
      <DropdownButtonItem>Delete</DropdownButtonItem>
    </>
  )
}
