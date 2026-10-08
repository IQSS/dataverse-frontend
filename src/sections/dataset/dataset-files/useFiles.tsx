import { useEffect, useState, useCallback, useRef } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../../files/domain/models/FilePreview'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { getFilesTotalDownloadSize } from '../../../files/domain/useCases/getFilesTotalDownloadSize'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  onPaginationInfoChange: (paginationInfo: FilePaginationInfo) => void,
  paginationInfo: FilePaginationInfo,
  criteria?: FileCriteria
) {
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>()
  const [filesTotalDownloadSize, setFilesTotalDownloadSize] = useState<number>(0)

  const paginationInfoRef = useRef(paginationInfo)
  paginationInfoRef.current = paginationInfo

  const onPaginationInfoChangeRef = useRef(onPaginationInfoChange)
  onPaginationInfoChangeRef.current = onPaginationInfoChange

  const getFilesCountInfo = useCallback(() => {
    return getFilesCountInfoByDatasetPersistentId(
      filesRepository,
      datasetPersistentId,
      datasetVersion.number,
      criteria
    )
      .then((countInfo: FilesCountInfo) => {
        setFilesCountInfo(countInfo)
        const currentPagination = paginationInfoRef.current
        if (countInfo.total !== currentPagination.totalItems) {
          onPaginationInfoChangeRef.current(currentPagination.withTotal(countInfo.total))
        }
        return countInfo
      })
      .catch(() => {
        throw new Error('There was an error getting the files count info')
      })
  }, [filesRepository, datasetPersistentId, datasetVersion.number, criteria])

  const getFiles = useCallback(
    (countInfo: FilesCountInfo) => {
      if (countInfo) {
        if (countInfo.total === 0) {
          setIsLoading(false)
          return
        }
        return getFilesByDatasetPersistentId(
          filesRepository,
          datasetPersistentId,
          datasetVersion,
          paginationInfoRef.current.withTotal(countInfo.total),
          criteria
        )
          .then((retrievedFiles: FilePreview[]) => {
            setFiles(retrievedFiles)
            setIsLoading(false)
          })
          .catch(() => {
            throw new Error('There was an error getting the files')
          })
      }
    },
    [filesRepository, datasetPersistentId, datasetVersion, criteria]
  )

  const { page, pageSize } = paginationInfo

  useEffect(() => {
    setIsLoading(true)

    getFilesCountInfo()
      .then((countInfo) => getFiles(countInfo))
      .catch(() => {
        console.error('There was an error getting the files')
        setIsLoading(false)
      })
  }, [page, pageSize, getFilesCountInfo, getFiles])

  useEffect(() => {
    getFilesTotalDownloadSize(filesRepository, datasetPersistentId, datasetVersion.number, criteria)
      .then((totalSize: number) => {
        setFilesTotalDownloadSize(totalSize)
      })
      .catch((error) => {
        console.error('There was an error getting the files total download size', error)
      })
  }, [filesRepository, datasetPersistentId, datasetVersion.number, criteria])

  return {
    files,
    isLoading,
    filesCountInfo,
    filesTotalDownloadSize
  }
}
