import { PropsWithChildren } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { MultipleFileDownloadContext } from './MultipleFileDownloadContext'
import { FileDownloadMode } from '../../../files/domain/models/FileMetadata'
import { getMultipleFileDownloadUrl } from '../../../files/domain/useCases/getMultipleFileDownloadUrl'

interface MultipleFileDownloadProviderProps {
  repository: FileRepository
}

export function MultipleFileDownloadProvider({
  repository,
  children
}: PropsWithChildren<MultipleFileDownloadProviderProps>) {
  const getDownloadUrl = (ids: number[], downloadMode: FileDownloadMode) => {
    return getMultipleFileDownloadUrl(repository, ids, downloadMode)
  }

  return (
    <MultipleFileDownloadContext.Provider value={{ getMultipleFileDownloadUrl: getDownloadUrl }}>
      {children}
    </MultipleFileDownloadContext.Provider>
  )
}
