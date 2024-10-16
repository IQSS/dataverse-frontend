import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Button } from '@iqss/dataverse-design-system'
import styles from './ApiTokenSection.module.scss'
import { useTranslation } from 'react-i18next'

const ApiTokenSectionSkeleton = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  return (
    <SkeletonTheme>
      <>
        <p className={styles['exp-date']}>
          {t('expirationDate')}{' '}
          <time data-testid="expiration-date">
            <Skeleton width={100} />
          </time>
        </p>
        <div className={styles['api-token']}>
          <code data-testid="api-token">
            <Skeleton />
          </code>
        </div>
        <div className={styles['btns-wrapper']} role="group">
          <Button variant="secondary">{t('copyToClipboard')}</Button>
          <Button variant="secondary" disabled>
            {t('recreateToken')}
          </Button>
          <Button variant="secondary" disabled>
            {t('revokeToken')}
          </Button>
        </div>
      </>
    </SkeletonTheme>
  )
}
export default ApiTokenSectionSkeleton
