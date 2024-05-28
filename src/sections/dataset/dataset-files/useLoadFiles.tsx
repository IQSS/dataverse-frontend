import { useCallback, useEffect, useMemo, useState } from 'react'
import { FilePreview } from '../../../files/domain/models/FilePreview'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { getFilesByDatasetPersistentIdWithCount } from '../../../files/domain/useCases/getFilesByDatasetPersistentIdWithCount'
import { FilesWithCount } from '../../../files/domain/models/FilesWithCount'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'
import { getFilesTotalDownloadSize } from '../../../files/domain/useCases/getFilesTotalDownloadSize'

const NO_FILES = 0

type UseLoadFilesReturnType = {
  isLoading: boolean
  accumulatedFiles: FilePreview[]
  totalAvailable: number | undefined
  hasNextPage: boolean
  error: string | null
  loadMore: () => Promise<void>
  loadFilesWithNewCriteria: (
    newCriteria: FileCriteria,
    resetedPagination: FilePaginationInfo
  ) => Promise<void>
  isEmptyFiles: boolean
  areFilesAvailable: boolean
  accumulatedCount: number
  filesCountInfo?: FilesCountInfo
  filesTotalDownloadSize: number
}

type UseLoadFilesParams = {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  paginationInfo: FilePaginationInfo
  criteria?: FileCriteria
}

export const useLoadFiles = ({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  paginationInfo,
  criteria
}: UseLoadFilesParams): UseLoadFilesReturnType => {
  const [isLoading, setLoading] = useState(false)
  const [accumulatedFiles, setAccumulatedFiles] = useState<FilePreview[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [totalAvailable, setTotalAvailable] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  // Extra info, could be moved to another hook ?
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>()
  const [filesTotalDownloadSize, setFilesTotalDownloadSize] = useState<number>(0)

  const isEmptyFiles = useMemo(() => totalAvailable === NO_FILES, [totalAvailable])
  const areFilesAvailable = useMemo(() => {
    return typeof totalAvailable === 'number' && totalAvailable > NO_FILES && !error
  }, [totalAvailable, error])
  const accumulatedCount = useMemo(() => accumulatedFiles.length, [accumulatedFiles])

  // TODO:ME If Criteria changes, we should reset the whole state

  const loadMore = async () => {
    setLoading(true)
    try {
      const { files, totalFilesCount } = await loadNextFiles(
        filesRepository,
        datasetPersistentId,
        datasetVersion,
        paginationInfo,
        criteria
      )

      const isNextPage = paginationInfo.page * paginationInfo.pageSize < totalFilesCount

      setAccumulatedFiles((current) => [...current, ...files])

      setTotalAvailable(totalFilesCount)

      setHasNextPage(isNextPage)

      if (!isNextPage) {
        setLoading(false)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the datasets'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  // When criteria is changed, we should reset the state and load the files with the new criteria and reseted pagination
  const loadFilesWithNewCriteria = async (
    newCriteria: FileCriteria,
    resetedPagination: FilePaginationInfo
  ) => {
    setLoading(true)

    try {
      const { files, totalFilesCount } = await loadNextFiles(
        filesRepository,
        datasetPersistentId,
        datasetVersion,
        resetedPagination,
        newCriteria
      )

      const isNextPage = resetedPagination.page * resetedPagination.pageSize < totalFilesCount

      setAccumulatedFiles(files)

      setTotalAvailable(totalFilesCount)

      setHasNextPage(isNextPage)

      if (!isNextPage) {
        setLoading(false)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the datasets'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getFilesCountInfo = useCallback(() => {
    return getFilesCountInfoByDatasetPersistentId(
      filesRepository,
      datasetPersistentId,
      datasetVersion.number,
      criteria
    )
      .then((filesCountInfo: FilesCountInfo) => {
        setFilesCountInfo(filesCountInfo)
      })
      .catch(() => {
        throw new Error('There was an error getting the files count info')
      })
  }, [filesRepository, datasetPersistentId, datasetVersion.number, criteria])

  // Count info discriminated
  useEffect(() => {
    void getFilesCountInfo()
  }, [getFilesCountInfo])

  // Total download size
  useEffect(() => {
    getFilesTotalDownloadSize(filesRepository, datasetPersistentId, datasetVersion.number, criteria)
      .then((filesTotalDownloadSize: number) => {
        setFilesTotalDownloadSize(filesTotalDownloadSize)
      })
      .catch((error) => {
        console.error('There was an error getting the files total download size', error)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion, criteria])

  return {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    loadFilesWithNewCriteria,
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount,
    filesCountInfo,
    filesTotalDownloadSize
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
  ).catch((_err) => {
    throw new Error('There was an error getting the files')
  })
}
