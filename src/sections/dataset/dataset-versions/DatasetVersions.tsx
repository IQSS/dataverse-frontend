import { useEffect, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Table, Form } from '@iqss/dataverse-design-system'
import {
  DatasetVersionSummary,
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useGetDatasetVersionsSummaries } from './useGetDatasetVersionsSummaries'
import { DatasetVersionViewDifferenceButton } from './view-difference/DatasetVersionViewDifferenceButton'
import { useDatasetVersionSummaryDescription } from './useDatasetVersionSummaryDescription'
import { DatasetViewDetailButton } from './DatasetViewDetailButton'
import { DatasetVersionState } from '@/dataset/domain/models/Dataset'
import styles from './DatasetVersions.module.scss'

interface DatasetVersionsProps {
  datasetRepository: DatasetRepository
  datasetId: string
  currentVersionNumber: string
  canUpdateDataset: boolean
  isInView: boolean
  isCurrentVersionDeaccessioned?: boolean
}

export function DatasetVersions({
  datasetRepository,
  datasetId,
  currentVersionNumber,
  canUpdateDataset,
  isInView,
  isCurrentVersionDeaccessioned
}: DatasetVersionsProps) {
  const { t } = useTranslation('dataset')
  const [selectedVersions, setSelectedVersions] = useState<DatasetVersionSummaryInfo[]>([])
  const {
    datasetVersionSummaries,
    error,
    isLoading: isLoadingDatasetVersionSummaries,
    fetchSummaries
  } = useGetDatasetVersionsSummaries({
    datasetRepository,
    persistentId: datasetId,
    autoFetch: isCurrentVersionDeaccessioned ? true : false
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

  const selectableVersions =
    datasetVersionSummaries &&
    datasetVersionSummaries.filter((version) => {
      const summary = version.summary
      const isDeaccessioned =
        typeof summary === 'object' && summary !== null && 'deaccessioned' in summary
      return !isDeaccessioned
    })
  const isCheckBoxValid = (selectableVersions?.length ?? 0) > 2

  useEffect(() => {
    if (isInView && !datasetVersionSummaries) {
      void fetchSummaries()
    }
  }, [isInView, fetchSummaries, datasetVersionSummaries])

  if (isLoadingDatasetVersionSummaries || !datasetVersionSummaries) {
    return <DatasetVersionsLoadingSkeleton />
  }

  if (error) {
    return <Alert variant="danger">Error loading dataset versions</Alert>
  }

  return (
    <>
      {selectedVersions.length === 2 && (
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
              {isCheckBoxValid && (
                <th>
                  <span className={styles['visually-hidden']}>{t('versions.select')}</span>
                </th>
              )}
              <th>{t('versions.datasetVersions')}</th>
              <th>{t('versions.summary')}</th>
              {/* <th>{t('versions.versionNote')}</th> */}
              <th>{t('versions.contributors')}</th>
              <th>{t('versions.publishedOn')}</th>
            </tr>
          </thead>
          <tbody>
            {datasetVersionSummaries?.map((dataset, index) => {
              const previousDataset =
                index < datasetVersionSummaries.length - 1
                  ? datasetVersionSummaries[index + 1]
                  : null

              const isPreviousVersionDeaccessioned =
                previousDataset &&
                typeof previousDataset.summary === 'object' &&
                previousDataset.summary !== null &&
                'deaccessioned' in previousDataset.summary

              const isCurrentVersion = dataset.versionNumber === currentVersionNumber

              const isCurrentVersionDeaccessioned =
                typeof dataset.summary === 'object' &&
                dataset.summary !== null &&
                'deaccessioned' in dataset.summary

              const isLinkable =
                (dataset.versionNumber !== DatasetVersionState.DRAFT &&
                  !isCurrentVersionDeaccessioned) ||
                ((dataset.versionNumber === DatasetVersionState.DRAFT ||
                  isCurrentVersionDeaccessioned) &&
                  canUpdateDataset)

              const showViewDetails =
                previousDataset &&
                typeof dataset.summary !== 'string' &&
                !isCurrentVersionDeaccessioned &&
                !isPreviousVersionDeaccessioned

              return (
                <tr key={dataset.id}>
                  {isCheckBoxValid && (
                    <td style={{ verticalAlign: 'middle' }}>
                      <Form.Group.Checkbox
                        label=""
                        disabled={isCurrentVersionDeaccessioned}
                        aria-label="Select row"
                        id={`dataset-${dataset.id}`}
                        data-testid="select-checkbox"
                        checked={selectedVersions.some((item) => item.id === dataset.id)}
                        onChange={() => handleCheckboxChange(dataset)}
                      />
                    </td>
                  )}
                  <td>
                    {isCurrentVersion ? (
                      <strong>{dataset.versionNumber}</strong>
                    ) : isLinkable ? (
                      <Link
                        to={`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetId}&${QueryParamKey.VERSION}=${dataset.versionNumber}`}
                        data-testid={`dataset-version-link-${dataset.versionNumber}`}>
                        {dataset.versionNumber}
                      </Link>
                    ) : (
                      <span>{dataset.versionNumber}</span>
                    )}
                  </td>
                  <td>
                    <p style={{ display: 'flex', flexWrap: 'wrap', margin: 0, textAlign: 'left' }}>
                      <SummaryDescription summary={dataset.summary} />
                      {showViewDetails && (
                        <DatasetViewDetailButton
                          datasetRepository={datasetRepository}
                          oldVersionNumber={previousDataset.versionNumber}
                          newVersionNumber={dataset.versionNumber}
                          datasetId={datasetId}
                        />
                      )}
                    </p>
                  </td>
                  {/* <td>{ TODO: version note API is missing }</td> */}
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

export const SummaryDescription = ({
  summary
}: {
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
}) => {
  const summaryText: Record<string, string> = useDatasetVersionSummaryDescription(summary)

  return (
    <>
      {Object.entries(summaryText).map(([key, value]) =>
        typeof summary === 'string' ? (
          <span key={key}>{value}</span>
        ) : (
          <span key={key}>
            <strong>{key}</strong>: {key == 'Files' ? <strong>{value}</strong> : value};&nbsp;
          </span>
        )
      )}
    </>
  )
}
