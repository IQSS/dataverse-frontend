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
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'
import { PaginationControls } from '@/sections/shared/pagination/PaginationControls'

interface DatasetVersionsProps {
  datasetRepository: DatasetRepository
  datasetId: string
  currentVersionNumber: string
  canUpdateDataset: boolean
  isInView: boolean
}

const isVersionDeaccessioned = (version: DatasetVersionSummaryInfo) =>
  typeof version.summary === 'object' &&
  version.summary !== null &&
  'deaccessioned' in version.summary

export function DatasetVersions({
  datasetRepository,
  datasetId,
  currentVersionNumber,
  canUpdateDataset,
  isInView
}: DatasetVersionsProps) {
  const { t } = useTranslation('dataset')
  const [selectedVersions, setSelectedVersions] = useState<DatasetVersionSummaryInfo[]>([])
  const [paginationInfo, setPaginationInfo] = useState<DatasetVersionPaginationInfo>(
    new DatasetVersionPaginationInfo()
  )
  const {
    datasetVersionSummaries,
    error,
    isLoading: isLoadingDatasetVersionSummaries,
    fetchSummaries
  } = useGetDatasetVersionsSummaries({
    datasetRepository,
    persistentId: datasetId,
    autoFetch: false
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

  const visibleDatasetVersionSummaries = datasetVersionSummaries?.slice(0, paginationInfo.pageSize)
  const selectableVersions =
    visibleDatasetVersionSummaries &&
    visibleDatasetVersionSummaries.filter((version) => !isVersionDeaccessioned(version))
  const isCheckBoxValid = (selectableVersions?.length ?? 0) > 2

  useEffect(() => {
    if (isInView) {
      const paginationInfoToDisplay = new DatasetVersionPaginationInfo(
        paginationInfo.page,
        paginationInfo.pageSize
      )
      const paginationInfoToFetch = new DatasetVersionPaginationInfo(
        paginationInfo.page,
        paginationInfo.pageSize + 1,
        0,
        'Version',
        paginationInfoToDisplay.offset
      )

      void fetchSummaries(paginationInfoToFetch).then((totalCount) => {
        if (typeof totalCount === 'number') {
          setPaginationInfo((currentPaginationInfo) => currentPaginationInfo.withTotal(totalCount))
        }
      })
    }
  }, [isInView, fetchSummaries, paginationInfo.page, paginationInfo.pageSize])

  useEffect(() => {
    setSelectedVersions([])
  }, [paginationInfo.page, paginationInfo.pageSize])

  if (error) {
    return <Alert variant="danger">Error loading dataset versions</Alert>
  }

  if (!datasetVersionSummaries) {
    return <DatasetVersionsLoadingSkeleton />
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

      <div
        className={`${styles['dataset-versions-table']} ${
          isLoadingDatasetVersionSummaries ? styles['dataset-versions-table-loading'] : ''
        }`}
        data-testid="dataset-versions-table"
        aria-busy={isLoadingDatasetVersionSummaries}>
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
            {visibleDatasetVersionSummaries?.map((dataset, index) => {
              const findLastNonDeaccessionedPreviousVersion = () => {
                for (let i = index + 1; i < datasetVersionSummaries.length; i++) {
                  const version = datasetVersionSummaries[i]
                  if (!isVersionDeaccessioned(version)) {
                    return version
                  }
                }
                return null
              }

              const previousVersion = findLastNonDeaccessionedPreviousVersion()
              const isCurrentVersion = dataset.versionNumber === currentVersionNumber
              const isCurrentVersionDeaccessioned = isVersionDeaccessioned(dataset)

              const isLinkable =
                (dataset.versionNumber !== DatasetVersionState.DRAFT &&
                  !isCurrentVersionDeaccessioned) ||
                ((dataset.versionNumber === DatasetVersionState.DRAFT ||
                  isCurrentVersionDeaccessioned) &&
                  canUpdateDataset)
              const showViewDetails = !isCurrentVersionDeaccessioned && previousVersion

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
                      <SummaryDescription
                        summary={dataset.summary}
                        versionNumber={dataset.versionNumber}
                      />
                      {showViewDetails && (
                        <DatasetViewDetailButton
                          datasetRepository={datasetRepository}
                          oldVersionNumber={previousVersion.versionNumber}
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
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={setPaginationInfo}
      />
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
  summary,
  versionNumber
}: {
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
  versionNumber?: string
}) => {
  const { t } = useTranslation('dataset')
  const summaryText: Record<string, string> = useDatasetVersionSummaryDescription(
    summary,
    versionNumber
  )

  return (
    <>
      {Object.entries(summaryText).map(([key, value]) =>
        typeof summary === 'string' ? (
          <span key={key}>{value}</span>
        ) : key === t('versions.deaccessionedReason') ? (
          <span key={key}>
            {key}: {value}
          </span>
        ) : (
          <span key={key}>
            <strong>{key}</strong>: {key === 'Files' ? <strong>{value}</strong> : value};&nbsp;
          </span>
        )
      )}
    </>
  )
}
