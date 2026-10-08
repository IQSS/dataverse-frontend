import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DatasetReview } from '@/dataset/domain/models/DatasetReview'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { useGetDatasetReviews } from './useGetDatasetReviews'
import styles from './DatasetReviews.module.scss'

interface DatasetReviewsProps {
  datasetId: string | number
}

export const DatasetReviews = ({ datasetId }: DatasetReviewsProps) => {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('dataset')
  const { datasetReviews, isLoading, error } = useGetDatasetReviews({
    datasetRepository,
    datasetId
  })

  if (isLoading || error || datasetReviews.length === 0) {
    return null
  }

  return (
    <section className={styles['dataset-reviews']} aria-labelledby="dataset-reviews-title">
      <div id="dataset-reviews-title" className={styles.title}>
        {t('reviews.title')}
      </div>
      <ul className={styles.list}>
        {datasetReviews.map((datasetReview) => (
          <li key={datasetReview.id} className={styles.item}>
            <Link to={getDatasetReviewUrl(datasetReview)}>{datasetReview.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function getDatasetReviewUrl(datasetReview: DatasetReview): string {
  const searchParams = new URLSearchParams({
    [QueryParamKey.PERSISTENT_ID]: datasetReview.persistentId
  })

  return `${Route.DATASETS}?${searchParams.toString()}`
}
