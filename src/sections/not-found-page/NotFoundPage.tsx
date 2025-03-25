import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { Route } from '../Route.enum'
import styles from './NotFoundPage.module.scss'

interface NotFoundPageProps {
  dvObjectNotFoundType?: 'collection' | 'dataset' | 'file'
  dvObjectNotFoundName?: string
}

export const NotFoundPage = ({ dvObjectNotFoundType, dvObjectNotFoundName }: NotFoundPageProps) => {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('notFoundPage')

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <section className={styles['section-wrapper']} data-testid="not-found-page">
      <div className={styles['middle-wrapper']}>
        <span className={styles.number}>{t('statusNumberNotFound')}</span>

        <h1 className={styles.copy}>
          <Trans
            t={t}
            i18nKey="message"
            values={{ type: 'Page' }}
            components={{
              1: <strong />
            }}
          />
        </h1>
        <Link to={Route.HOME} className={`${styles.btn} btn btn-primary`}>
          {t('backToHomepage', { brandName: 'Dataverse' })}
        </Link>
      </div>
    </section>
  )
}
