import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File, FileType } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion?: string,
  criteria?: FileCriteria
) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const filesCountInfo: FilesCountInfo = {
    total: 222,
    perFileType: [
      {
        type: new FileType('text'),
        count: 5
      },
      {
        type: new FileType('image'),
        count: 485
      }
    ]
  } // TODO: Get from use case

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
  }, [filesRepository, datasetPersistentId, criteria])

  return {
    files,
    filesCountInfo,
    isLoading
  }
}
