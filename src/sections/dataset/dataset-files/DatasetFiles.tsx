import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'

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
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading, filesCountInfo } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  )
  const handleCriteriaChange = (newCriteria: FileCriteria) => {
    setCriteria(newCriteria)
  }

  return (
    <>
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={handleCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
      <FilesTable files={files} isLoading={isLoading} filesCountTotal={filesCountInfo.total} />
    </>
  )
}
