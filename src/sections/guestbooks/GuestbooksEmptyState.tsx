import { Trans, useTranslation } from 'react-i18next'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './Guestbooks.module.scss'

interface GuestbooksEmptyStateProps {
  collectionId: string
}

export const GuestbooksEmptyState = ({ collectionId }: GuestbooksEmptyStateProps) => {
  const { t } = useTranslation('guestbooks')
  const emptyStateWhyBullets = t('emptyState.whyBullets', {
    returnObjects: true
  }) as string[]
  const emptyStateHowBullets = t('emptyState.howBullets', {
    returnObjects: true
  }) as string[]

  const generalInfoUrl = `/spa${RouteWithParams.EDIT_COLLECTION(collectionId)}`
  const guestbooksGuideUrl =
    'https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-guestbooks'

  return (
    <div className={styles['empty-state']}>
      <div>
        <h2>{t('emptyState.whyTitle')}</h2>
        <ul>
          {emptyStateWhyBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>{t('emptyState.howTitle')}</h2>
        <ul>
          {emptyStateHowBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          <Trans
            t={t}
            i18nKey="emptyState.footer"
            components={{
              anchorGeneral: <a href={generalInfoUrl} target="_blank" rel="noreferrer" />,
              anchorGuide: <a href={guestbooksGuideUrl} target="_blank" rel="noreferrer" />
            }}
          />
        </p>
      </div>
    </div>
  )
}
