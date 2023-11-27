import { createContext, useContext } from 'react'

interface FileDownloadContextProps {
  download: (id: number) => Promise<string | undefined>
}

export const FileDownloadHelperContext = createContext<FileDownloadContextProps>({
  download: () => Promise.reject('Not implemented')
})

export const useFileDownloadHelper = () => useContext(FileDownloadHelperContext)
