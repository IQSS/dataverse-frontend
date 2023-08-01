import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion?: string,
  criteria?: FileCriteria
) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>({
    total: 0,
    perFileType: [],
    perAccess: [],
    perFileTag: []
  })

  useEffect(() => {
    setIsLoading(true)
    getFilesByDatasetPersistentId(filesRepository, datasetPersistentId, datasetVersion, criteria)
      .then((files: File[]) => {
        setFiles(files)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('There was an error getting the files', error)
        setIsLoading(false)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion, criteria])

  useEffect(() => {
    getFilesCountInfoByDatasetPersistentId(filesRepository, datasetPersistentId, datasetVersion)
      .then((filesCountInfo: FilesCountInfo) => {
        setFilesCountInfo(filesCountInfo)
      })
      .catch((error) => {
        console.error('There was an error getting the files count info', error)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion])

  return {
    files,
    isLoading,
    filesCountInfo
  }
}
