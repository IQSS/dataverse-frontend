import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { useCollection } from '../collection/useCollection'
import { FeaturedItems } from '../collection/featured-items/FeaturedItems'
import { useLoading } from '../loading/LoadingContext'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { SearchInput } from './search-input/SearchInput'
import { Metrics } from './metrics/Metrics'
import { Usage } from './usage/Usage'
import styles from './Homepage.module.scss'

interface HomepageProps {
  collectionRepository: CollectionRepository
  dataverseHubRepository: DataverseHubRepository
}

export const Homepage = ({ collectionRepository, dataverseHubRepository }: HomepageProps) => {
  const { collection, isLoading: isLoadingCollection } = useCollection(collectionRepository)
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('homepage')

  useEffect(() => {
    if (!isLoadingCollection) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingCollection])

  if (isLoadingCollection) {
    return <AppLoader />
  }

  return (
    <section className={styles['section-wrapper']}>
      <Usage collectionId={collection?.id as string} />

      <div className={styles['separation-line']} />

      <div className={styles['middle-search-cta-wrapper']}>
        <SearchInput />
        <Link to="/collections" className="btn btn-secondary">
          {t('browseCollections')}
        </Link>
      </div>

      <div className={styles['separation-line']} />

      {collection && (
        <>
          <div className={styles['featured-items-wrapper']}>
            <FeaturedItems
              collectionRepository={collectionRepository}
              collectionId={collection.id}
              withLoadingSkeleton={true}
            />
            <div className={styles['separation-line']} />
          </div>
        </>
      )}

      <Metrics dataverseHubRepository={dataverseHubRepository} />
    </section>
  )
}

export default Homepage
