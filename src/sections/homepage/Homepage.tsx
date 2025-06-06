import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { SearchRepository } from '@/search/domain/repositories/SearchRepository'
import { useGetSearchServices } from '@/search/domain/hooks/useGetSearchServices'
import { useCollection } from '../collection/useCollection'
import { FeaturedItems } from '../collection/featured-items/FeaturedItems'
import { useLoading } from '../loading/LoadingContext'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { SearchInput } from './search-input/SearchInput'
import { Metrics } from './metrics/Metrics'
import { Usage } from './usage/Usage'
import styles from './Homepage.module.scss'

// const searchServicesMock = [
//   {
//     name: 'postExternalSearch',
//     displayName: 'Natural Language Search'
//   },
//   {
//     name: 'solr',
//     displayName: 'Dataverse Standard Search'
//   }
// ]

interface HomepageProps {
  collectionRepository: CollectionRepository
  dataverseHubRepository: DataverseHubRepository
  searchRepository: SearchRepository
}

export const Homepage = ({
  collectionRepository,
  dataverseHubRepository,
  searchRepository
}: HomepageProps) => {
  const { collection, isLoading: isLoadingCollection } = useCollection(collectionRepository)
  const { searchServices, isLoadingSearchServices } = useGetSearchServices({
    searchRepository,
    autoFetch: true
  })
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('homepage')

  useEffect(() => {
    if (!isLoadingCollection && !isLoadingSearchServices) {
      setIsLoading(false)
    }
  }, [setIsLoading, isLoadingCollection, isLoadingSearchServices])

  if (isLoadingCollection || isLoadingSearchServices) {
    return <AppLoader />
  }

  return (
    <section className={styles['section-wrapper']}>
      <div className={styles['usage-wrapper']}>
        <Usage collectionId={collection?.id as string} />
      </div>

      <div className={styles['middle-search-cta-wrapper']}>
        <SearchInput searchDropdownPosition="right" searchServices={searchServices} />
        <Link to="/collections" className="btn btn-secondary">
          {t('browseCollections')}
        </Link>
      </div>

      {collection && (
        <>
          <div className={styles['featured-items-wrapper']}>
            <FeaturedItems
              collectionRepository={collectionRepository}
              collectionId={collection.id}
              withLoadingSkeleton={true}
            />
          </div>
        </>
      )}

      <div className={styles['metrics-wrapper']}>
        <Metrics dataverseHubRepository={dataverseHubRepository} />
      </div>
    </section>
  )
}

export default Homepage
