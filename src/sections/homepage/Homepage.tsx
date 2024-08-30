import { SearchInput } from './search-input/SearchInput'
import styles from './Homepage.module.scss'
import { useLoading } from '../loading/LoadingContext'
import { useEffect } from 'react'
// import { Button, ButtonGroup } from '@iqss/dataverse-design-system'

// TODO:ME - New footer only for the homepage, replicate harvard installation? under discussion

export const Homepage = () => {
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])

  return (
    <section className={styles['section-wrapper']}>
      <div className={styles['middle-search-cta-wrapper']}>
        <SearchInput />

        {/* <Button variant="secondary">Browse Collections</Button> */}

        {/* <div className={styles['btn-group']}>
          <Button variant="secondary">Browse Collections</Button>
          <Button variant="secondary">Advanced Search</Button>
        </div> */}
      </div>
    </section>
  )
}

export default Homepage
