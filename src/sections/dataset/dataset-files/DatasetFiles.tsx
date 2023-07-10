import { useFilesTable } from './files-table/useFilesTable'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useFiles } from './useFiles'
import { useEffect, useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { SpinnerSymbol } from './files-table/spinner-symbol/SpinnerSymbol'
import { FilesCriteriaInputs } from './files-criteria-inputs/FilesCriteriaInputs'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'

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
  const [criteria, setCriteria] = useState<FileCriteria>()
  const { files, isLoading } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  )
  const { table, setFilesTableData } = useFilesTable()
  const handleCriteriaChange = (newCriteria: FileCriteria) => {
    setCriteria((criteria) => ({ ...criteria, ...newCriteria }))
  }

  useEffect(() => {
    setFilesTableData(files)
  }, [files])

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return (
    <>
      <FilesCriteriaInputs onCriteriaChange={handleCriteriaChange} />
      <FilesTable table={table} />
    </>
  )
}
