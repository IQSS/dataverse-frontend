import { useEffect, useState } from 'react'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { useFilePermissions } from './FilePermissionsContext'
import { File } from '../../../files/domain/models/File'

export function useFileEditDatasetPermission(file: File) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [sessionUserHasEditDatasetPermission, setSessionUserHasEditDatasetPermission] =
    useState<boolean>(false)

  useEffect(() => {
    checkSessionUserHasFilePermission(FilePermission.EDIT_DATASET, file)
      .then((hasPermission) => {
        setSessionUserHasEditDatasetPermission(hasPermission)
      })
      .catch((error) => {
        setSessionUserHasEditDatasetPermission(false)
        console.error('There was an error getting the edit dataset permission', error)
      })
  }, [file])

  return { sessionUserHasEditDatasetPermission }
}
