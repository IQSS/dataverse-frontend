import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useFilePermissions } from '../../file/file-permissions/FilePermissionsContext'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion?: string,
  paginationInfo?: FilePaginationInfo,
  criteria?: FileCriteria
) {
  const { fetchFilesPermission } = useFilePermissions()
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>({
    total: 0,
    perFileType: [],
    perAccess: [],
    perFileTag: []
  })

  useEffect(() => {
    getFilesCountInfoByDatasetPersistentId(filesRepository, datasetPersistentId, datasetVersion)
      .then((filesCountInfo: FilesCountInfo) => {
        setFilesCountInfo(filesCountInfo)
      })
      .catch((error) => {
        console.error('There was an error getting the files count info', error)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion])

  useEffect(() => {
    setIsLoading(true)
    getFilesByDatasetPersistentId(
      filesRepository,
      datasetPersistentId,
      datasetVersion,
      paginationInfo,
      criteria
    )
      .then((files: File[]) => {
        setFiles(files)
        return files
      })
      .then((files: File[]) =>
        fetchFilesPermission(FilePermission.DOWNLOAD_FILE, files).then(() => setIsLoading(false))
      )
      .catch((error) => {
        console.error('There was an error getting the files', error)
        setIsLoading(false)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion, paginationInfo, criteria])

  return {
    files,
    isLoading,
    filesCountInfo
  }
}
