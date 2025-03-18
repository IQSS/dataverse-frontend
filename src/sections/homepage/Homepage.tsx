import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useCollection } from '../collection/useCollection'
import { FeaturedItems } from '../collection/featured-items/FeaturedItems'
import { SearchInput } from './search-input/SearchInput'
import { useLoading } from '../loading/LoadingContext'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import styles from './Homepage.module.scss'

interface HomepageProps {
  collectionRepository: CollectionRepository
}

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
      <div style={{ minWidth: '100%' }}>
        <h3>Stats</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus pariatur animi quam
          officiis nemo dolore nisi, iure amet minus, impedit cumque incidunt sapiente, molestias
          quos et vel tenetur sit blanditiis laborum porro sequi. Cupiditate magnam laborum
          quibusdam mollitia atque quas consequatur, quasi omnis iste veritatis, suscipit maiores
          libero consequuntur vel voluptatum provident nisi! Molestiae dolorum eligendi et explicabo
          culpa accusamus consectetur, expedita labore harum iste enim quam laborum nulla dolore
          laboriosam dignissimos. Quis consequatur quidem, unde libero vero adipisci! Repellendus
          itaque voluptatibus dolore natus placeat laudantium quis iste amet alias incidunt!
        </p>
      </div>

      <div className={styles['middle-search-cta-wrapper']}>
        <SearchInput />
        <Link to="/collections" className="btn btn-secondary">
          Browse Collections
        </Link>
      </div>

      {collection && (
        <div className={styles['featured-items-wrapper']}>
          <FeaturedItems
            collectionRepository={collectionRepository}
            collectionId={collection.id}
            hideTitle
          />
        </div>
      )}
    </section>
  )
}

export default Homepage
