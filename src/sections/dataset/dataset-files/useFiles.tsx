import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion?: string
) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    getFilesByDatasetPersistentId(filesRepository, datasetPersistentId, datasetVersion)
      .then((files: File[]) => {
        setFiles(files)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('There was an error getting the files', error)
        setIsLoading(false)
      })
  }, [filesRepository, datasetPersistentId])

  return {
    files,
    isLoading
  }
}
