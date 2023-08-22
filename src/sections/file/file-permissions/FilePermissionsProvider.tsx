import { PropsWithChildren } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { FilePermissionsContext } from './FilePermissionsContext'
import { File } from '../../../files/domain/models/File'
import { checkFileDownloadPermission } from '../../../files/domain/useCases/checkFileDownloadPermission'
import { checkFileEditDatasetPermission } from '../../../files/domain/useCases/checkFileEditDatasetPermission'
import { useAnonymized } from '../../dataset/anonymized/AnonymizedContext'

interface SessionUserFilePermissionsProviderProps {
  repository: FileRepository
}

export function FilePermissionsProvider({
  repository,
  children
}: PropsWithChildren<SessionUserFilePermissionsProviderProps>) {
  const { anonymizedView } = useAnonymized()
  const checkSessionUserHasFileDownloadPermission = (file: File): Promise<boolean> => {
    if (anonymizedView) {
      return Promise.resolve(true) // If the user is in anonymized view, they can always download the file
    }
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
  const checkSessionUserHasEditDatasetPermission = (file: File): Promise<boolean> => {
    return checkFileEditDatasetPermission(repository, file)
      .then((canEditDataset) => {
        return canEditDataset
      })
      .catch((error) => {
        console.error('There was an error getting the edit dataset permission', error)
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
      case FilePermission.EDIT_DATASET:
        return checkSessionUserHasEditDatasetPermission(file)
    }
  }

  return (
    <FilePermissionsContext.Provider
      value={{ checkSessionUserHasFilePermission: checkSessionUserHasFilePermission }}>
      {children}
    </FilePermissionsContext.Provider>
  )
}
