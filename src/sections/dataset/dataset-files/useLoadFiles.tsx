import { useMemo, useState } from 'react'
import { FilePreview } from '../../../files/domain/models/FilePreview'

const NO_FILES = 0

type UseLoadFilesReturnType = {
  isLoading: boolean
  accumulatedFiles: FilePreview[]
  totalAvailable: number | undefined
  hasNextPage: boolean
  error: string | null
  loadMore: () => Promise<void>
  isEmptyFiles: boolean
  areFilesAvailable: boolean
  accumulatedCount: number
}

export const useLoadFiles = (): UseLoadFilesReturnType => {
  const [isLoading, setLoading] = useState(false)
  const [accumulatedFiles, setAccumulatedFiles] = useState<FilePreview[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [totalAvailable, setTotalAvailable] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const isEmptyFiles = useMemo(() => totalAvailable === NO_FILES, [totalAvailable])
  const areFilesAvailable = useMemo(() => {
    return typeof totalAvailable === 'number' && totalAvailable > NO_FILES && !error
  }, [totalAvailable, error])
  const accumulatedCount = useMemo(() => accumulatedFiles.length, [accumulatedFiles])

  return {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore: () => Promise.resolve(),
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount
  }
}
