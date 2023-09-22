import { useEffect, useState } from 'react'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { useFilePermissions } from './FilePermissionsContext'
import { File } from '../../../files/domain/models/File'

export function useFileDownloadPermission(file: File) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [sessionUserHasFileDownloadPermission, setSessionUserHasFileDownloadPermission] =
    useState<boolean>(false)

  useEffect(() => {
    checkSessionUserHasFilePermission(FilePermission.DOWNLOAD_FILE, file)
      .then((hasPermission) => {
        setSessionUserHasFileDownloadPermission(hasPermission)
      })
      .catch((error) => {
        setSessionUserHasFileDownloadPermission(false)
        console.error('There was an error getting the file download permission', error)
      })
  }, [file])

  return { sessionUserHasFileDownloadPermission }
}
