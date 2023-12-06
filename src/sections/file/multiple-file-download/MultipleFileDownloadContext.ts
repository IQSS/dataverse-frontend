import { createContext, useContext } from 'react'
import { FileDownloadMode } from '../../../files/domain/models/File'

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
