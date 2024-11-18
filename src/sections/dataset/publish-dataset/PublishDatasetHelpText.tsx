import { useTranslation, Trans } from 'react-i18next'
import { RouteWithParams } from '@/sections/Route.enum'
import { Link } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import styles from './PublishDatasetHelpText.module.scss'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
  nextMajorVersion: string
  parentCollectionIsReleased: boolean | undefined
  parentCollectionName: string
  parentCollectionId: string
  requiresMajorVersionUpdate?: boolean
}

export function PublishDatasetHelpText({
  releasedVersionExists,
  nextMajorVersion,
  parentCollectionIsReleased,
  parentCollectionName,
  parentCollectionId,
  requiresMajorVersionUpdate
}: PublishDatasetHelpTextProps) {
  const { t } = useTranslation('dataset')

  return (
    <Stack direction="vertical">
      <p className={styles.warningText}>
        {!releasedVersionExists && parentCollectionIsReleased && <>{t('publish.draftQuestion')}</>}
        {!releasedVersionExists && !parentCollectionIsReleased && (
          <Trans
            t={t}
            i18nKey={'publish.releaseCollectionQuestion'}
            values={{ parentCollectionName }}
            components={{ a: <Link to={RouteWithParams.COLLECTIONS(parentCollectionId)} /> }}
          />
        )}
        {releasedVersionExists && <>{t('publish.previouslyReleasedQuestion')}</>}
      </p>
      <p>
        {releasedVersionExists && requiresMajorVersionUpdate && (
          <>{t('publish.requiresMajorRelease', { versionNumber: nextMajorVersion })}</>
        )}
      </p>
      <p>{t('publish.termsText')}</p>
    </Stack>
  )
}
