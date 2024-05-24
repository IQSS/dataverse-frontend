import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { useRef, useState } from 'react'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useLoadFiles } from './useLoadFiles'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export function DatasetFilesWithInfiniteScroll({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerHeight = criteriaContainerRef.current?.clientHeight

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
  const data = useLoadFiles()

  return (
    <div style={{ border: 'solid 1px red', maxHeight: 600, overflowY: 'auto' }}>
      <div
        ref={criteriaContainerRef}
        style={{
          border: 'solid 2px blue',
          position: 'sticky',
          top: 0,
          background: 'white'
        }}>
        <FileCriteriaForm
          criteria={criteria}
          onCriteriaChange={setCriteria}
          filesCountInfo={filesCountInfo}
        />
      </div>

      <div>
        <header
          style={{
            position: 'sticky',
            top: criteriaContainerHeight,
            background: 'brown',
            color: 'white',
            padding: '1rem'
          }}>
          Header
        </header>
        <div style={{ border: 'dotted 2px black', marginBlock: '4px' }}>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
          <div style={{ border: 'solid 2px violet', marginBlock: '4px' }}>
            <p>Holo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
