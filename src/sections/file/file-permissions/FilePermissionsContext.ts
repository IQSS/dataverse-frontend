import { createContext, useContext } from 'react'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { File } from '../../../files/domain/models/File'

interface FilePermissionsContextProps {
  checkSessionUserHasFilePermission: (permission: FilePermission, file: File) => Promise<boolean>
}

export const FilePermissionsContext = createContext<FilePermissionsContextProps>({
  checkSessionUserHasFilePermission: () => Promise.reject('Not implemented')
})

export const useFilePermissions = () => useContext(FilePermissionsContext)
