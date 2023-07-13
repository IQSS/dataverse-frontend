import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion?: string,
  criteria?: FileCriteria
) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

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
    isLoading
  }
}
