import { useEffect, useRef, useState } from 'react'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useLoadFiles } from './useLoadFiles'
import { FilesTable } from './files-table/FilesTable'
import { Row } from '@iqss/dataverse-design-system'

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

const PAGE_SIZE = 10

export function DatasetFilesWithInfiniteScroll({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesProps) {
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerHeight = criteriaContainerRef.current?.clientHeight

  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(
    () => new FilePaginationInfo()
  )
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())

  const {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    loadFilesWithNewCriteria,
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount,
    filesCountInfo,
    filesTotalDownloadSize
  } = useLoadFiles({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    paginationInfo,
    criteria
  })

  useEffect(() => {
    const updatePaginationTotalItems = () => {
      if (totalAvailable && totalAvailable !== paginationInfo.totalItems) {
        setPaginationInfo(paginationInfo.withTotal(totalAvailable))
      }
    }

    updatePaginationTotalItems()
  }, [totalAvailable, paginationInfo])

  useEffect(() => {
    const updatePaginationPageNumber = () => {
      setPaginationInfo((currentPagination) =>
        currentPagination.goToPage(accumulatedCount / PAGE_SIZE + 1)
      )
    }

    updatePaginationPageNumber()
  }, [accumulatedCount])

  const handleCriteriaChange = (criteria: FileCriteria) => {
    setCriteria(criteria)
    const newPaginationInfo = new FilePaginationInfo()

    void loadFilesWithNewCriteria(criteria, newPaginationInfo)
  }

  console.log({ accumulatedFiles })

  return (
    <Row style={{ maxHeight: 600, overflow: 'auto' }}>
      <div
        ref={criteriaContainerRef}
        style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 1000
        }}>
        <FileCriteriaForm
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
        <button onClick={loadMore}>Fetch more +</button>
      </div>

      {/* <header
          style={{
            position: 'sticky',
            top: criteriaContainerHeight,
            background: 'brown',
            color: 'white',
            padding: '1rem'
          }}>
          Header
        </header> */}

      <div style={{ position: 'relative', zIndex: 999 }}>
        <FilesTable
          files={accumulatedFiles}
          isLoading={isLoading}
          paginationInfo={paginationInfo}
          filesTotalDownloadSize={filesTotalDownloadSize}
          criteria={criteria}
          criteriaContainerHeight={criteriaContainerHeight}
        />
      </div>
    </Row>
  )
}
