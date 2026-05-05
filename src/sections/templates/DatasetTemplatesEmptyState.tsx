import { Trans, useTranslation } from 'react-i18next'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './DatasetTemplates.module.scss'

interface DatasetTemplatesEmptyStateProps {
  collectionId: string
}

export const DatasetTemplatesEmptyState = ({ collectionId }: DatasetTemplatesEmptyStateProps) => {
  const { t } = useTranslation('datasetTemplates')

  const emptyStateWhyBullets = t('emptyState.whyBullets', {
    returnObjects: true
  }) as string[]
  const emptyStateHowBullets = t('emptyState.howBullets', {
    returnObjects: true
  }) as string[]

  const generalInfoUrl = `/spa${RouteWithParams.EDIT_COLLECTION(collectionId)}`
  const templatesGuideUrl =
    'https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-templates'

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
          <li>
            <Trans
              t={t}
              i18nKey="emptyState.howNote"
              components={{
                anchor: <a href={generalInfoUrl} target="_blank" rel="noreferrer" />
              }}
            />
          </li>
        </ul>
        <p>
          <Trans
            t={t}
            i18nKey="emptyState.footer"
            components={{
              anchor: <a href={templatesGuideUrl} target="_blank" rel="noreferrer" />
            }}
          />
        </p>
      </div>
    </div>
  )
}
