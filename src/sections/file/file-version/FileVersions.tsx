import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { FileDifferenceSummary } from '@/files/domain/models/FileVersionSummaryInfo'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import { Table, Button } from '@iqss/dataverse-design-system'
import { useFileVersionSummaryDescription } from './useFileVersionSummaryDescription'
import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam
} from '@/dataset/domain/models/Dataset'
import { useGetFileVersionsSummaries } from './useGetFileVersionsSummaries'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import styles from './FileVersion.module.scss'
import { useEffect } from 'react'

interface FileVersionProps {
  fileId: number
  datasetVersionNumber: string | undefined
  fileRepository: FileRepository
  isInView: boolean
}

export function FileVersions({
  fileId,
  datasetVersionNumber,
  fileRepository,
  isInView
}: FileVersionProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('file')

  const { fileVersionSummaries, isLoading, fetchSummaries } = useGetFileVersionsSummaries({
    fileRepository,
    fileId,
    autoFetch: false
  })

  useEffect(() => {
    if (isInView && !fileVersionSummaries) {
      void fetchSummaries()
    }
  }, [isInView, fileVersionSummaries, fetchSummaries])

  if (isLoading || !fileVersionSummaries) {
    return <FileVersionsLoadingSkeleton />
  }

  const datasetVersionDisplayMap: Record<string, string> = {
    [DatasetNonNumericVersion.DRAFT]: DatasetNonNumericVersionSearchParam.DRAFT
  }
  const displayVersion =
    typeof datasetVersionNumber === 'string' && datasetVersionDisplayMap[datasetVersionNumber]
      ? datasetVersionDisplayMap[datasetVersionNumber]
      : datasetVersionNumber

  const navigateToVersion = (versionNumber: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.FILE_ID, String(fileId))
    searchParams.set(QueryParamKey.DATASET_VERSION, versionNumber)
    navigate(`${Route.FILES}?${searchParams.toString()}`)
  }

  return (
    <div data-testid={`file-file`} className={styles['file-versions-table']}>
      <Table>
        <thead>
          <tr>
            <th>{t('fileVersion.file')}</th>
            <th>{t('fileVersion.summary')}</th>
            <th>{t('fileVersion.contributors')}</th>
            <th>{t('fileVersion.publishedOn')}</th>
          </tr>
        </thead>
        <tbody>
          {fileVersionSummaries?.map((fileVersion) => (
            <tr key={fileVersion.datasetVersion}>
              <td style={{ verticalAlign: 'middle' }}>
                {fileVersion.datasetVersion === displayVersion ? (
                  <strong>{fileVersion.datasetVersion}</strong>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => navigateToVersion(fileVersion.datasetVersion)}
                    disabled={
                      !fileVersion.fileDifferenceSummary ||
                      fileVersion.datasetVersion === displayVersion ||
                      fileVersion.versionState === DatasetVersionState.DEACCESSIONED
                    }>
                    {fileVersion.datasetVersion}
                  </Button>
                )}
              </td>

              <td style={{ textAlign: 'left' }}>
                <SummaryDescription summary={fileVersion.fileDifferenceSummary} />
              </td>
              <td>{fileVersion.contributors}</td>
              {fileVersion.publishedDate &&
              fileVersion.datasetVersion !== DatasetVersionState.DRAFT ? (
                <td>{DateHelper.toISO8601Format(new Date(fileVersion.publishedDate))}</td>
              ) : (
                <td></td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export const SummaryDescription = ({ summary }: { summary?: FileDifferenceSummary }) => {
  const summaryText: Record<string, string> | string = useFileVersionSummaryDescription(summary)
  const { t } = useTranslation('file')

  if (typeof summaryText === 'string') {
    return <span style={{ fontStyle: 'italic' }}>{summaryText}</span>
  }

  if (summaryText[t('fileVersion.deaccessionedReason')]) {
    return (
      <span>
        <strong>Deaccessioned Reason</strong>: {summaryText[t('fileVersion.deaccessionedReason')]}
      </span>
    )
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
            <th>{t('fileVersion.file')}</th>
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
