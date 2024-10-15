import { useTranslation } from 'react-i18next'
import { useRouteError, Link } from 'react-router-dom'
import styles from './ErrorPage.module.scss'
import { useErrorLogger } from './useErrorLogger'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { useTheme } from '@iqss/dataverse-design-system'
import cn from 'classnames'

interface AppLoaderProps {
  fullViewport?: boolean
}

export function ErrorPage({ fullViewport = false }: AppLoaderProps) {
  const { t } = useTranslation('errorPage')
  const error = useRouteError()
  useErrorLogger(error)
  const theme = useTheme()

  return (
    <section
      className={cn(styles['section-wrapper'], {
        [styles['full-viewport']]: fullViewport
      })}>
      <div className={styles['middle-errorMessage-wrapper']}>
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
