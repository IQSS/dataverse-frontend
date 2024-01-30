import { useEffect, useState } from 'react'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { useFilePermissions } from './FilePermissionsContext'
import { FilePreview } from '../../../files/domain/models/FilePreview'

export function useFileDownloadPermission(file: FilePreview) {
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
