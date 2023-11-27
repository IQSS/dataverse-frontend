import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { PropsWithChildren } from 'react'
import { getFile } from '../../../files/domain/useCases/getFile'
import { FileDownloadHelperContext } from './FileDownloadHelperContext'

interface FileDownloadProviderProps {
  repository: FileRepository
}

export function FileDownloadHelperProvider({
  repository,
  children
}: PropsWithChildren<FileDownloadProviderProps>) {
  const download = (id: number): Promise<string | undefined> => {
    return getFile(repository, id)
  }

  return (
    <FileDownloadHelperContext.Provider value={{ download }}>
      {children}
    </FileDownloadHelperContext.Provider>
  )
}
