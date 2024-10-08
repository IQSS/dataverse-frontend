import { useTranslation } from 'react-i18next'
import { useRouteError, Link } from 'react-router-dom'
import styles from './ErrorPage.module.scss'
import { useErrorLogger } from './useErrorLogger'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { useTheme } from '@iqss/dataverse-design-system'

export function ErrorPage() {
  const { t } = useTranslation('errorPage')
  const error = useRouteError()
  useErrorLogger(error)
  const theme = useTheme()

  const header = document.querySelector('nav')
  const footer = document.querySelector('footer')
  const newMinHeight = header && footer ? '$main-container-available-height' : '100vh'
  document.documentElement.style.setProperty('--error-min-height', newMinHeight)

  return (
    <section className={styles['section-wrapper']}>
      <div className={styles['middle-search-cta-wrapper']}>
        <div className={styles['icon-layout']}>
          <ExclamationCircle color={theme.color.dangerColor} size={62} />
          <div aria-label="error-page">
            <h1>{t('message.heading')}</h1>
            <h4>{t('message.errorText')}</h4>
          </div>
        </div>

        <Link to="/" className="btn btn-secondary">
          {t('backToHomepage', { brandName: t('brandName') })}
        </Link>
      </div>
    </section>
  )
}
