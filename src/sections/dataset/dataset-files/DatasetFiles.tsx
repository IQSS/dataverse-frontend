import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileAccessOption, FileCriteria, FileTag } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { FileType } from '../../../files/domain/models/File'
import { useFiles } from './useFiles'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { FilesPagination } from './files-pagination/FilesPagination'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion?: string
}

const filesCountInfo: FilesCountInfo = {
  total: 200,
  perFileType: [
    {
      type: new FileType('text'),
      count: 5
    },
    {
      type: new FileType('image'),
      count: 485
    }
  ],
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 10 }
  ],
  perFileTag: [
    { tag: new FileTag('document'), count: 5 },
    { tag: new FileTag('code'), count: 10 }
  ]
} // TODO (filesCountInfo) - Get from use case, pending to be discussed if this is going to have its own use case or not

const filePaginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 10, 200)

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(filePaginationInfo)
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  )

  return (
    <>
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={setCriteria}
        filesCountInfo={filesCountInfo}
      />
      <FilesTable files={files} filesCountTotal={filesCountInfo.total} isLoading={isLoading} />
      <FilesPagination
        paginationInfoInitial={paginationInfo}
        onPaginationInfoChange={setPaginationInfo}
      />
    </>
  )
}
