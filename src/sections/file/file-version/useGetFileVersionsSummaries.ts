import { useCallback, useEffect, useState } from 'react'
import { FileVersionSummaryInfo } from '@/files/domain/models/FileVersionSummaryInfo'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { getFileVersionSummaries } from '@/files/domain/useCases/getFileVersionSummaries'

interface UseGetFileVersionsSummaries {
  fileVersionSummaries: FileVersionSummaryInfo[] | undefined
  error: string | null
  isLoading: boolean
  fetchSummaries: () => Promise<void>
}

interface Props {
  fileRepository: FileRepository
  fileId: number
  autoFetch?: boolean
}

export const useGetFileVersionsSummaries = ({
  fileRepository,
  fileId,
  autoFetch = false
}: Props): UseGetFileVersionsSummaries => {
  const [summaries, setSummaries] = useState<FileVersionSummaryInfo[]>()
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchSummaries = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const versionSummaries = await getFileVersionSummaries(fileRepository, fileId)
      setSummaries(versionSummaries)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the information from the file versions summaries. Try again later.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [fileRepository, fileId])

  useEffect(() => {
    if (autoFetch) {
      void fetchSummaries()
    }
  }, [autoFetch, fetchSummaries])

  return {
    fileVersionSummaries: summaries,
    error,
    isLoading,
    fetchSummaries
  }
}
