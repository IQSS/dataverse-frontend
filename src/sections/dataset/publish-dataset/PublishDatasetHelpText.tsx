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

function getWarningTextKey(
  releasedVersionExists: boolean,
  parentCollectionIsReleased: boolean | undefined
): string {
  if (!releasedVersionExists) {
    if (!parentCollectionIsReleased) {
      return 'publish.releaseCollectionQuestion'
    } else return 'publish.draftQuestion'
  }
  return 'publish.previouslyReleasedQuestion'
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
  const warningText = getWarningTextKey(releasedVersionExists, parentCollectionIsReleased)

  return (
    <Stack direction="vertical">
      <p className={styles.warningText}>
        {!parentCollectionIsReleased ? (
          <Trans
            t={t}
            i18nKey={warningText}
            values={{ parentCollectionName }}
            components={{ a: <Link to={RouteWithParams.COLLECTIONS(parentCollectionId)} /> }}
          />
        ) : (
          <>{t(warningText)}</>
        )}
      </p>
      <p>{t('publish.termsText')}</p>
    </Stack>
  )
}
