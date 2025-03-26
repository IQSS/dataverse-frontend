import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { Route } from '../Route.enum'
import styles from './NotFoundPage.module.scss'

interface NotFoundPageProps {
  dvObjectNotFoundType?: 'collection' | 'dataset' | 'file'
}

export const NotFoundPage = ({ dvObjectNotFoundType }: NotFoundPageProps) => {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('notFoundPage')
  const { t: tShared } = useTranslation('shared')

  useEffect(() => setIsLoading(false), [setIsLoading])

  const defineMessageType = (dvObjectNotFoundType?: 'collection' | 'dataset' | 'file') => {
    if (dvObjectNotFoundType === 'collection') {
      return tShared('collection')
    }
    if (dvObjectNotFoundType === 'dataset') {
      return tShared('dataset')
    }
    if (dvObjectNotFoundType === 'file') {
      return tShared('file')
    }
    return tShared('page')
  }

  return (
    <section className={styles['section-wrapper']} data-testid="not-found-page">
      <div className={styles['middle-wrapper']}>
        <span className={styles.number}>{t('statusNumberNotFound')}</span>

        <h1 className={styles.copy}>
          <Trans
            t={t}
            i18nKey="message"
            values={{ type: defineMessageType(dvObjectNotFoundType) }}
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
