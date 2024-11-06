import { Trans, useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Button } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'

export const ApiTokenSectionSkeleton = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  return (
    <>
      <p className={accountStyles['helper-text']}>
        <Trans
          t={t}
          i18nKey="helperText"
          components={{
            anchor: (
              <a
                href="http://guides.dataverse.org/en/latest/api"
                target="_blank"
                rel="noreferrer"
              />
            )
          }}
        />
      </p>
      <SkeletonTheme>
        <div data-testid="loadingSkeleton">
          <p className={styles['exp-date']}>
            {t('expirationDate')}{' '}
            <time data-testid="expiration-date">
              <Skeleton width={100} />
            </time>
          </p>
          <div className={styles['api-token']}>
            <code data-testid="api-token">
              <Skeleton width={350} />
            </code>
          </div>
          <div className={styles['btns-wrapper']} role="group">
            <Button variant="secondary">{t('copyToClipboard')}</Button>
            <Button variant="secondary">{t('recreateToken')}</Button>
            <Button variant="secondary">{t('revokeToken')}</Button>
          </div>
        </div>
      </SkeletonTheme>
    </>
  )
}
