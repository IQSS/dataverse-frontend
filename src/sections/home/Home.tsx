import styles from './Home.module.scss'
import { Row } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function Home() {
  const { t } = useTranslation('home')

  return (
    <Row>
      <header>
        <h1 className={styles.title}>{t('title')}</h1>
      </header>
      <section className={styles.container}>
        <div className={styles.results}>
          <p>1 to 10 of 41 Results</p>
        </div>
        <article>
          <a href="/datasets?persistentId=1">Dataset 1</a>
        </article>
        <article>
          <a href="/datasets?persistentId=2">Dataset 2</a>
        </article>
        <article>
          <a href="/datasets?persistentId=3">Dataset 3</a>
        </article>
      </section>
    </Row>
  )
}
