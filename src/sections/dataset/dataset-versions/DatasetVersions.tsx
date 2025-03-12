import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { Alert, Table, Form } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import { useGetDatasetVersionsSummaries } from './useGetDatasetVersionsSummaries'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '@/dataset/domain/models/Dataset'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { DatasetVersionViewDifferenceButton } from './view-difference/DatasetVersionViewDifferenceButton'
import { generateDatasetVersionSummaryDescription } from './generateSummaryDescription'
import { DatasetViewDetailButton } from './DatasetViewDetailButton'
import styles from './DatasetVersions.module.scss'

interface DatasetVersionsProps {
  datasetRepository: DatasetRepository
  dataset: Dataset
}
export function DatasetVersions({ datasetRepository, dataset }: DatasetVersionsProps) {
  const { datasetVersionSummaries, error, isLoading } = useGetDatasetVersionsSummaries({
    datasetRepository,
    persistentId: dataset?.persistentId ?? ''
  })

  const [selectedVersions, setSelectedVersions] = useState<DatasetVersionSummaryInfo[]>([])

  const handleCheckboxChange = (dataset: DatasetVersionSummaryInfo) => {
    setSelectedVersions((prevSelected) => {
      if (prevSelected.some((item) => item.id === dataset.id)) {
        return prevSelected.filter((item) => item.id !== dataset.id)
      }
      if (prevSelected.length < 2) {
        return [...prevSelected, dataset]
      }
      return [prevSelected[1], dataset]
    })
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <Alert variant="danger">Error loading dataset versions</Alert>
  }

  return (
    <>
      {selectedVersions.length == 2 && (
        <DatasetVersionViewDifferenceButton
          newVersionNumber={
            selectedVersions[0]?.id > selectedVersions[1]?.id
              ? selectedVersions[0]?.versionNumber
              : selectedVersions[1]?.versionNumber
          }
          oldVersionNumber={
            selectedVersions[0]?.id < selectedVersions[1]?.id
              ? selectedVersions[0]?.versionNumber
              : selectedVersions[1]?.versionNumber
          }
          datasetRepository={datasetRepository}
        />
      )}
      {/* TODO: if the length < 2, then aks user to select 2 versions */}
      <div className={styles['dataset-versions-table']} data-testid="dataset-versions-table">
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Dataset Version</th>
              <th>Summary</th>
              <th>Version Note</th>
              <th>Contributors</th>
              <th>Published On</th>
            </tr>
          </thead>
          <tbody>
            {datasetVersionSummaries &&
              datasetVersionSummaries.map((dataset) => {
                const previousDataset = datasetVersionSummaries.find((d) => d.id === dataset.id - 1)
                const summaryObject = generateDatasetVersionSummaryDescription(dataset.summary)

                return (
                  <tr key={dataset.id}>
                    <td>
                      <Form.Group.Checkbox
                        label={''}
                        id={`dataset-${dataset.id}`}
                        data-testid="select-all-files-checkbox"
                        checked={selectedVersions.some((item) => item.id === dataset.id)}
                        onChange={() => handleCheckboxChange(dataset)}
                      />
                    </td>
                    <td>{dataset.versionNumber}</td>
                    <td style={{ textAlign: 'left' }}>
                      {/* TODO: If deaccession, diable the version  */}
                      {Object.entries(summaryObject).map(([key, description]) => (
                        <>
                          {typeof dataset.summary !== 'string' ? (
                            <>
                              <strong>{key}:</strong> ({description});{' '}
                            </>
                          ) : (
                            <>{description}</>
                          )}
                        </>
                      ))}
                      {dataset && typeof dataset.summary !== 'string' && previousDataset && (
                        <DatasetViewDetailButton
                          datasetRepository={datasetRepository}
                          oldVersionNumber={previousDataset.versionNumber}
                          newVersionNumber={dataset.versionNumber}
                        />
                      )}
                    </td>
                    <td>{}</td>
                    {/* TODO: Version note is missing, need to connect with API */}
                    <td>{dataset.contributors}</td>
                    <td>{dataset.publishedOn}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <tr data-testid="table-row-loading-skeleton">
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
      <tr>
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
      <tr>
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
    </>
  )
}
