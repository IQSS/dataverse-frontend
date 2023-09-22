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
  const filePermissionsMap = new Map<number, { [x: string]: boolean }>()
  const { anonymizedView } = useAnonymized()

  const updateFilePermissionsMap = (
    fileIdToUpdate: number,
    newPermissionKey: string,
    newPermissionValue: boolean
  ) => {
    if (filePermissionsMap.has(fileIdToUpdate)) {
      const existingValue = filePermissionsMap.get(fileIdToUpdate)
      if (existingValue) {
        existingValue[newPermissionKey] = newPermissionValue
      }
    } else {
      const newValue = {
        [newPermissionKey]: newPermissionValue
      }
      filePermissionsMap.set(fileIdToUpdate, newValue)
    }
  }
  const checkSessionUserHasFileDownloadPermission = (file: File): Promise<boolean> => {
    if (anonymizedView) {
      return Promise.resolve(true) // If the user is in anonymized view, they can always download the file
    }
    return checkFileDownloadPermission(repository, file)
      .then((canDownloadFile) => {
        updateFilePermissionsMap(file.id, FilePermission.DOWNLOAD_FILE, canDownloadFile)
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
        updateFilePermissionsMap(file.id, FilePermission.EDIT_DATASET, canEditDataset)
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
    if (filePermissionsMap.has(file.id)) {
      const savedPermission = filePermissionsMap.get(file.id)?.[permission]
      if (savedPermission !== undefined) {
        return Promise.resolve(savedPermission)
      }
    }

    switch (permission) {
      case FilePermission.DOWNLOAD_FILE:
        return checkSessionUserHasFileDownloadPermission(file)
      case FilePermission.EDIT_DATASET:
        return checkSessionUserHasEditDatasetPermission(file)
    }
  }

  function fetchFilesPermission(permission: FilePermission, files: File[]): Promise<boolean[]> {
    return Promise.all(
      files.map((file) =>
        checkSessionUserHasFilePermission(permission, file)
          .then((hasPermission) => {
            return hasPermission
          })
          .catch((error) => {
            console.error('There was an error getting the file permission', error)
            return false
          })
      )
    )
  }

  return (
    <FilePermissionsContext.Provider
      value={{ checkSessionUserHasFilePermission, fetchFilesPermission }}>
      {children}
    </FilePermissionsContext.Provider>
  )
}
