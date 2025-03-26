import { createContext, useContext } from 'react'
import { FilePreview } from '@/files/domain/models/FilePreview'

interface FilesContextProps {
  files: FilePreview[] | undefined
  isLoading: boolean
  refreshFiles: () => Promise<void>
}

export const FilesContext = createContext<FilesContextProps>({
  files: undefined,
  isLoading: false,
  refreshFiles: async () => {}
})

export const useFilesContext = () => useContext(FilesContext)
