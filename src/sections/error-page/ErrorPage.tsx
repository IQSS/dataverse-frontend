import { useTranslation } from 'react-i18next'
import { useRouteError, Link } from 'react-router-dom'
import styles from './ErrorPage.module.scss'
import { useErrorLogger } from './useErrorLogger'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { useTheme } from '@iqss/dataverse-design-system'

export function ErrorPage() {
  const { t } = useTranslation('ErrorPage')
  const error = useRouteError()
  useErrorLogger(error)
  const theme = useTheme()

  return (
    <section className={styles['section-wrapper']}>
      <div className={styles['middle-search-cta-wrapper']}>
        <div className={styles['icon-layout']}>
          <ExclamationCircle color={theme.color.dangerColor} size={62} />
          <div aria-label="error-page">
            <h1>Oops,</h1>
            <h4>something went wrong...</h4>
          </div>
        </div>

        <Link to="/" className="btn btn-secondary">
          {t('Back to Dataverse Homepage')}
        </Link>
      </div>
    </section>
  )
}
