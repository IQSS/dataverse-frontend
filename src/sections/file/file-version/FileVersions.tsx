import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { FileDifferenceSummary } from '@/files/domain/models/FileVersionSummaryInfo'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import { Table, Alert } from '@iqss/dataverse-design-system'
import { useFileVersionSummaryDescription } from './useFileVersionSummaryDescription'
import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam
} from '@/dataset/domain/models/Dataset'
import { useGetFileVersionsSummaries } from './useGetFileVersionsSummaries'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useEffect, useState } from 'react'
import styles from './FileVersion.module.scss'
import { FileVersionPaginationInfo } from '@/files/domain/models/FileVersionPaginationInfo'
import { PaginationControls } from '@/sections/shared/pagination/PaginationControls'

interface FileVersionProps {
  fileId: number
  datasetVersionNumber: string | undefined
  fileRepository: FileRepository
  canEditOwnerDataset: boolean
  isInView: boolean
}

export function FileVersions({
  fileId,
  datasetVersionNumber,
  fileRepository,
  canEditOwnerDataset,
  isInView
}: FileVersionProps) {
  const { t } = useTranslation('file')
  const [paginationInfo, setPaginationInfo] = useState<FileVersionPaginationInfo>(
    new FileVersionPaginationInfo()
  )

  const { fileVersionSummaries, isLoading, fetchSummaries, error } = useGetFileVersionsSummaries({
    fileRepository,
    fileId,
    autoFetch: false
  })

  useEffect(() => {
    if (isInView) {
      const paginationInfoToFetch = new FileVersionPaginationInfo(
        paginationInfo.page,
        paginationInfo.pageSize
      )

      void fetchSummaries(paginationInfoToFetch).then((totalCount) => {
        if (typeof totalCount === 'number') {
          setPaginationInfo(paginationInfoToFetch.withTotal(totalCount))
        }
      })
    }
  }, [isInView, fetchSummaries, paginationInfo.page, paginationInfo.pageSize])

  if (!fileVersionSummaries) {
    return <FileVersionsLoadingSkeleton />
  }

  if (error) {
    return <Alert variant="danger">{t('fileVersion.error')}</Alert>
  }

  const datasetVersionDisplayMap: Record<string, string> = {
    [DatasetNonNumericVersion.DRAFT]: DatasetNonNumericVersionSearchParam.DRAFT
  }
  const displayVersion =
    typeof datasetVersionNumber === 'string' && datasetVersionDisplayMap[datasetVersionNumber]
      ? datasetVersionDisplayMap[datasetVersionNumber]
      : datasetVersionNumber

  return (
    <>
      <div
        data-testid={`file-file`}
        className={`${styles['file-versions-table']} ${
          isLoading ? styles['file-versions-table-loading'] : ''
        }`}
        aria-busy={isLoading}>
        <Table>
          <thead>
            <tr>
              <th>{t('fileVersion.version')}</th>
              <th>{t('fileVersion.summary')}</th>
              <th>{t('fileVersion.contributors')}</th>
              <th>{t('fileVersion.publishedOn')}</th>
            </tr>
          </thead>
          <tbody>
            {fileVersionSummaries?.map((fileVersion) => {
              const isCurrentVersion = fileVersion.datasetVersion === displayVersion
              // Helper functions for readability
              const hasDataFile = fileVersion.datafileId
              const isReleased = fileVersion.versionState === DatasetVersionState.RELEASED
              const isDeaccessionedWithAccess =
                fileVersion.versionState === DatasetVersionState.DEACCESSIONED &&
                canEditOwnerDataset
              const isDraftWithAccess =
                fileVersion.versionState === DatasetVersionState.DRAFT && canEditOwnerDataset

              const isLinkable =
                hasDataFile && (isReleased || isDeaccessionedWithAccess || isDraftWithAccess)

              return (
                <tr key={fileVersion.datasetVersion}>
                  <td style={{ verticalAlign: 'middle' }}>
                    {isCurrentVersion ? (
                      <strong>{fileVersion.datasetVersion}</strong>
                    ) : isLinkable ? (
                      <Link
                        to={`${Route.FILES}?${QueryParamKey.FILE_ID}=${fileId}&${QueryParamKey.DATASET_VERSION}=${fileVersion.datasetVersion}`}
                        data-testid={`file-version-link-${fileVersion.datasetVersion}`}>
                        {fileVersion.datasetVersion}
                      </Link>
                    ) : (
                      <span>{fileVersion.datasetVersion}</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'left' }}>
                    <SummaryDescription
                      summary={fileVersion.fileDifferenceSummary}
                      isNoVersions={fileVersion.datafileId === undefined}
                    />
                  </td>
                  <td>{fileVersion.contributors}</td>
                  {fileVersion.publishedDate &&
                  fileVersion.datasetVersion !== DatasetVersionState.DRAFT ? (
                    <td>{DateHelper.toISO8601Format(new Date(fileVersion.publishedDate))}</td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={(newPaginationInfo) =>
          setPaginationInfo(
            new FileVersionPaginationInfo(
              newPaginationInfo.page,
              newPaginationInfo.pageSize,
              newPaginationInfo.totalItems
            )
          )
        }
      />
    </>
  )
}

export const SummaryDescription = ({
  summary,
  isNoVersions
}: {
  summary?: FileDifferenceSummary
  isNoVersions?: boolean
}) => {
  const summaryText: Record<string, string> | string = useFileVersionSummaryDescription(summary)
  const { t } = useTranslation('file')

  if (typeof summaryText === 'string') {
    return <span style={{ fontStyle: 'italic' }}>{summaryText}</span>
  }

  const deaccessionedReason = summaryText[t('fileVersion.deaccessionedReason')]

  if (deaccessionedReason) {
    return (
      <span>
        {t('fileVersion.deaccessionedReason')}: {summaryText[t('fileVersion.deaccessionedReason')]}
      </span>
    )
  }

  if (isNoVersions) {
    return <span className={styles['no-summary-text']}>{t('fileVersion.noVersions')}</span>
  }

  if (!summary || !Object.entries(summary).length) {
    return <span className={styles['no-summary-text']}>{t('fileVersion.noChange')}</span>
  }

  const summaryTextParts = Object.entries(summaryText).map(([key, value], index) => {
    const content =
      key === 'file' ? (
        <strong key={key}>{value}</strong>
      ) : (
        <span key={key}>
          <strong>{key}</strong>: {value}
        </span>
      )

    return (
      <span key={key}>
        {index > 0 && '; '}
        {content}
      </span>
    )
  })

  return <>{summaryTextParts}</>
}

export const FileVersionsLoadingSkeleton = () => {
  const { t } = useTranslation('file')

  return (
    <div data-testid={`file-loading-skeleton`}>
      <Table>
        <thead>
          <tr>
            <th>{t('fileVersion.version')}</th>
            <th>{t('fileVersion.summary')}</th>
            <th>{t('fileVersion.contributors')}</th>
            <th>{t('fileVersion.publishedOn')}</th>
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
              </SkeletonTheme>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
