import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilePreview } from '../../../files/domain/models/FilePreview'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { getFilesByDatasetPersistentIdWithCount } from '../../../files/domain/useCases/getFilesByDatasetPersistentIdWithCount'
import { FilesWithCount } from '../../../files/domain/models/FilesWithCount'

const NO_FILES = 0

type UseGetAccumulatedFilesReturnType = {
  isLoading: boolean
  accumulatedFiles: FilePreview[]
  totalAvailable: number | undefined
  hasNextPage: boolean
  error: string | null
  loadMore: (
    paginationInfo: FilePaginationInfo,
    criteria: FileCriteria,
    resetAccumulated?: boolean
  ) => Promise<number | undefined>
  isEmptyFiles: boolean
  areFilesAvailable: boolean
  accumulatedCount: number
  refreshFiles: () => Promise<void>
}

type UseGetAccumulatedFilesParams = {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export const useGetAccumulatedFiles = ({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: UseGetAccumulatedFilesParams): UseGetAccumulatedFilesReturnType => {
  const { t } = useTranslation('files')
  const [isLoading, setIsLoading] = useState(false)
  const [accumulatedFiles, setAccumulatedFiles] = useState<FilePreview[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [totalAvailable, setTotalAvailable] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const isEmptyFiles = useMemo(() => totalAvailable === NO_FILES, [totalAvailable])
  const areFilesAvailable = useMemo(() => {
    return typeof totalAvailable === 'number' && totalAvailable > NO_FILES && !error
  }, [totalAvailable, error])
  const accumulatedCount = useMemo(() => accumulatedFiles.length, [accumulatedFiles])

  const loadMore = async (
    pagination: FilePaginationInfo,
    criteria: FileCriteria,
    resetAccumulated = false
  ): Promise<number | undefined> => {
    setIsLoading(true)

    try {
      const { files, totalFilesCount } = await loadNextFiles(
        filesRepository,
        datasetPersistentId,
        datasetVersion,
        pagination,
        criteria
      )

      const newAccumulatedFiles = !resetAccumulated ? [...accumulatedFiles, ...files] : files

      setAccumulatedFiles(newAccumulatedFiles)

      setTotalAvailable(totalFilesCount)

      const isNextPage = !resetAccumulated
        ? newAccumulatedFiles.length < totalFilesCount
        : files.length < totalFilesCount

      setHasNextPage(isNextPage)

      if (!isNextPage) {
        setIsLoading(false)
      }

      return totalFilesCount
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message ? err.message : t('errorUnkownGetFilesFromDataset')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshFiles = useCallback(async () => {
    await loadMore(new FilePaginationInfo(), new FileCriteria(), true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accumulatedFiles.length, filesRepository, datasetPersistentId, datasetVersion])

  return {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount,
    refreshFiles
  }
}

async function loadNextFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  paginationInfo: FilePaginationInfo,
  criteria?: FileCriteria
): Promise<FilesWithCount> {
  return getFilesByDatasetPersistentIdWithCount(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    paginationInfo,
    criteria
  ).catch((error: Error) => {
    throw new Error(error.message)
  })
}
