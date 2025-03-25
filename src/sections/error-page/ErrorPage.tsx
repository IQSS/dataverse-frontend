import { useTranslation } from 'react-i18next'
import { useRouteError, Link } from 'react-router-dom'
import styles from './ErrorPage.module.scss'
import { useErrorLogger } from './useErrorLogger'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { useTheme } from '@iqss/dataverse-design-system'
import { Route } from '../Route.enum'
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
          <h1>
            {t('message.heading')}
            <span>{t('message.errorText')}</span>
          </h1>
        </div>

        <Link to={Route.HOME} className="btn btn-secondary">
          {t('backToHomepage', { brandName: t('brandName') })}
        </Link>
      </div>
    </section>
  )
}
