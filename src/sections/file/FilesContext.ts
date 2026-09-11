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

export const useFilesContext = () => {
  const context = useContext(FilesContext)
  /* istanbul ignore if */
  if (!context) {
    throw new Error('useFilesContext must be used within a FilesContext Provider')
  }
  return context
}
