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

// TODO:ME - Add unit tests for component and hook
// TODO:ME - Check replacing different file type failing

export const DatasetMetrics = ({ datasetRepository, datasetId }: DatasetMetricsProps) => {
  const { t } = useTranslation('dataset')
  const {
    downloadCountIncludingMDC,
    downloadCountNotIncludingMDC,
    isLoadingDownloadCount,
    errorLoadingDownloadCount
  } = useGetDatasetDownloadCount({ datasetRepository, datasetId })

  //   console.log({ downloadCountNotIncludingMDC, downloadCountIncludingMDC })

  const checkIsMDCenabled = (MDCStartDate: string | undefined): MDCStartDate is string => {
    return typeof MDCStartDate === 'string' ? true : false
  }

  const isMDCenabled = checkIsMDCenabled(downloadCountIncludingMDC?.MDCStartDate)

  if (isLoadingDownloadCount) {
    return <DatasetMetricsSkeleton />
  }

  if (errorLoadingDownloadCount) {
    return null
  }

  /*
    - Setting `includeMDC` to True will ignore the `MDCStartDate` setting and return a total count.
    - If MDC isn't enabled, the download count will return a total count, without `MDCStartDate`.
    - If MDC is enabled but the `includeMDC` is false, the count will be limited to the time before `MDCStartDate`
  */

  return (
    <div className={styles['dataset-metrics']}>
      <div className={styles.title}>
        {!isMDCenabled ? (
          <span>
            {t('metrics.title')}{' '}
            <QuestionMarkTooltip placement="right" message={t('metrics.tip.default')} />
          </span>
        ) : (
          <>
            <span>
              {t('metrics.makeDataCount.title')}{' '}
              <QuestionMarkTooltip placement="right" message={t('metrics.tip.makeDataCount')} />
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
          <span>
            {t('metrics.downloads.count.default', {
              count: downloadCountNotIncludingMDC?.downloadCount
            })}{' '}
            <QuestionMarkTooltip placement="right" message={t('metrics.downloads.defaultTip')} />
          </span>
        )}

        {/* If we received the MDCStartDate it means MDC is enabled and the count returned will be limited to the time prior to the MDCStartDate */}
        {isMDCenabled && (
          <div className={styles['make-data-count']}>
            <span>
              {t('metrics.downloads.count.default', {
                count: downloadCountIncludingMDC.downloadCount
              })}{' '}
              <QuestionMarkTooltip
                placement="right"
                message={t('metrics.downloads.makeDataCountTip')}
              />
            </span>

            {downloadCountNotIncludingMDC && downloadCountNotIncludingMDC.downloadCount > 0 && (
              <small>
                {`(+${t('metrics.downloads.count.preMDC', {
                  count: downloadCountNotIncludingMDC.downloadCount
                })})`}{' '}
                <QuestionMarkTooltip
                  placement="right"
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
    <div className={styles['dataset-metrics']}>
      <div className={styles.title}>
        <Skeleton height={18} width={120} />
      </div>
      <div className={styles.results}>
        <Skeleton height={18} width={100} />
      </div>
    </div>
  </SkeletonTheme>
)
