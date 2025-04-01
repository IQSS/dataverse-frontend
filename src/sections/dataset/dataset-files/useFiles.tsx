import { useEffect, useState } from 'react'
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
  const getFilesCountInfo = () => {
    return getFilesCountInfoByDatasetPersistentId(
      filesRepository,
      datasetPersistentId,
      datasetVersion.number,
      criteria
    )
      .then((filesCountInfo: FilesCountInfo) => {
        setFilesCountInfo(filesCountInfo)
        if (filesCountInfo.total !== paginationInfo.totalItems) {
          onPaginationInfoChange(paginationInfo.withTotal(filesCountInfo.total))
        }
        return filesCountInfo
      })
      .catch(() => {
        throw new Error('There was an error getting the files count info')
      })
  }

  const getFiles = (filesCount: FilesCountInfo) => {
    if (filesCount) {
      if (filesCount.total === 0) {
        setIsLoading(false)
        return
      }
      return getFilesByDatasetPersistentId(
        filesRepository,
        datasetPersistentId,
        datasetVersion,
        paginationInfo.withTotal(filesCount.total),
        criteria
      )
        .then((files: FilePreview[]) => {
          setFiles(files)
          setIsLoading(false)
        })
        .catch(() => {
          throw new Error('There was an error getting the files')
        })
    }
  }

  useEffect(() => {
    setIsLoading(true)

    getFilesCountInfo()
      .then((filesCount) => getFiles(filesCount))
      .catch(() => {
        console.error('There was an error getting the files')
        setIsLoading(false)
      })

    // TODO: Not a priority as the one for inifinite scroll is used but the eslint disable should be removed and the dependency should be added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    paginationInfo.page,
    paginationInfo.pageSize,
    criteria
  ])

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
    files,
    isLoading,
    filesCountInfo,
    filesTotalDownloadSize
  }
}
