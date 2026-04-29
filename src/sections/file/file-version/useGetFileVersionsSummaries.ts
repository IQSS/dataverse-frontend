import { useCallback, useEffect, useRef, useState } from 'react'
import { FileVersionSummaryInfo } from '@/files/domain/models/FileVersionSummaryInfo'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { getFileVersionSummaries } from '@/files/domain/useCases/getFileVersionSummaries'
import { FileVersionPaginationInfo } from '@/files/domain/models/FileVersionPaginationInfo'

interface UseGetFileVersionsSummaries {
  fileVersionSummaries: FileVersionSummaryInfo[] | undefined
  error: string | null
  isLoading: boolean
  fetchSummaries: (paginationInfo?: FileVersionPaginationInfo) => Promise<number | undefined>
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
  const latestRequestId = useRef(0)

  const fetchSummaries = useCallback(
    async (paginationInfo?: FileVersionPaginationInfo) => {
      const requestId = latestRequestId.current + 1
      latestRequestId.current = requestId
      setIsLoading(true)
      setError(null)
      try {
        const versionSummaries = await getFileVersionSummaries(
          fileRepository,
          fileId,
          paginationInfo
        )
        if (requestId !== latestRequestId.current) {
          return undefined
        }
        setSummaries(versionSummaries.summaries)
        return versionSummaries.totalCount
      } catch (err) {
        if (requestId !== latestRequestId.current) {
          return undefined
        }
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the file versions summaries. Try again later.'
        setError(errorMessage)
        return undefined
      } finally {
        if (requestId === latestRequestId.current) {
          setIsLoading(false)
        }
      }
    },
    [fileRepository, fileId]
  )

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
