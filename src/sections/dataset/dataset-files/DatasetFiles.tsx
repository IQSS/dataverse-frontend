import { useFilesTable } from './files-table/useFilesTable'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useFiles } from './useFiles'
import { useEffect, useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { SpinnerSymbol } from './files-table/spinner-symbol/SpinnerSymbol'
import { FileCriteriaControls } from './file-criteria-controls/FileCriteriaControls'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion?: string
}

const MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS = 2

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, filesCountInfo, isLoading } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  )
  const { table, setFilesTableData } = useFilesTable()

  const handleCriteriaChange = (newCriteria: FileCriteria) => {
    setCriteria(newCriteria)
  }

  useEffect(() => {
    setFilesTableData(files)
  }, [files])

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return (
    <>
      {files.length >= MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS && (
        <FileCriteriaControls
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      )}
      <FilesTable table={table} />
    </>
  )
}
