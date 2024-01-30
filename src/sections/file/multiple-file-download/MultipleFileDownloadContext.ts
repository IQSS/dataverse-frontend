import { createContext, useContext } from 'react'
import { FileDownloadMode } from '../../../files/domain/models/FilePreview'

interface MultipleFileDownloadContextProps {
  getMultipleFileDownloadUrl: (ids: number[], downloadMode: FileDownloadMode) => string
}

export const MultipleFileDownloadContext = createContext<MultipleFileDownloadContextProps>({
  getMultipleFileDownloadUrl: () => {
    console.error('Not implemented')
    return ''
  }
})

export const useMultipleFileDownload = () => useContext(MultipleFileDownloadContext)
