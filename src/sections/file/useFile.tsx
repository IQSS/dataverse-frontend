import { useEffect, useState } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { getFileById } from '../../files/domain/useCases/getFileById'
import { File } from '../../files/domain/models/File'

export function useFile(repository: FileRepository, id: number) {
  const [file, setFile] = useState<File>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)

    getFileById(repository, id)
      .then((file: File | undefined) => {
        setFile(file)
        setIsLoading(false)
      })
      .catch(() => {
        console.error('There was an error getting the file')
        setIsLoading(false)
      })
  }, [repository, id])

  return {
    file,
    isLoading
  }
}
