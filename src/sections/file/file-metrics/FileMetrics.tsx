import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import styles from './FileMetrics.module.scss'

interface FileMetricsProps {
  downloadCount: number
}

export const FileMetrics = ({ downloadCount }: FileMetricsProps) => {
  const { t, i18n } = useTranslation('file')
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(i18n.languages[0] || undefined).format(value)

  return (
    <div className={styles['file-metrics']}>
      <div className={styles.title}>
        <span>
          {t('metrics.title')}{' '}
          <QuestionMarkTooltip placement="top" message={t('metrics.tip.default')} />
        </span>
      </div>

      <div className={styles.results}>
        <span data-testid="file-download-count">
          {t('metrics.downloads.count.default', {
            count: downloadCount,
            formattedCount: formatNumber(downloadCount)
          })}{' '}
          <QuestionMarkTooltip placement="top" message={t('metrics.downloads.defaultTip')} />
        </span>
      </div>
    </div>
  )
}
