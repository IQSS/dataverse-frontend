import { SearchInput } from './search-input/SearchInput'
import styles from './Homepage.module.scss'

export const Homepage = () => {
  return (
    <section className={styles['section-wrapper']}>
      <SearchInput />
    </section>
  )
}

export default Homepage
