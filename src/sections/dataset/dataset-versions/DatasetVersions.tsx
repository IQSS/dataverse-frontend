import { useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Table, Form, Button } from '@iqss/dataverse-design-system'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { useGetDatasetVersionsSummaries } from './useGetDatasetVersionsSummaries'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionViewDifferenceButton } from './view-difference/DatasetVersionViewDifferenceButton'
import { generateDatasetVersionSummaryDescription } from './generateSummaryDescription'
import { DatasetViewDetailButton } from './DatasetViewDetailButton'
import styles from './DatasetVersions.module.scss'
import { QueryParamKey, Route } from '@/sections/Route.enum'

interface DatasetVersionsProps {
  datasetRepository: DatasetRepository
  datasetId: string
}

export function DatasetVersions({ datasetRepository, datasetId }: DatasetVersionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('dataset')
  const [selectedVersions, setSelectedVersions] = useState<DatasetVersionSummaryInfo[]>([])
  const { datasetVersionSummaries, error, isLoading } = useGetDatasetVersionsSummaries({
    datasetRepository,
    persistentId: datasetId
  })

  const handleCheckboxChange = (datasetSummary: DatasetVersionSummaryInfo) => {
    setSelectedVersions((prevSelected) => {
      if (prevSelected.some((item) => item.id === datasetSummary.id)) {
        return prevSelected.filter((item) => item.id !== datasetSummary.id)
      }
      if (prevSelected.length < 2) {
        return [...prevSelected, datasetSummary]
      }
      return [prevSelected[1], datasetSummary]
    })
  }

  const navigateToVersion = (versionNumber: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, datasetId)
    searchParams.set(QueryParamKey.VERSION, versionNumber)
    navigate(`${Route.DATASETS}?${searchParams.toString()}`)
  }

  // If there's only 1 version, we don't show the "View Differences" button or the checkbox column
  const showViewDifferenceButton = datasetVersionSummaries && datasetVersionSummaries.length < 2

  if (isLoading) {
    return <DatasetVersionsLoadingSkeleton />
  }

  if (error) {
    return <Alert variant="danger">Error loading dataset versions</Alert>
  }

  return (
    <>
      {!showViewDifferenceButton && selectedVersions.length === 2 && (
        <DatasetVersionViewDifferenceButton
          datasetRepository={datasetRepository}
          persistentId={datasetId}
          selectedVersions={selectedVersions}
        />
      )}

      <div className={styles['dataset-versions-table']} data-testid="dataset-versions-table">
        <Table>
          <thead>
            <tr>
              {!showViewDifferenceButton && <th>{t('versions.select')}</th>}
              <th>{t('versions.datasetVersions')}</th>
              <th>{t('versions.summary')}</th>
              <th>{t('versions.versionNote')}</th>
              <th>{t('versions.contributors')}</th>
              <th>{t('versions.publishedOn')}</th>
            </tr>
          </thead>
          <tbody>
            {datasetVersionSummaries?.map((dataset) => {
              const previousDataset = datasetVersionSummaries.find((d) => d.id === dataset.id - 1)
              const summaryObject = generateDatasetVersionSummaryDescription(dataset.summary)

              return (
                <tr key={dataset.id}>
                  {!showViewDifferenceButton && (
                    <td>
                      {/* TODO: If deaccession, disable the version checkbox*/}
                      <Form.Group.Checkbox
                        label=""
                        id={`dataset-${dataset.id}`}
                        data-testid="select-checkbox"
                        checked={selectedVersions.some((item) => item.id === dataset.id)}
                        onChange={() => handleCheckboxChange(dataset)}
                      />
                    </td>
                  )}
                  <td>
                    <Button variant="link" onClick={() => navigateToVersion(dataset.versionNumber)}>
                      {dataset.versionNumber}
                    </Button>
                  </td>
                  <td>
                    <p style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {Object.entries(summaryObject).map(([key, description]) => (
                        <span key={`${dataset.id}-${key}`}>
                          {typeof dataset.summary !== 'string' ? (
                            <>
                              <strong>{key}:</strong> ({description});
                            </>
                          ) : (
                            description
                          )}
                        </span>
                      ))}
                      {previousDataset && (
                        <DatasetViewDetailButton
                          datasetRepository={datasetRepository}
                          oldVersionNumber={previousDataset.versionNumber}
                          newVersionNumber={dataset.versionNumber}
                          datasetId={datasetId}
                        />
                      )}
                    </p>
                  </td>
                  <td>{/* TODO: version note API is missing */}</td>
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

export const DatasetVersionsLoadingSkeleton = () => {
  const { t } = useTranslation('dataset')

  return (
    <div data-testid={`dataset-loading-skeleton`}>
      <Table>
        <thead>
          <tr>
            <th>{t('versions.select')}</th>
            <th>{t('versions.datasetVersions')}</th>
            <th>{t('versions.summary')}</th>
            <th>{t('versions.versionNote')}</th>
            <th>{t('versions.contributors')}</th>
            <th>{t('versions.publishedOn')}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }).map((_, index) => (
            <tr key={index}>
              <SkeletonTheme>
                <td style={{ verticalAlign: 'middle' }}>
                  <Skeleton height="18px" width="18px" />
                </td>
                <td>
                  <Skeleton height="18px" width="100px" />
                </td>
                <td>
                  <Skeleton height="18px" width="250px" />
                </td>
                <td>
                  <Skeleton height="18px" width="150px" />
                </td>
                <td>
                  <Skeleton height="18px" width="200px" />
                </td>
                <td>
                  <Skeleton height="18px" width="120px" />
                </td>
              </SkeletonTheme>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
