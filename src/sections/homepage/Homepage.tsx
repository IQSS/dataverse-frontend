import { SearchInput } from './search-input/SearchInput'
import styles from './Homepage.module.scss'

// TODO:ME - New footer only for the homepage, replicate harvard installation? under discussion

export const Homepage = () => {
  return (
    <section className={styles['section-wrapper']}>
      <SearchInput />
    </section>
  )
}

export default Homepage
