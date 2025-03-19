import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
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
}

// TODO:ME - Create Feaured Item by id page
// TODO:ME - Use that page component for showing it in the preview carousel
// TODO:ME - Modify card to show dvObject types and make a storybook example

export const Homepage = ({ collectionRepository }: HomepageProps) => {
  const { collection, isLoading: isLoadingCollection } = useCollection(collectionRepository)
  const { setIsLoading } = useLoading()

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
          Browse Collections
        </Link>
      </div>

      <div className={styles['separation-line']} />

      {collection && (
        <>
          <div className={styles['featured-items-wrapper']}>
            <FeaturedItems
              collectionRepository={collectionRepository}
              collectionId={collection.id}
              // hideTitle
            />
          </div>
          <div className={styles['separation-line']} />
        </>
      )}

      <Metrics />
    </section>
  )
}

export default Homepage
