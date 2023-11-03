import { useEffect, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { File } from '../../../files/domain/models/File'
import { getFilesByDatasetPersistentId } from '../../../files/domain/useCases/getFilesByDatasetPersistentId'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useFilePermissions } from '../../file/file-permissions/FilePermissionsContext'
import { FilePermission } from '../../../files/domain/models/FileUserPermissions'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { getFilesTotalDownloadSize } from '../../../files/domain/useCases/getFilesTotalDownloadSize'

export function useFiles(
  filesRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  onPaginationInfoChange: (paginationInfo: FilePaginationInfo) => void,
  paginationInfo: FilePaginationInfo,
  criteria?: FileCriteria
) {
  const { fetchFilesPermission } = useFilePermissions()
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>()
  const [filesTotalDownloadSize, setFilesTotalDownloadSize] = useState<number>(0)
  const getFilesCountInfo = () => {
    return getFilesCountInfoByDatasetPersistentId(
      filesRepository,
      datasetPersistentId,
      datasetVersion,
      criteria
    )
      .then((filesCountInfo: FilesCountInfo) => {
        setFilesCountInfo(filesCountInfo)
        if (filesCountInfo.total !== paginationInfo.totalFiles) {
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
        .then((files: File[]) => {
          setFiles(files)
          return files
        })
        .then((files: File[]) =>
          fetchFilesPermission(FilePermission.DOWNLOAD_FILE, files).then(() => setIsLoading(false))
        )
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
  }, [
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    paginationInfo.page,
    paginationInfo.pageSize,
    criteria
  ])

  useEffect(() => {
    getFilesTotalDownloadSize(filesRepository, datasetPersistentId, datasetVersion, criteria)
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
