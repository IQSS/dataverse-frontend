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
  if (!context) {
    /* istanbul ignore next */ throw new Error(
      'useFilesContext must be used within a FilesContext Provider'
    )
  }
  return context
}
