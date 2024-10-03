import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from './search-input/SearchInput'
import { useLoading } from '../loading/LoadingContext'
import styles from './Homepage.module.scss'

export const Homepage = () => {
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])

  return (
    <section className={styles['section-wrapper']}>
      <div className={styles['middle-search-cta-wrapper']}>
        <SearchInput />
        <Link to="/collections" className="btn btn-secondary">
          Browse Collections
        </Link>
      </div>
    </section>
  )
}

export default Homepage
