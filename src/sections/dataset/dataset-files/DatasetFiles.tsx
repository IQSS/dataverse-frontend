import './index.css'
import { useFilesTable } from './files-table/useFilesTable'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useFiles } from './useFiles'
import { useEffect } from 'react'
import { FilesTable } from './files-table/FilesTable'

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
  const { files } = useFiles(filesRepository, datasetPersistentId, datasetVersion)
  const { table, setFilesTableData } = useFilesTable()

  useEffect(() => {
    setFilesTableData(files)
  })

  return <FilesTable table={table} />
}
