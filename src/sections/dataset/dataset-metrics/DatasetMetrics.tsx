import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useGetDatasetDownloadCount } from './useGetDatasetDownloadCount'
import styles from './DatasetMetrics.module.scss'

interface DatasetMetricsProps {
  datasetRepository: DatasetRepository
  datasetId: number | string
}

export const DatasetMetrics = ({ datasetRepository, datasetId }: DatasetMetricsProps) => {
  const { t } = useTranslation('dataset')
  const {
    downloadCount: downloadCountIncludingMDC,
    isLoadingDownloadCount: isLoadingDownloadCountIncludingMDC,
    errorLoadingDownloadCount: errorLoadingDownloadCountIncludingMDC
  } = useGetDatasetDownloadCount({ datasetRepository, datasetId, includeMDC: true })

  const {
    downloadCount: downloadCountNotIncludingMDC,
    isLoadingDownloadCount: isLoadingDownloadCountNotIncludingMDC,
    errorLoadingDownloadCount: errorLoadingDownloadCountNotIncludingMDC
  } = useGetDatasetDownloadCount({ datasetRepository, datasetId, includeMDC: false })

  const checkIsMDCenabled = (MDCStartDate: string | undefined): MDCStartDate is string => {
    return typeof MDCStartDate === 'string' ? true : false
  }

  const isMDCenabled = checkIsMDCenabled(downloadCountIncludingMDC?.MDCStartDate)

  if (isLoadingDownloadCountIncludingMDC || isLoadingDownloadCountNotIncludingMDC) {
    return <DatasetMetricsSkeleton />
  }

  if (errorLoadingDownloadCountIncludingMDC || errorLoadingDownloadCountNotIncludingMDC) {
    return null
  }

  return (
    <div className={styles['dataset-metrics']}>
      <div className={styles.title}>
        {!isMDCenabled ? (
          <span>
            {t('metrics.title')}{' '}
            <QuestionMarkTooltip placement="top" message={t('metrics.tip.default')} />
          </span>
        ) : (
          <>
            <span>
              {t('metrics.makeDataCount.title')}{' '}
              <QuestionMarkTooltip placement="top" message={t('metrics.tip.makeDataCount')} />
            </span>

            <small>
              <i>
                {t('metrics.makeDataCount.since')} {downloadCountIncludingMDC.MDCStartDate}
              </i>
            </small>
          </>
        )}
      </div>

      <div className={styles.results}>
        {!isMDCenabled && (
          <span data-testid="classic-download-count">
            {t('metrics.downloads.count.default', {
              count: downloadCountNotIncludingMDC?.downloadCount
            })}{' '}
            <QuestionMarkTooltip placement="top" message={t('metrics.downloads.defaultTip')} />
          </span>
        )}

        {/* If we received the MDCStartDate it means MDC is enabled and the count returned will be limited to the time prior to the MDCStartDate */}
        {isMDCenabled && (
          <div className={styles['mdc-count']} data-testid="mdc-download-count">
            <span>
              {t('metrics.downloads.count.default', {
                count: downloadCountIncludingMDC.downloadCount
              })}{' '}
              <QuestionMarkTooltip
                placement="top"
                message={t('metrics.downloads.makeDataCountTip')}
              />
            </span>

            {/* If we have downloads before MDC was enabled, we show them also. */}
            {downloadCountNotIncludingMDC && downloadCountNotIncludingMDC.downloadCount > 0 && (
              <small>
                {`(+${t('metrics.downloads.count.preMDC', {
                  count: downloadCountNotIncludingMDC.downloadCount
                })})`}{' '}
                <QuestionMarkTooltip
                  placement="top"
                  message={t('metrics.downloads.preMakeDataCountTip')}
                />
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const DatasetMetricsSkeleton = () => (
  <SkeletonTheme>
    <div className={styles['dataset-metrics']} data-testid="dataset-metrics-skeleton">
      <div className={styles.title}>
        <Skeleton height={18} width={120} />
      </div>
      <div className={styles.results}>
        <Skeleton height={18} width={100} />
      </div>
    </div>
  </SkeletonTheme>
)
