import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useState } from 'react'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaControls } from './file-criteria-controls/FileCriteriaControls'
import { FileAccessOption, FileCriteria, FileTag } from '../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { FileType } from '../../../files/domain/models/File'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion?: string
}

const MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS = 2
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

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const handleCriteriaChange = (newCriteria: FileCriteria) => {
    setCriteria(newCriteria)
  }

  return (
    <>
      {filesCountInfo.total >= MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS && (
        <FileCriteriaControls
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      )}
      <FilesTable
        filesRepository={filesRepository}
        filesTotalCount={filesCountInfo.total}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
        criteria={criteria}
      />
    </>
  )
}
