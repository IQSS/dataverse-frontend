import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import {
  FileDifferenceSummary,
  FileVersionSummaryInfo
} from '@/files/domain/models/FileVersionSummaryInfo'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import { Table, Button } from '@iqss/dataverse-design-system'
import { useFileVersionSummaryDescription } from './useFileVersionSummaryDescription'
import {
  DatasetNonNumericVersion,
  DatasetVersionNumber,
  DatasetNonNumericVersionSearchParam
} from '@/dataset/domain/models/Dataset'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from './FileVersion.module.scss'

interface FileVersionProps {
  version: FileVersionSummaryInfo[] | undefined
  datasetVersionNumber: DatasetNonNumericVersion | DatasetVersionNumber | string | undefined
}

export function FileVersions({ version, datasetVersionNumber }: FileVersionProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('file')
  const fileId = version?.[0]?.datafileId

  datasetVersionNumber == DatasetNonNumericVersion.DRAFT &&
    (datasetVersionNumber = DatasetNonNumericVersionSearchParam.DRAFT)

  const navigateToVersion = (versionNumber: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.FILE_ID, String(fileId))
    searchParams.set(QueryParamKey.DATASET_VERSION, versionNumber)
    navigate(`${Route.FILES}?${searchParams.toString()}`)
  }

  return (
    <div data-testid={`file-version`} className={styles['dataset-versions-table']}>
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
          {version?.map((fileVersion) => (
            <tr key={fileVersion.datasetVersion}>
              <td style={{ verticalAlign: 'middle' }}>
                {fileVersion.datasetVersion === datasetVersionNumber ? (
                  <strong>{fileVersion.datasetVersion}</strong>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => navigateToVersion(fileVersion.datasetVersion)}
                    disabled={
                      !fileVersion.fileDifferenceSummary ||
                      fileVersion.datasetVersion === datasetVersionNumber ||
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

  if (typeof summaryText === 'string') {
    return <span style={{ fontStyle: 'italic' }}>{summaryText}</span>
  }

  if (summaryText['Deaccessioned Reason']) {
    return (
      <span>
        <strong>Deaccessioned Reason</strong>: {summaryText['Deaccessioned Reason']}
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
