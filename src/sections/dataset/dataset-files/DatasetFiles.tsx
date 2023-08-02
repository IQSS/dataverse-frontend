import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { FilesPagination } from './files-pagination/FilesPagination'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion?: string
}

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(new FilePaginationInfo())
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading, filesCountInfo } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
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
      <FilesTable files={files} isLoading={isLoading} filesCountTotal={filesCountInfo.total} />
      <FilesPagination
        page={paginationInfo.page}
        pageSize={paginationInfo.pageSize}
        total={filesCountInfo.total}
        onPaginationInfoChange={setPaginationInfo}
      />
    </>
  )
}
