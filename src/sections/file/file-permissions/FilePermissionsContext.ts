import { createContext, useContext } from 'react'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { FilePreview } from '../../../files/domain/models/FilePreview'

interface FilePermissionsContextProps {
  checkSessionUserHasFilePermission: (
    permission: FilePermission,
    file: FilePreview
  ) => Promise<boolean>
  fetchFilesPermission: (permission: FilePermission, files: FilePreview[]) => Promise<boolean[]>
}

export const FilePermissionsContext = createContext<FilePermissionsContextProps>({
  checkSessionUserHasFilePermission: () => Promise.reject('Not implemented'),
  fetchFilesPermission: () => Promise.reject('Not implemented')
})

export const useFilePermissions = () => useContext(FilePermissionsContext)
