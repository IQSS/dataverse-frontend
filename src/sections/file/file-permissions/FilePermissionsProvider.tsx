import { PropsWithChildren } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { FilePermissionsContext } from './FilePermissionsContext'
import { File } from '../../../files/domain/models/File'
import { checkFileDownloadPermission } from '../../../files/domain/useCases/checkFileDownloadPermission'

interface SessionUserFilePermissionsProviderProps {
  repository: FileRepository
}

export function FilePermissionsProvider({
  repository,
  children
}: PropsWithChildren<SessionUserFilePermissionsProviderProps>) {
  const checkSessionUserHasFileDownloadPermission = (file: File): Promise<boolean> => {
    return checkFileDownloadPermission(repository, file)
      .then((canDownloadFile) => {
        // TODO - Cache the result
        return canDownloadFile
      })
      .catch((error) => {
        console.error('There was an error getting the file download permission', error)
        return false
      })
  }

  function checkSessionUserHasFilePermission(
    permission: FilePermission,
    file: File
  ): Promise<boolean> {
    switch (permission) {
      case FilePermission.DOWNLOAD_FILE:
        return checkSessionUserHasFileDownloadPermission(file)
    }
  }

  return (
    <FilePermissionsContext.Provider
      value={{ checkSessionUserHasFilePermission: checkSessionUserHasFilePermission }}>
      {children}
    </FilePermissionsContext.Provider>
  )
}
