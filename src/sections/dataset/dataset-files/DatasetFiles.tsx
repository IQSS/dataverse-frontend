import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { FilesPagination } from './files-pagination/FilesPagination'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(new FilePaginationInfo())
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading, filesCountInfo, filesTotalDownloadSize } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    setPaginationInfo,
    paginationInfo,
    criteria
  )

  return (
    <>
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={setCriteria}
        filesCountInfo={filesCountInfo}
      />
      <FilesTable
        files={files}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        filesTotalDownloadSize={filesTotalDownloadSize}
      />
      <FilesPagination
        page={paginationInfo.page}
        pageSize={paginationInfo.pageSize}
        total={paginationInfo.totalFiles}
        onPaginationInfoChange={setPaginationInfo}
      />
    </>
  )
}
