import { useFilesTable } from './files-table/useFilesTable'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useFiles } from './useFiles'
import { useEffect } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { SpinnerSymbol } from './SpinnerSymbol'

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
  const { files, isLoading } = useFiles(filesRepository, datasetPersistentId, datasetVersion)
  const { table, setFilesTableData } = useFilesTable()

  useEffect(() => {
    setFilesTableData(files)
  }, [files])

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return <FilesTable table={table} />
}
