import { Spinner } from '@iqss/dataverse-design-system'
import styles from './AppLoader.module.scss'

export const AppLoader = () => {
  return (
    <section className={styles['app-loader']}>
      <Spinner />
    </section>
  )
}
