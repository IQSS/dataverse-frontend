import { useTranslation, Trans } from 'react-i18next'
import { RouteWithParams } from '@/sections/Route.enum'
import { Link } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import styles from './PublishDatasetHelpText.module.scss'
import { TFunction } from 'i18next'

interface PublishDatasetHelpTextProps {
  releasedVersionExists: boolean
  nextMajorVersion: string
  parentCollectionIsReleased: boolean
  parentCollectionName: string
  parentCollectionId: string
  requiresMajorVersionUpdate: boolean
}

function renderWarningText(
  t: TFunction,
  releasedVersionExists: boolean,
  parentCollectionIsReleased: boolean,
  parentCollectionName: string,
  parentCollectionId: string
) {
  return (
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
  )
}
function renderSubText(
  t: TFunction,
  releasedVersionExists: boolean,
  requiresMajorVersionUpdate: boolean,
  nextMajorVersion: string,
  parentCollectionIsReleased: boolean
) {
  return (
    <p className={styles.secondaryText}>
      {!releasedVersionExists && !parentCollectionIsReleased && (
        <>{t('publish.releaseCollectionSubtext')}</>
      )}
      {!releasedVersionExists && parentCollectionIsReleased && <>{t('publish.draftSubtext')}</>}
      {releasedVersionExists && !requiresMajorVersionUpdate && (
        <>{t('publish.previouslyReleasedSubtext')}</>
      )}
      {releasedVersionExists && requiresMajorVersionUpdate && (
        <>{t('publish.requiresMajorReleaseSubtext', { versionNumber: nextMajorVersion })}</>
      )}
    </p>
  )
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
      {renderWarningText(
        t,
        releasedVersionExists,
        parentCollectionIsReleased,
        parentCollectionName,
        parentCollectionId
      )}

      {renderSubText(
        t,
        releasedVersionExists,
        requiresMajorVersionUpdate,
        nextMajorVersion,
        parentCollectionIsReleased
      )}
    </Stack>
  )
}
