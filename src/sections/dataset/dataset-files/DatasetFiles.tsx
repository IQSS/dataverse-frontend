import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  datasetRepository: DatasetRepository
}

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  datasetRepository
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
        fileRepository={filesRepository}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        filesTotalDownloadSize={filesTotalDownloadSize}
        criteria={criteria}
        datasetRepository={datasetRepository}
      />
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={setPaginationInfo}
      />
    </>
  )
}
